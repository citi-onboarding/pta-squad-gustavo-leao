import { Request, Response } from "express";
import { Loan, LoanStatus } from "@prisma/client";
import prisma from "@database";

class EmprestimoController {
  // Calcula o status dinamico antes de responder.
  private computeStatus(loan: Loan): Loan {
    if (
      loan.status !== LoanStatus.Devolvido &&
      new Date() > loan.expectedReturn
    ) {
      return { ...loan, status: LoanStatus.Atrasado };
    }

    return loan;
  }

  listar = async (request: Request, response: Response) => {
    // Suporte a filtro por email via query ?cliente=.
    const { cliente } = request.query;

    const where =
      typeof cliente === "string" ? { clientEmail: cliente } : undefined;

    const loans = await prisma.loan.findMany({ where });
    const withStatus = loans.map((loan) => this.computeStatus(loan));

    return response.status(200).send(withStatus);
  };

  registrar = async (request: Request, response: Response) => {
    // Valida estoque do livro e impede emprestimo sem disponibilidade.
    const { bookId, clientName, clientEmail, rentalDate, expectedReturn } =
      request.body;

    const hasUndefined = [
      bookId,
      clientName,
      clientEmail,
      rentalDate,
      expectedReturn,
    ].some((value) => value === undefined);

    if (hasUndefined) return response.status(400).send();

    const book = await prisma.book.findUnique({ where: { id: bookId } });

    if (!book)
      return response.status(400).send({ message: "Livro nao encontrado." });

    if (book.availableQty <= 0)
      return response.status(400).send({ message: "Livro sem estoque." });

    // Cria o emprestimo e atualiza o estoque no mesmo fluxo.
    const [loan] = await prisma.$transaction([
      prisma.loan.create({
        data: {
          bookId,
          clientName,
          clientEmail,
          rentalDate: new Date(rentalDate),
          expectedReturn: new Date(expectedReturn),
          status: LoanStatus.EmAndamento,
        },
      }),
      prisma.book.update({
        where: { id: bookId },
        data: { availableQty: { decrement: 1 } },
      }),
    ]);

    const withStatus = this.computeStatus(loan);

    return response.status(201).send(withStatus);
  };

  devolver = async (request: Request, response: Response) => {
    // Devolucao incrementa o estoque e marca status como Devolvido.
    const { id } = request.params;

    const loan = await prisma.loan.findUnique({ where: { id } });

    if (!loan)
      return response
        .status(400)
        .send({ message: "Emprestimo nao encontrado." });

    if (loan.status === LoanStatus.Devolvido)
      return response
        .status(400)
        .send({ message: "Emprestimo ja devolvido." });

    const [updatedLoan] = await prisma.$transaction([
      prisma.loan.update({
        where: { id },
        data: { status: LoanStatus.Devolvido },
      }),
      prisma.book.update({
        where: { id: loan.bookId },
        data: { availableQty: { increment: 1 } },
      }),
    ]);

    return response.status(200).send(updatedLoan);
  };
}

export default new EmprestimoController();
