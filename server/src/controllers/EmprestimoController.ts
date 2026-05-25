import { Request, Response } from "express";
import { Loan, LoanStatus } from "@prisma/client";
import prisma from "@database";

class EmprestimoController {
  // Computes the dynamic status before responding.
  private computeStatus(loan: Loan): Loan {
    if (
      loan.status !== LoanStatus.Devolvido &&
      loan.status !== LoanStatus.Perdido &&
      new Date() > loan.expectedReturn
    ) {
      return { ...loan, status: LoanStatus.Atrasado };
    }

    return loan;
  }

  listar = async (request: Request, response: Response) => {
    // Supports email filter via ?cliente= query.
    const { cliente } = request.query;

    const where =
      typeof cliente === "string" ? { clientEmail: cliente } : undefined;

    const loans = await prisma.loan.findMany({ where });
    const withStatus = loans.map((loan) => this.computeStatus(loan));

    return response.status(200).send(withStatus);
  };

  listarPorLivro = async (request: Request, response: Response) => {
    // Lists loans for a specific book.
    const { bookId } = request.params;

    const book = await prisma.book.findUnique({ where: { id: bookId } });

    if (!book)
      return response.status(400).send({ message: "Livro nao encontrado." });

    const loans = await prisma.loan.findMany({ where: { bookId } });
    const withStatus = loans.map((loan) => this.computeStatus(loan));

    return response.status(200).send(withStatus);
  };

  registrar = async (request: Request, response: Response) => {
    // Validates book stock and blocks loans without availability.
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

    // Creates the loan and updates stock in the same flow.
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
    // Return increments stock and marks status as Devolvido.
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

  marcarPerdido = async (request: Request, response: Response) => {
    // Marks the loan as Perdido and decrements total stock.
    const { id } = request.params;

    const loan = await prisma.loan.findUnique({ where: { id } });

    if (!loan)
      return response
        .status(400)
        .send({ message: "Emprestimo nao encontrado." });

    if (loan.status === LoanStatus.Perdido)
      return response
        .status(400)
        .send({ message: "Emprestimo ja marcado como perdido." });

    if (loan.status === LoanStatus.Devolvido)
      return response
        .status(400)
        .send({ message: "Emprestimo ja devolvido." });

    const [updatedLoan] = await prisma.$transaction([
      prisma.loan.update({
        where: { id },
        data: { status: LoanStatus.Perdido },
      }),
      prisma.book.update({
        where: { id: loan.bookId },
        data: { totalQty: { decrement: 1 } },
      }),
    ]);

    return response.status(200).send(updatedLoan);
  };
}

export default new EmprestimoController();
