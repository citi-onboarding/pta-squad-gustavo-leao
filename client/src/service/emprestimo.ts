import { api } from "./api";

export type LoanStatus = "EmAndamento" | "Devolvido" | "Atrasado" | "Perdido";

export interface Emprestimo {
  id: string;
  bookId: string;
  clientName: string;
  clientEmail: string;
  rentalDate: string;       // ISO string vindo da API
  expectedReturn: string;   // ISO string vindo da API
  status: LoanStatus;
}

export const getAllEmprestimos = async (): Promise<Emprestimo[]> => {
  const response = await api.get<Emprestimo[]>("/emprestimos");
  return response.data;
};