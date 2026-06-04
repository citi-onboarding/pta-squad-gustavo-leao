import { Request, Response } from "express";
import { Citi, Crud } from "../global";
import prisma from "@database";

const CAPAS_POR_CATEGORIA = {
  Romance: "/assets/Romance.png",
  Infantil: "/assets/Infantil.png",
  Tecnologia: "/assets/Tecnologia.png",
  Historia: "/assets/Historia.png",
  Ciencias: "/assets/Ciencias.png",
};

class BookController implements Crud {
  constructor(private readonly citi = new Citi("Book")) {}

  create = async (request: Request, response: Response) => {
    const { title, author, isbn, publisher, year, totalQty, category } =
      request.body;

    if (this.citi.areValuesUndefined(
    title,
    author,
    isbn,
    publisher,
    year,
    totalQty,
    category
  )
  ) {
  return response
    .status(400)
    .send({ message: "Todos os campos são obrigatórios" });
  }

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

  get = async (request: Request, response: Response) => {
    const { httpStatus, values } = await this.citi.getAll();
    return response.status(httpStatus).send(values);
  };

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

  delete = async (request: Request, response: Response) => {
    const { id } = request.params;
    try {
      // 1. Verifica se existem empréstimos ATIVOS ou ATRASADOS
      const activeLoansCount = await prisma.loan.count({
        where: { 
          bookId: id, 
          status: {
            in: ["EmAndamento", "Atrasado"] // Bloqueia a exclusão nestes dois cenários
          }
        },
      });

      if (activeLoansCount > 0) {
        return response
          .status(400)
          .send({ message: "Livro possui empréstimos em andamento ou atrasados" });
      }

      // 2. Limpeza do Histórico: Apaga os empréstimos finalizados (Devolvidos/Perdidos)
      // Isso é essencial para não tomar o erro de Foreign Key do banco de dados!
      await prisma.loan.deleteMany({ 
        where: { bookId: id } 
      });

      // 3. Caminho livre: Deleta o livro com segurança
      await prisma.book.delete({ where: { id } });
      
      return response
        .status(200)
        .send({ messageFromDelete: "Livro e histórico removidos com sucesso" });
    } catch (error) {
      console.error("Erro na deleção:", error);
      return response
        .status(400)
        .send({ messageFromDelete: "Erro ao remover livro" });
    }
  };
}

export default new BookController();