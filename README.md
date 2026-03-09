# Betheros API — NestJS + MikroORM + Hexagonal Architecture

## Stack
- **Framework**: NestJS
- **ORM**: MikroORM (PostgreSQL driver)
- **Architecture**: Hexagonal (Ports & Adapters)
- **Language**: TypeScript

---

## Arquitetura Hexagonal

Cada módulo segue a divisão em 3 camadas:

```
src/modules/<module>/
├── domain/                         ← Núcleo (independente de frameworks)
│   ├── entities/                   ← Entidades de domínio (imutáveis)
│   └── repositories/               ← Portas (interfaces/contratos)
├── application/
│   └── use-cases/                  ← Casos de uso (orquestram o domínio)
└── infrastructure/
    ├── persistence/
    │   ├── entities/               ← ORM entities (MikroORM)
    │   ├── mappers/                ← Domain ↔ ORM
    │   └── repositories/          ← Adaptadores (implementam as portas)
    └── http/
        ├── controllers/            ← Entrypoints HTTP
        └── dtos/                   ← Validação de input/output
```

### Fluxo de dados
```
HTTP Request
  → Controller (DTO validation)
    → Use Case (business logic)
      → Repository Port (interface)
        → Repository Impl (MikroORM)
          → PostgreSQL
```

---

## Módulos

| Módulo | Tabela | Descrição |
|---|---|---|
| `users` | `users`, `user_auth_providers` | Usuários e provedores OAuth |
| `subscriptions` | `subscriptions` | Assinaturas dos usuários |
| `payments` | `payments` | Pagamentos das assinaturas |
| `matches` | `matches` | Partidas de futebol |
| `match-statistics` | `match_statistics_snapshots` | Snapshots de estatísticas por minuto |
| `match-analyses` | `match_analyses` | Probabilidades calculadas pelo modelo |
| `match-tips` | `match_tips` | Dicas geradas pelas análises |

---

## Configuração

### 1. Variáveis de ambiente
```bash
cp .env.example .env
# Edite com suas credenciais do banco
```

### 2. Instalar dependências
```bash
npm install
```

### 3. Subir o banco de dados localmente o banco
```sql
docker compose -f docker-compose.yml up -d
```

### 4. Rodar migrations
```bash
npm run migration:up
```

### 5. Iniciar
```bash
npm run start:dev
```

### 6. Swagger
Acesse: `http://localhost:3000/api/docs`

---

## Padrões adotados

- **Entidades imutáveis**: toda mutação retorna uma nova instância
- **Symbol como token de injeção**: evita colisões de nomes (`USER_REPOSITORY`, etc.)
- **Mapper pattern**: separação completa entre ORM entity e domain entity
- **Use Cases únicos por responsabilidade**: `CreateUserUseCase`, `GetUserUseCase`, etc.
- **Portas tipadas**: interfaces com contratos explícitos para todos os repositórios
