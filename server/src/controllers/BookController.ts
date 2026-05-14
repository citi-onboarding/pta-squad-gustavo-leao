import { Request, Response } from "express";
import { Citi, Crud } from "../global";
import prisma from "@database";

// Mapeia cada categoria do enum para o caminho da imagem da capa.
// As imagens estão na pasta /assets na raiz do projeto.
const CAPAS_POR_CATEGORIA = {
  Romance: "/assets/Romance.png",
  Infantil: "/assets/Infantil.png",
  Tecnologia: "/assets/Tecnologia.png",
  Historia: "/assets/Historia.png",
  Ciencias: "/assets/Ciencias.png",
};

class BookController implements Crud {
  constructor(private readonly citi = new Citi("Book")) {}

  // POST /livros - cadastra um novo livro
  create = async (request: Request, response: Response) => {
    const { title, author, isbn, publisher, year, totalQty, category } =
      request.body;

    // A task pede para validar APENAS o autor como campo obrigatório
    if (this.citi.areValuesUndefined(author)) {
      return response.status(400).send({ message: "Autor é obrigatório" });
    }

    // Atribui a capa automaticamente com base na categoria
    const cover =
      CAPAS_POR_CATEGORIA[category as keyof typeof CAPAS_POR_CATEGORIA];

    const newBook = {
      title,
      author,
      isbn,
      publisher,
      year,
      totalQty,
      availableQty: totalQty,
      category,
      cover,
    };

    const { httpStatus, message } = await this.citi.insertIntoDatabase(newBook);
    return response.status(httpStatus).send({ message });
  };

  // GET /livros - lista todos os livros
  get = async (request: Request, response: Response) => {
    const { httpStatus, values } = await this.citi.getAll();
    return response.status(httpStatus).send(values);
  };

  // GET /livros/:id - busca um livro específico pelo ID
  // Não uso this.citi.findById porque ele converte id para número,
  // mas o Book usa UUID (string). Por isso chamo o Prisma diretamente.
  getById = async (request: Request, response: Response) => {
    const { id } = request.params;
    try {
      const book = await prisma.book.findUnique({ where: { id } });
      if (!book) {
        return response.status(404).send({ message: "Livro não encontrado" });
      }
      return response.status(200).send(book);
    } catch (error) {
      return response.status(400).send({ message: "Erro ao buscar livro" });
    }
  };

  // DELETE /livros/:id - exclui um livro pelo ID
  // Mesma situação do getById: o ID é UUID, então uso Prisma direto.
  delete = async (request: Request, response: Response) => {
    const { id } = request.params;
    try {
      await prisma.book.delete({ where: { id } });
      return response
        .status(200)
        .send({ messageFromDelete: "Livro removido com sucesso" });
    } catch (error) {
      return response
        .status(400)
        .send({ messageFromDelete: "Erro ao remover livro" });
    }
  };
}

export default new BookController();