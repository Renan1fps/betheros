// scripts/review.js
// Orquestrador principal do AI Code Reviewer — com comentários inline por linha

const { Octokit } = require('@octokit/rest');
const fs = require('fs');
const path = require('path');

// ─── Configuração ────────────────────────────────────────────────────────────

const PROVIDER = (process.env.LLM_PROVIDER || 'anthropic').toLowerCase();
const MODEL = process.env.LLM_MODEL || '';
const [OWNER, REPO] = (process.env.REPO || '').split('/');
const PR_NUMBER = parseInt(process.env.PR_NUMBER);

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

// ─── Seleciona o provider ─────────────────────────────────────────────────────

const PROVIDERS = {
  anthropic: './providers/anthropic',
  openai: './providers/openai',
  gemini: './providers/gemini',
};

if (!PROVIDERS[PROVIDER]) {
  console.error(`❌ Provider desconhecido: "${PROVIDER}". Use: anthropic | openai | gemini`);
  process.exit(1);
}

const llm = require(PROVIDERS[PROVIDER]);

// ─── Carrega o style guide ────────────────────────────────────────────────────

function loadStyleGuide() {
  const stylePath = path.join(__dirname, 'style-guide.md');
  if (!fs.existsSync(stylePath)) {
    console.warn('⚠️  style-guide.md não encontrado. Revisão sem regras customizadas.');
    return '';
  }
  return fs.readFileSync(stylePath, 'utf-8');
}

// ─── Extrai parâmetros opcionais do comentário ────────────────────────────────
// Ex: @codeReviewer --model=gpt-4o --focus=security

function parseCommentArgs(commentBody = '') {
  const overrides = {};
  const modelMatch = commentBody.match(/--model=(\S+)/);
  if (modelMatch) overrides.model = modelMatch[1];
  const focusMatch = commentBody.match(/--focus=(\S+)/);
  if (focusMatch) overrides.focus = focusMatch[1];
  return overrides;
}

// ─── Busca o diff do PR ───────────────────────────────────────────────────────

async function getPRDiff() {
  const { data: files } = await octokit.pulls.listFiles({
    owner: OWNER,
    repo: REPO,
    pull_number: PR_NUMBER,
    per_page: 30,
  });

  const relevant = files.filter(f => f.patch);

  if (relevant.length === 0) {
    throw new Error('Nenhum arquivo com diff encontrado no PR.');
  }

  return {
    files: relevant,
    summary: `${files.length} arquivo(s) alterado(s)`,
    // Diff com número de linha anotado — essencial para comentários inline
    diff: relevant.map(f => {
      const lines = f.patch.split('\n');
      let lineNumber = 0;
      const annotated = lines.map(line => {
        if (line.startsWith('@@')) {
          const match = line.match(/\+(\d+)/);
          lineNumber = match ? parseInt(match[1]) - 1 : lineNumber;
          return line;
        }
        if (!line.startsWith('-')) lineNumber++;
        const prefix = line.startsWith('+') ? `[linha ${lineNumber}] ` : '            ';
        return `${prefix}${line}`;
      });
      return `### 📄 ${f.filename}\n\`\`\`diff\n${annotated.join('\n')}\n\`\`\``;
    }).join('\n\n'),
  };
}

// ─── Monta o prompt ───────────────────────────────────────────────────────────

function buildPrompt({ styleGuide, diff, summary, focus }) {
  const focusSection = focus
      ? `\n## Foco da Revisão\nConcentre-se especialmente em: **${focus}**\n`
      : '';

  return `Você é um revisor de código sênior. Analise o diff abaixo e retorne APENAS um JSON válido, sem texto extra, sem markdown, sem blocos de código.

${styleGuide ? `## Style Guide e Regras do Projeto\n${styleGuide}` : ''}
${focusSection}
## PR — ${summary}

${diff}

## Formato de resposta — JSON puro, sem nada fora do JSON:
{
  "summary": "Resumo geral do PR em 2-3 linhas",
  "verdict": "approved | needs_changes | comment",
  "comments": [
    {
      "path": "caminho/do/arquivo.ts",
      "line": 42,
      "severity": "critical | warning | suggestion | praise",
      "body": "Explicação clara e construtiva do problema ou elogio"
    }
  ]
}

## Regras obrigatórias:
- Retorne APENAS o JSON — nenhum texto antes ou depois
- "path" deve ser exatamente o caminho do arquivo como aparece no diff (ex: src/utils/helper.ts)
- "line" deve ser o número da linha nova indicado como [linha N] no diff — apenas linhas com + ou contexto
- Máximo de 20 comentários — priorize os mais importantes
- Não comente linhas removidas (com -)
- Use "verdict": "approved" só se o código estiver realmente bom
- Severidades: critical = bug/segurança, warning = style guide, suggestion = melhoria, praise = elogio`;
}

// ─── Parse do JSON retornado pela IA ─────────────────────────────────────────

function parseReviewJSON(raw) {
  try {
    const clean = raw.replace(/```json|```/g, '').trim();
    return JSON.parse(clean);
  } catch (err) {
    console.error('❌ Falha ao parsear JSON da IA. Resposta recebida:\n', raw);
    throw new Error('A IA não retornou um JSON válido.');
  }
}

// ─── Emoji por severidade ─────────────────────────────────────────────────────

function severityEmoji(severity) {
  const map = { critical: '🔴', warning: '🟡', suggestion: '🔵', praise: '✅' };
  return map[severity] || '💬';
}

// ─── Valida comentários contra o diff real ────────────────────────────────────

function validateComments(comments, prFiles) {
  return comments.filter(comment => {
    const file = prFiles.find(f => f.filename === comment.path);
    if (!file) {
      console.warn(`⚠️  Arquivo ignorado (não está no diff): ${comment.path}`);
      return false;
    }
    if (!comment.line || isNaN(comment.line)) {
      console.warn(`⚠️  Comentário ignorado (linha inválida): ${comment.path}:${comment.line}`);
      return false;
    }
    return true;
  });
}

// ─── Posta o review com comentários inline ────────────────────────────────────

async function postReview({ summary, verdict, comments, providerInfo, prFiles }) {
  const { data: pr } = await octokit.pulls.get({
    owner: OWNER,
    repo: REPO,
    pull_number: PR_NUMBER,
  });

  const validComments = validateComments(comments, prFiles);
  console.log(`💬 ${validComments.length} comentários inline válidos de ${comments.length} gerados`);

  const reviewComments = validComments.map(c => ({
    path: c.path,
    line: c.line,
    body: `${severityEmoji(c.severity)} **${c.severity.toUpperCase()}**\n\n${c.body}`,
  }));

  const verdictMap = {
    approved: 'APPROVE',
    needs_changes: 'REQUEST_CHANGES',
    comment: 'COMMENT',
  };

  const header = [
    `## 🤖 AI Code Review`,
    `> **Provider:** \`${providerInfo.provider}\` · **Modelo:** \`${providerInfo.model}\``,
    ``,
    summary,
  ].join('\n');

  await octokit.pulls.createReview({
    owner: OWNER,
    repo: REPO,
    pull_number: PR_NUMBER,
    commit_id: pr.head.sha,     // ← obrigatório para inline reviews
    body: header,
    event: verdictMap[verdict] || 'COMMENT',
    comments: reviewComments,   // ← comentários por linha
  });
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`🚀 Iniciando review com provider: ${PROVIDER}`);

  const commentBody = process.env.COMMENT_BODY || '';
  const args = parseCommentArgs(commentBody);

  const modelToUse = args.model || MODEL || llm.DEFAULT_MODEL;
  console.log(`📦 Modelo: ${modelToUse}`);

  const styleGuide = loadStyleGuide();
  console.log(`📋 Style guide: ${styleGuide ? 'carregado' : 'não encontrado'}`);

  console.log(`🔍 Buscando diff do PR #${PR_NUMBER}...`);
  const { diff, summary, files: prFiles } = await getPRDiff();

  const prompt = buildPrompt({ styleGuide, diff, summary, focus: args.focus });

  console.log(`🤖 Enviando para ${PROVIDER}...`);
  const raw = await llm.review({ model: modelToUse, prompt });

  console.log(`🔎 Parseando resposta...`);
  const { summary: reviewSummary, verdict, comments } = parseReviewJSON(raw);

  console.log(`💬 Postando review inline no PR...`);
  await postReview({
    summary: reviewSummary,
    verdict,
    comments,
    providerInfo: { provider: PROVIDER, model: modelToUse },
    prFiles,
  });

  console.log(`✅ Review postado! Veredicto: ${verdict}`);
}

main().catch(err => {
  console.error('❌ Erro ao executar review:', err.message);
  process.exit(1);
});