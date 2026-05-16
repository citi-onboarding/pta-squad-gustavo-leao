import express from "express";
import emprestimoController from "./controllers/EmprestimoController";
import userController from "./controllers/UserController";

const routes = express.Router();

routes.post("/user", userController.create);
routes.get("/user", userController.get);
routes.delete("/user/:id", userController.delete);
routes.patch("/user/:id", userController.update);

// Rotas de emprestimos.
routes.get("/emprestimos", emprestimoController.listar);
routes.get("/emprestimos/livro/:bookId", emprestimoController.listarPorLivro);
routes.post("/emprestimos", emprestimoController.registrar);
routes.patch("/emprestimos/:id", emprestimoController.devolver);

export default routes;
