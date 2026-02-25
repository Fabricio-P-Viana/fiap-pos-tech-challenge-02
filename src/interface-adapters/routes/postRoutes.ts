import { Router } from "express";
import PostController from "../controllers/PostController.ts";
import { PostModel } from "../../infrastructure/database/sequelize.ts";
import SequelizePostRepository from "../../infrastructure/repositories/postgresql/SequelizePostRepository.ts";
import {
  CreatePostUseCase,
  FindAllPostUseCase,
  UpdatePostUseCase,
  DeletePostUseCase,
  FindOneByIdPostUseCase,
  SearchByWordPostUseCase,
} from "../../application/post/use-cases/index.ts";

const postRoutes = Router();

// Composition Root: monta as dependências e injeta no controller
const repository = new SequelizePostRepository(PostModel);
const postController = new PostController(
  new CreatePostUseCase(repository),
  new FindAllPostUseCase(repository),
  new UpdatePostUseCase(repository),
  new DeletePostUseCase(repository),
  new FindOneByIdPostUseCase(repository),
  new SearchByWordPostUseCase(repository),
);

/**
 * @swagger
 * /posts:
 *   post:
 *     tags: [Post]
 *     summary: Criar um novo post
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PostInput'
 *     responses:
 *       201:
 *         description: Post criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: Dados inválidos (title e content são obrigatórios)
 *       500:
 *         description: Erro interno do servidor
 */
postRoutes.post("/", (req, res, next) =>
  postController.createPost({ req, res, next }),
);

/**
 * @swagger
 * /posts:
 *   get:
 *     tags: [Post]
 *     summary: Listar todos os posts
 *     responses:
 *       200:
 *         description: Lista de posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       500:
 *         description: Erro interno do servidor
 */
postRoutes.get("/", (req, res, next) =>
  postController.findAllPosts({ req, res, next }),
);

/**
 * @swagger
 * /posts/search:
 *   get:
 *     tags: [Post]
 *     summary: Buscar posts por palavra-chave
 *     parameters:
 *       - in: query
 *         name: word
 *         required: true
 *         schema:
 *           type: string
 *         description: Palavra-chave para buscar no título e conteúdo
 *     responses:
 *       200:
 *         description: Posts encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       400:
 *         description: Parâmetro de busca "word" é obrigatório
 *       500:
 *         description: Erro interno do servidor
 */
postRoutes.get("/search", (req, res, next) =>
  postController.searchPostsByWord({ req, res, next }),
);

/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     tags: [Post]
 *     summary: Buscar post por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do post
 *     responses:
 *       200:
 *         description: Post encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Post não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
postRoutes.get("/:id", (req, res, next) =>
  postController.findPostById({ req, res, next }),
);

/**
 * @swagger
 * /posts/{id}:
 *   put:
 *     tags: [Post]
 *     summary: Atualizar um post
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do post
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PostInput'
 *     responses:
 *       200:
 *         description: Post atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Post não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
postRoutes.put("/:id", (req, res, next) =>
  postController.updatePost({ req, res, next }),
);

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     tags: [Post]
 *     summary: Deletar um post
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do post
 *     responses:
 *       204:
 *         description: Post deletado com sucesso
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Post não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
postRoutes.delete("/:id", (req, res, next) =>
  postController.deletePost({ req, res, next }),
);

export default postRoutes;
