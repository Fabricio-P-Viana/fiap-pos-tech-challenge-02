import { Router } from "express";
import PostController from "../controllers/PostController.ts";

const postRoutes = Router();
const postController = new PostController();

postRoutes.post("/", (req, res) => postController.createPost(req, res));
postRoutes.get("/", (req, res) => postController.findAllPosts(req, res));
postRoutes.get("/search", (req, res) =>
  postController.searchPostsByWord(req, res),
);
postRoutes.get("/:id", (req, res) => postController.findPostById(req, res));
postRoutes.put("/:id", (req, res) => postController.updatePost(req, res));
postRoutes.delete("/:id", (req, res) => postController.deletePost(req, res));

export default postRoutes;
