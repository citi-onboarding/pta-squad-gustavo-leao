import express from "express";
import userController from "./controllers/UserController";
import bookController from "./controllers/BookController";

const routes = express.Router();

// Rotas de usuário
routes.post("/user", userController.create);
routes.get("/user", userController.get);
routes.delete("/user/:id", userController.delete);
routes.patch("/user/:id", userController.update);

// Rotas de livro
routes.post("/livros", bookController.create);
routes.get("/livros", bookController.get);
routes.get("/livros/:id", bookController.getById);
routes.delete("/livros/:id", bookController.delete);

export default routes;