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
import { AuthService } from "../../domain/services/AuthService.ts";
import { authMiddleware } from "../middlewares/auth.ts";
import { authorize } from "../middlewares/authorize.ts";
import { UserRole } from "../../domain/entities/User.ts";

export class PostRoutes {
  private postController: PostController;
  private repository: SequelizePostRepository;
  private authService: AuthService;
  private postRoutes: Router;

  constructor(authService: AuthService) {
    this.authService = authService;

    this.postRoutes = Router();

    this.repository = new SequelizePostRepository(PostModel);

    // Composition Root: monta as dependências e injeta no controller
    this.postController = new PostController(
      new CreatePostUseCase(this.repository),
      new FindAllPostUseCase(this.repository),
      new UpdatePostUseCase(this.repository),
      new DeletePostUseCase(this.repository),
      new FindOneByIdPostUseCase(this.repository),
      new SearchByWordPostUseCase(this.repository),
    );
  }

  getRouter(): Router {
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
     *     security:
     *       - bearerAuth: []
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
    this.postRoutes.post(
      "/",
      authMiddleware(this.authService),
      authorize(UserRole.TEACHER),
      (req, res, next) => this.postController.createPost({ req, res, next }),
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
    this.postRoutes.get("/", (req, res, next) =>
      this.postController.findAllPosts({ req, res, next }),
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
    this.postRoutes.get("/search", (req, res, next) =>
      this.postController.searchPostsByWord({ req, res, next }),
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
    this.postRoutes.get("/:id", (req, res, next) =>
      this.postController.findPostById({ req, res, next }),
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
     *     security:
     *       - bearerAuth: []
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
    this.postRoutes.put(
      "/:id",
      authMiddleware(this.authService),
      authorize(UserRole.TEACHER),
      (req, res, next) => this.postController.updatePost({ req, res, next }),
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
     *     security:
     *       - bearerAuth: []
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
    this.postRoutes.delete(
      "/:id",
      authMiddleware(this.authService),
      authorize(UserRole.TEACHER),
      (req, res, next) => this.postController.deletePost({ req, res, next }),
    );

    return this.postRoutes;
  }
}
