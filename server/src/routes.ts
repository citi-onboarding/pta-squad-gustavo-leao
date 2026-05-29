import express from "express";
import emprestimoController from "./controllers/EmprestimoController";
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

// Loan routes.
routes.get("/emprestimos", emprestimoController.listar);
routes.get("/emprestimos/livro/:bookId", emprestimoController.listarPorLivro);
routes.post("/emprestimos", emprestimoController.registrar);
routes.patch("/emprestimos/:id", emprestimoController.devolver);
routes.patch("/emprestimos/:id/perdido", emprestimoController.marcarPerdido);
routes.post("/emprestimos/:id/lembrete", emprestimoController.lembrete);

export default routes;
