# Tech Challenge 02 — Blog API

API REST para uma plataforma de blogging educacional, desenvolvida como segunda entrega do Tech Challenge FIAP Pós-Tech. A aplicação permite que **professores** criem, editem e excluam postagens, enquanto **alunos** podem visualizar e buscar conteúdo. A descrição completa dos requisitos está em [REQUISITOS.md](./REQUISITOS.md).

Disponível no Docker Hub:

```bash
docker pull fabriciopereiraviana/tech-challenge-02:latest
```

---

## Sumário

- [Setup inicial](#setup-inicial)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Arquitetura](#arquitetura)
- [Estrutura de diretórios](#estrutura-de-diretórios)
- [Endpoints da API](#endpoints-da-api)
- [Autenticação e autorização](#autenticação-e-autorização)
- [Documentação da API (Swagger)](#documentação-da-api-swagger)
- [Persistência de dados](#persistência-de-dados)
- [Testes unitários](#testes-unitários)
- [CI/CD com GitHub Actions](#cicd-com-github-actions)
- [Observabilidade](#observabilidade)
- [Docker](#docker)
- [Tecnologias utilizadas](#tecnologias-utilizadas)
- [Dificuldades encontradas](#dificuldades-encontradas)
- [Participante](#participante)

---

## Setup inicial

### Pré-requisitos

- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/) instalados.

### Passo a passo

1. Clone o repositório:

```bash
git clone https://github.com/Fabricio-P-Viana/fiap-pos-tech-challenge-02.git
cd fiap-pos-tech-challenge-02
```

2. Copie o arquivo de variáveis de ambiente e configure os valores:

```bash
cp .env-example .env
```

3. Suba todos os serviços:

```bash
docker-compose up -d --build
```

4. Acesse os serviços:

| Serviço    | URL                            |
| ---------- | ------------------------------ |
| API        | http://localhost:3000          |
| Swagger UI | http://localhost:3000/api-docs |
| Prometheus | http://localhost:9090          |
| Grafana    | http://localhost:9000          |
| pgAdmin    | http://localhost:8080          |

> A aplicação executa automaticamente as migrations do banco na subida do container.

---

## Variáveis de ambiente

| Variável                   | Descrição                            | Exemplo              |
| -------------------------- | ------------------------------------ | -------------------- |
| `DB_NAME`                  | Nome do banco de dados               | `blog`               |
| `DB_USER`                  | Usuário do PostgreSQL                | `postgres`           |
| `DB_PASS`                  | Senha do PostgreSQL                  | `postgres`           |
| `DB_HOST`                  | Host do banco de dados               | `db`                 |
| `DB_PORT`                  | Porta do banco de dados              | `5432`               |
| `POSTGRES_PASSWORD`        | Senha root do container Postgres     | `postgres`           |
| `JWT_SECRET`               | Segredo para assinar tokens JWT      | `meu_segredo`        |
| `PGADMIN_DEFAULT_EMAIL`    | Email Default para acessar o pgAdmin | `postgres@email.com` |
| `PGADMIN_DEFAULT_PASSWORD` | Senha Default para acessar o pgAdmin | `postgres`           |

---

## Arquitetura

O projeto segue a **Clean Architecture**, garantindo separação de responsabilidades, testabilidade, baixo acoplamento e independência de frameworks. As dependências apontam sempre para dentro — a lógica de negócio **nunca** depende de detalhes de infraestrutura.

```
┌─────────────────────────────────────────────────────────────┐
│                     Interface Adapters                       │
│  Controllers · Presenters · Routes · Middlewares             │
├─────────────────────────────────────────────────────────────┤
│                       Application                            │
│          Use Cases · DTOs (orquestração)                     │
├─────────────────────────────────────────────────────────────┤
│                         Domain                               │
│  Entities · Repository Interfaces · Service Interfaces       │
│  Erros de domínio · Regras de negócio                        │
├─────────────────────────────────────────────────────────────┤
│                      Infrastructure                          │
│  Sequelize Repositories · JWT Auth · DB Config               │
│  Migrations · Swagger · Prometheus                           │
└─────────────────────────────────────────────────────────────┘
```

### Camadas e responsabilidades

| Camada                 | Diretório                 | Responsabilidade                                                                                                                                                                                   |
| ---------------------- | ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Domain**             | `src/domain/`             | Entidades (`Post`, `User`), interfaces de repositório e serviço, erros de domínio e regras de negócio (ex: `canModifyUser`, `canModifyPost`).                                                      |
| **Application**        | `src/application/`        | DTOs com validação (ex: `CreatePostDTO`) e use cases que orquestram o fluxo (ex: `CreatePostUseCase`). Não possui lógica de negócio, apenas coordenação.                                           |
| **Interface Adapters** | `src/interface-adapters/` | Controllers (recebem HTTP e delegam para use cases), presenters (formatam a saída), rotas (composition root com injeção de dependência) e middlewares (auth, autorização, error handler, logging). |
| **Infrastructure**     | `src/infrastructure/`     | Implementações concretas: `SequelizePostRepository`, `SequelizeUserRepository`, `JwtAuthService`, configuração do banco, migrations, Swagger e Prometheus.                                         |

### Fluxo de uma requisição

```
Client → Route (composition root) → Middleware (auth/authorize)
       → Controller → Use Case → Repository Interface → Infrastructure (Sequelize → PostgreSQL)
       → Presenter → Response JSON
```

### Entry point e composition root

- **Entry point:** `src/server.ts` — inicializa Express, middlewares globais, rotas e conexão com o banco.
- **Composition root:** `src/interface-adapters/routes/*.ts` — cada arquivo de rota instancia os repositórios, monta os use cases e injeta no controller correspondente.

---

## Estrutura de diretórios

```
src/
├── domain/                          # Camada de domínio (entidades e contratos)
│   ├── entities/
│   │   ├── Post.ts                  # Entidade Post
│   │   └── User.ts                  # Entidade User (regras: canModifyUser, canModifyPost)
│   ├── errors/                      # Erros de domínio tipados
│   │   ├── InvalidCredentialsError.ts
│   │   ├── PostNotFoundError.ts
│   │   ├── UnauthorizedError.ts
│   │   ├── UserNotFoundError.ts
│   │   └── ValidationError.ts
│   ├── repositories/                # Interfaces dos repositórios
│   │   ├── PostRepository.ts
│   │   └── UserRepository.ts
│   └── services/
│       └── AuthService.ts           # Interface do serviço de autenticação
│
├── application/                     # Camada de aplicação (use cases e DTOs)
│   ├── auth/
│   │   ├── dtos/LoginDTO.ts
│   │   └── use-cases/Login.ts
│   ├── post/
│   │   ├── dtos/
│   │   │   ├── CreatePostDTO.ts
│   │   │   └── UpdatePostDTO.ts
│   │   └── use-cases/
│   │       ├── CreatePost.ts
│   │       ├── DeletePost.ts
│   │       ├── FindAllPost.ts
│   │       ├── FindOneByIdPost.ts
│   │       ├── SearchByWordPost.ts
│   │       └── UpdatePost.ts
│   └── user/
│       ├── dtos/
│       │   ├── CreateUserDTO.ts
│       │   └── UpdateUserDTO.ts
│       └── use-cases/
│           ├── CreateUser.ts
│           ├── DeleteUser.ts
│           ├── FindAllUser.ts
│           ├── FindOneByIdUser.ts
│           └── UpdateUser.ts
│
├── interface-adapters/              # Camada de adaptadores de interface
│   ├── controllers/
│   │   ├── AuthController.ts
│   │   ├── PostController.ts
│   │   └── UserController.ts
│   ├── middlewares/
│   │   ├── auth.ts                  # Validação do token JWT
│   │   ├── authorize.ts             # Verificação de role (TEACHER/STUDENT)
│   │   ├── errorHandler.ts          # Tratamento centralizado de erros
│   │   └── requestLogger.ts         # Log de requisições
│   ├── presenters/
│   │   ├── PostView.ts
│   │   └── UserView.ts
│   └── routes/                      # Composition root (injeção de dependência)
│       ├── authRoutes.ts
│       ├── postRoutes.ts
│       └── userRoutes.ts
│
├── infrastructure/                  # Camada de infraestrutura
│   ├── auth/services/
│   │   └── JwtAuthService.ts        # JWT + bcrypt
│   ├── database/
│   │   ├── config.ts
│   │   ├── sequelize.ts
│   │   ├── migrations/
│   │   └── models/
│   │       ├── PostModel.ts
│   │       └── UserModel.ts
│   ├── frameworks/
│   │   ├── prometheus.ts
│   │   └── swagger.ts
│   └── repositories/postgresql/
│       ├── SequelizePostRepository.ts
│       └── SequelizeUserRepository.ts
│
└── server.ts                        # Entry point da aplicação
```

---

## Endpoints da API

### Posts

| Método   | Rota            | Descrição                      | Auth | Role    |
| -------- | --------------- | ------------------------------ | ---- | ------- |
| `GET`    | `/posts`        | Listar todos os posts          | Não  | —       |
| `GET`    | `/posts/:id`    | Buscar post por ID             | Não  | —       |
| `GET`    | `/posts/search` | Buscar posts por palavra-chave | Não  | —       |
| `POST`   | `/posts`        | Criar um novo post             | Sim  | TEACHER |
| `PUT`    | `/posts/:id`    | Editar um post existente       | Sim  | TEACHER |
| `DELETE` | `/posts/:id`    | Excluir um post                | Sim  | TEACHER |

> **Busca:** `GET /posts/search?word=javascript` retorna posts cujo título ou conteúdo contém o termo.

### Usuários

| Método   | Rota         | Descrição                     | Auth | Role    |
| -------- | ------------ | ----------------------------- | ---- | ------- |
| `POST`   | `/users`     | Criar novo usuário (cadastro) | Não  | —       |
| `GET`    | `/users`     | Listar todos os usuários      | Sim  | TEACHER |
| `GET`    | `/users/:id` | Buscar usuário por ID         | Sim  | TEACHER |
| `PUT`    | `/users/:id` | Atualizar um usuário          | Sim  | —       |
| `DELETE` | `/users/:id` | Excluir um usuário            | Sim  | —       |

### Autenticação

| Método | Rota          | Descrição                 | Auth |
| ------ | ------------- | ------------------------- | ---- |
| `POST` | `/auth/login` | Login (retorna token JWT) | Não  |

---

## Autenticação e autorização

A aplicação usa **JWT (JSON Web Token)** para autenticação e **RBAC (Role-Based Access Control)** para autorização.

### Fluxo

1. O usuário se cadastra via `POST /users` (role padrão: `STUDENT`).
2. Realiza login via `POST /auth/login` e recebe um token JWT.
3. Envia o token no header `Authorization: Bearer <token>` nas rotas protegidas.

### Roles

| Role      | Permissões                                                                                |
| --------- | ----------------------------------------------------------------------------------------- |
| `TEACHER` | CRUD completo de posts, gerenciamento de usuários, pode alterar/deletar qualquer usuário. |
| `STUDENT` | Visualizar e buscar posts. Pode alterar e deletar apenas a si mesmo.                      |

### Regras de negócio na entidade `User`

As regras de autorização estão na **camada de domínio** (entidade `User`), seguindo Clean Architecture:

- `canModifyUser(targetUserId)` — retorna `true` se o usuário for `TEACHER` ou se estiver se modificando.
- `canModifyPost(postAuthorId)` — retorna `true` se o usuário for `TEACHER` e autor do post.

Os use cases apenas consultam essas regras, sem conter lógica de negócio.

---

## Documentação da API (Swagger)

A documentação interativa é gerada automaticamente com **swagger-jsdoc** + **swagger-ui-express**. As anotações Swagger estão definidas diretamente nos arquivos de rota usando JSDoc annotations.

Acesse localmente: **http://localhost:3000/api-docs**

---

## Persistência de dados

| Tecnologia     | Uso                                                                  |
| -------------- | -------------------------------------------------------------------- |
| **PostgreSQL** | Banco de dados relacional                                            |
| **Sequelize**  | ORM para mapeamento objeto-relacional                                |
| **Migrations** | Versionamento do schema em `src/infrastructure/database/migrations/` |

### Modelos

- **PostModel** — `id`, `title`, `content`, `authorId` (FK para `users`), `createdAt`, `updatedAt`
- **UserModel** — `id`, `name`, `email` (unique), `password` (hash bcrypt), `role` (TEACHER/STUDENT), `createdAt`, `updatedAt`

## Testes unitários

Os testes foram escritos com **Jest** seguindo a estratégia **AAA (Arrange, Act, Assert)**:

- **Arrange** — prepara os mocks e dados de entrada.
- **Act** — executa o caso de uso ou DTO.
- **Assert** — verifica os valores e comportamentos esperados.

### Cobertura

| Métrica    | Cobertura  |
| ---------- | ---------- |
| Statements | **97.67%** |
| Branches   | **91.71%** |
| Functions  | **98.03%** |
| Lines      | **98.00%** |

### Suites de teste (18 suites, 79 testes)

```
tests/
├── domain/entities/
│   └── User.test.ts                    # Entidade User (isTeacher, isMe, canModifyUser, canModifyPost)
├── application/
│   ├── auth/
│   │   ├── dtos/LoginDTO.test.ts       # Validação do LoginDTO
│   │   └── use-cases/Login.test.ts     # Login com credenciais válidas/inválidas
│   ├── Post/
│   │   ├── dtos/
│   │   │   ├── CreatePostDTO.test.ts   # Validação do CreatePostDTO
│   │   │   └── UpdatePostDTO.test.ts   # Validação do UpdatePostDTO
│   │   └── use-cases/
│   │       ├── CreatePost.test.ts
│   │       ├── DeletePost.test.ts
│   │       ├── FindAllPost.test.ts
│   │       ├── FindOneByIdPost.test.ts
│   │       ├── SearchByWordPost.test.ts
│   │       └── UpdatePost.test.ts
│   └── User/
│       ├── dtos/
│       │   ├── CreateUserDTO.test.ts   # Validação do CreateUserDTO
│       │   └── UpdateUserDTO.test.ts   # Validação do UpdateUserDTO
│       └── use-cases/
│           ├── CreateUser.test.ts
│           ├── DeleteUser.test.ts
│           ├── FindAllUser.test.ts
│           ├── FindOneByIdUser.test.ts
│           └── UpdateUser.test.ts
```

### Executar testes

```bash
npm run test              # Rodar todos os testes
npx jest --coverage       # Rodar com relatório de cobertura
```

---

## CI/CD com GitHub Actions

O pipeline de CI/CD está em `.github/workflows/main.yaml` e é executado automaticamente a cada push na branch `master`:

1. **Checkout** do código
2. **Setup** do Node.js 22 com cache npm
3. **Instalação** das dependências (`npm ci`)
4. **Execução dos testes** (`npm run test`)
5. **Build e push** da imagem Docker para o Docker Hub com tags:
   - `latest`
   - SHA do commit (`<sha>`)

> A imagem é publicada como `fabriciopereiraviana/tech-challenge-02`.

---

## Observabilidade

A aplicação possui monitoramento integrado:

| Ferramenta     | Função                                         | URL                   |
| -------------- | ---------------------------------------------- | --------------------- |
| **Prometheus** | Coleta de métricas HTTP (method, path, status) | http://localhost:9090 |
| **Grafana**    | Dashboards de visualização                     | http://localhost:9000 |

Métricas coletadas:

- Contadores de requisições por controller (`auth_controller_requests_total`, `post_controller_requests_total`, `user_controller_requests_total`)
- Métricas padrão do `express-prom-bundle` (duração, status code, método, rota)

---

## Docker

### Serviços do docker-compose

| Serviço        | Imagem                                   | Porta |
| -------------- | ---------------------------------------- | ----- |
| **app**        | `fabriciopereiraviana/tech-challenge-02` | 3000  |
| **db**         | `postgres:18`                            | 5432  |
| **prometheus** | `prom/prometheus`                        | 9090  |
| **grafana**    | `grafana/grafana`                        | 9000  |
| **pgAdmin**    | `dpage/pgadmin4`                         | 8080  |

O container `app` aguarda o healthcheck do banco antes de iniciar, executa migrations automaticamente e inicia o servidor.

---

## Tecnologias utilizadas

| Categoria       | Tecnologia                                   |
| --------------- | -------------------------------------------- |
| Runtime         | Node.js 22                                   |
| Linguagem       | TypeScript 5                                 |
| Framework HTTP  | Express 5                                    |
| ORM             | Sequelize 6                                  |
| Banco de dados  | PostgreSQL 18                                |
| Autenticação    | JWT (jsonwebtoken) + bcrypt                  |
| Documentação    | Swagger (swagger-jsdoc + swagger-ui-express) |
| Testes          | Jest + ts-jest                               |
| Containerização | Docker + Docker Compose                      |
| CI/CD           | GitHub Actions                               |
| Observabilidade | Prometheus + Grafana + prom-client           |

---

## Dificuldades encontradas

- **Configuração do banco no Docker:** configurar corretamente a criação e as migrations do banco de dados durante a primeira subida do container, garantindo que o app aguardasse o banco estar pronto (healthcheck).

- **Pipeline CI/CD:** construir o pipeline da forma mais segura e otimizada possível, utilizando cache de layers Docker e npm, e gerenciando secrets do Docker Hub. Contei com apoio de colegas desenvolvedores e diversas pesquisas.

- **Clean Architecture:** definir corretamente as responsabilidades de cada camada seguindo os princípios de Clean Architecture. Esta é a primeira vez desenvolvendo com esse nível de separação de responsabilidades, e o processo de refatoração contínua (ex: mover regras de negócio dos use cases para as entidades) foi essencial para alcançar uma arquitetura mais coesa.

Testando Pipeline

---

## Participante

| RM       | Nome                   | GitHub                                      |
| -------- | ---------------------- | ------------------------------------------- |
| RM369372 | Fabricio Pereira Viana | [GitHub](https://github.com/fabriciopviana) |
