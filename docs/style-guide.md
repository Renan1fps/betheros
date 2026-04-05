# Style Guide do Projeto

--- mpr-zpia-ypt

## JavaScript / TypeScript

- Use `const` e `let` — **nunca** `var`
- Prefira arrow functions para callbacks
- Sempre tipar parâmetros e retornos em TypeScript
- Evite `any` — use tipos explícitos ou `unknown`
- Imports devem ser ordenados: externos → internos → relativos

## Nomenclatura

- `camelCase` para variáveis e funções
- `PascalCase` para classes e tipos
- `UPPER_SNAKE_CASE` para constantes globais
- Nomes devem ser descritivos — evite abreviações como `usr`, `btn`, `tmp`

## Funções

- Máximo de 30 linhas por função
- Uma responsabilidade por função (Single Responsibility)
- Evite mais de 3 parâmetros — prefira passar um objeto
- Sempre trate erros em funções `async/await`

## Código Limpo

- Sem `console.log` em código de produção
- Sem código comentado — use git para histórico
- Sem `TODO` sem issue associada
- DRY: evite duplicação de lógica

## Segurança

- Nunca exponha variáveis de ambiente no cliente
- Sempre valide e sanitize inputs externos
- Evite `eval()` e `Function()` dinâmicas

## Testes

- Todo novo comportamento deve ter testes
- Nomes de teste devem descrever o comportamento esperado: `should return 404 when user not found`
- Evite mocks excessivos — prefira testes de integração onde possível

---