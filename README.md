# Tech Challenge 02 - Blog Api

Este repositorio contêm todo o codigo fonte necessário para a segunda entrega do tech challenge, o objetivo principal dessa entrega é o desenvolvimento de uma api Rest para CRUD aplicando todos os conhecimentos aprendidos, como Clean Architeture, Documentação de Api, Testes unitarios para qualidade de software, e integrações com bancos de dados. todo a descrição dos requisitos podem ser lidas no arquivo [REQUISITOS](./REQUISITOS.md)

Disponível no Docker Hub

- Imagem: `fabriciopereiraviana/tech-challenge-02`
- Pull rápido:

```bash
docker pull fabriciopereiraviana/tech-challenge-02:tagname
```

## Setup inicial

Pré-requisitos

- `Docker Desktop`

Executando com Docker Compose

1. copiar `.env-example` para `.env` e editar os valores caso necessário (`DB_NAME`, `DB_USER`, `DB_PASS`, `DB_HOST`).

2. Suba os serviços:

```bash
docker-compose up -d --build
```

3. **Atenção — primeiro uso:** crie o banco e aplique as migrations (necessário apenas na primeira execução):

Para criar o banco execute:

```bash
docker-compose exec app npm run db:create
```

Para rodar as migrations do banco execute:

```bash
docker-compose exec app npm run db:migrate
```

4. Pronto é certo que esteja tudo funcionando, Acesse a API / documentação: `http://localhost:3000/api-docs`

## Arquitetura

Este projeto segue a **Clean Architecture** (separação de responsabilidades em camadas) para garantir testabilidade, baixo acoplamento e facilidade de manutenção. As dependências apontam para dentro — a lógica de negócio **não** depende de frameworks ou detalhes de infraestrutura.

Camadas e responsabilidades

- **Domain** (`src/domain`) — entidades de negócio e contratos (ex.: `Post`, `PostRepository`), regras de validação e erros de domínio.
- **Application** (`src/application`) — DTOs e _use cases_ (ex.: `CreatePostUseCase`, `FindAllPostUseCase`): contém a lógica dos casos de uso e orquestra chamadas para repositórios via interfaces.
- **Interface Adapters** (`src/interface-adapters`) — controllers, presenters, rotas e middlewares (ex.: `PostController`, `PostView`, `postRoutes.ts`). É aqui que os dados são adaptados entre a camada de aplicação e o mundo externo. A composição (composition root) ocorre em `postRoutes.ts`.
- **Infrastructure** (`src/infrastructure`) — implementações concretas (ex.: `SequelizePostRepository`), configuração do banco (Sequelize), migrations e integrações com frameworks (Swagger, DB).

Entrada e composição

- **Entry point:** `src/server.ts` — inicializa Express, middlewares, rotas e conecta ao banco.
- **Composition root:** `src/interface-adapters/routes/postRoutes.ts` — instancia repositório, monta use-cases e injeta no controller.

Persistência e migrações

- Persistência: **Sequelize** com **Postgres** (model em `src/infrastructure/database/models/PostModel.ts`).
- Migrations: `src/infrastructure/database/migrations`.

Testes e documentação

- Testes unitários: **Jest** (localizados em `tests/`), padrão Arrange–Act–Assert (AAA).
- Documentação da API: **Swagger** (swagger-jsdoc + swagger-ui-express). Anotações Swagger estão nas rotas.

Principais arquivos

- `src/server.ts` — servidor / bootstrap
- `src/interface-adapters/routes/postRoutes.ts` — composition root / rotas
- `src/application/use-cases/*` — regras de negócio por caso de uso
- `src/infrastructure/repositories/postgresql/SequelizePostRepository.ts` — implementação do repositório
- `src/infrastructure/database/models/PostModel.ts` — model do Sequelize

Fluxo simples (resumido)

Client -> Routes/Controller -> Use Case -> Repository(interface) -> Infra (Sequelize -> Postgres)

Essa organização facilita testes isolados, substituição de infra sem alterar regras de negócio e leitura rápida da estrutura do projeto.

## Doc Api (Swagger)

foi desenvolvido a documentação da api usando o swagger com swagger-jsdoc que diferente no nestjs que é definido por injeção de dependência esse é definido jsDcoc annotations, para acessar localmente acesse http://localhost:${PORT}/api-docs

## Teste unitários (Jest)

todos os teste foram feita com a estrategia Arrange, Act e Assert (AAA), que consiste em preparara os mocks(Arrange), Executar os Casos de uso(Act) e Verificar os valores esperados(Assert)

## Dificuldades encontradas

Durante o desenvolvimento, estou enfrentando algumas dificuldades:

- Configurar corretamente a criação e as migrações do banco de dados dentro do processo de subida do Docker pela primeira vez;

- Construir o pipeline da forma mais segura e otimizada possível. Para isso, precisei contar com a ajuda dos desenvolvedores da empresa onde trabalho, além de realizar diversas pesquisas;

- Definir corretamente cada dependência seguindo os princípios de Clean Code. Esta é a primeira vez que desenvolvo algo nesse nível de qualidade, e ainda existem muitos pontos que acredito que possam ser melhor posicionados e organizados..

## Participante

| RM       | Nome                   | GitHub                                      |
| -------- | ---------------------- | ------------------------------------------- |
| RM369372 | Fabricio Pereira Viana | [GitHub](https://github.com/fabriciopviana) |
