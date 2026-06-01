import api from "./api";

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

export const getEmprestimosByLivroId = async (bookId: string) => {
    try {
        const response = await api.get(`/emprestimos/livro/${bookId}`);
        return response.data;
    } catch (error) {
        console.log("Erro ao listar os empréstimos deste livro.", error);
    }
}

export const patchDevolver = async (id: string) => {
    try {
        const response = await api.patch(`/emprestimos/${id}`);
        return response.data;
    } catch (error) {
        console.log("Erro ao marcar este empréstimo como devolvido.", error);
    }
}

export const patchPerdido = async (id: string) => {
    try {
        const response = await api.patch(`/emprestimos/${id}/perdido`);
        return response.data;
    } catch (error) {
        console.log("Erro ao marcar este empréstimo como perdido.", error);
    }
}

export const getAllEmprestimos = async (): Promise<Emprestimo[]> => {
  const response = await api.get<Emprestimo[]>("/emprestimos");
  return response.data;
};
