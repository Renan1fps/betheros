# 🤖 AI Code Reviewer

Revisão automática de PRs com IA, acionada por `@codeReviewer` em comentários.

Os comentários são postados **diretamente nas linhas do código** — não como um bloco geral.

Suporta **Claude (Anthropic)**, **GPT-4/o3 (OpenAI)** e **Gemini (Google)** — configurável por variável de ambiente.

---

## Como fica no PR

```
src/services/user.ts linha 42
  🔴 CRITICAL
  Chamada async sem try/catch — erros não tratados podem derrubar o processo.

src/utils/helper.ts linha 17
  🟡 WARNING
  Uso de `var` — substitua por `const` conforme o style guide.

src/controllers/auth.ts linha 88
  🔵 SUGGESTION
  Esta função tem 45 linhas. Considere extrair a validação para uma função separada.
```

---

## 📁 Estrutura

```
.github/
  workflows/
    code-review-mention.yml   # Gatilho por @codeReviewer
scripts/
  review.js                   # Orquestrador principal
  style-guide.md              # Regras (edite este!)
  providers/
    anthropic.js
    openai.js
    gemini.js
package.json
```

---

## ⚙️ Setup

### 1. Configure no GitHub

**Settings → Secrets and variables → Actions**

#### Secrets (API Keys)

| Secret | Provider |
|---|---|
| `ANTHROPIC_API_KEY` | Claude (Anthropic) |
| `OPENAI_API_KEY` | GPT-4 / o3 (OpenAI) |
| `GEMINI_API_KEY` | Gemini (Google) |

> Adicione apenas a key do provider que for usar.

#### Variables (configurações)

| Variable | Padrão | Opções |
|---|---|---|
| `LLM_PROVIDER` | `anthropic` | `anthropic` · `openai` · `gemini` |
| `LLM_MODEL` | _(padrão do provider)_ | qualquer modelo válido |

**Modelos padrão:**
- `anthropic` → `claude-opus-4-5`
- `openai` → `gpt-4o`
- `gemini` → `gemini-1.5-pro`

### 2. Edite o style guide

Abra `scripts/style-guide.md` e ajuste as regras para o seu projeto.

---

## 🚀 Como usar

Comente qualquer coisa com `@codeReviewer` em um PR:

```
@codeReviewer pode revisar?
```

### Opções avançadas

```
@codeReviewer --model=gpt-4o --focus=security
```

| Argumento | Descrição | Exemplo |
|---|---|---|
| `--model` | Sobrescreve o modelo configurado | `--model=claude-opus-4-5` |
| `--focus` | Direciona o foco da revisão | `--focus=performance` |

---

## 🔄 Trocar de provider

Altere a variável `LLM_PROVIDER` em **Settings → Variables** — sem mexer em nenhum arquivo.