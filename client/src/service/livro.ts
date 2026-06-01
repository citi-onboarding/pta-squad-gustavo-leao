import api from './api';
import { formDataProps } from '../components/cadastro';

export type Category =
  | "Romance"
  | "Infantil"
  | "Tecnologia"
  | "Historia"
  | "Ciencias";

export interface Livro {
  id: string;
  title: string;
  author: string;
  isbn: string;
  publisher: string;
  year: number;
  totalQty: number;
  availableQty: number;
  category: Category;
  cover: string;
}

export async function postBook(data: formDataProps) {
    try {
        const response = await api.post('/livros', data);
        return response.data;
    } catch(error) {
        console.error("Erro ao cadastrar livro:", error);
        throw error;
    }
}

export const getLivroById = async (id: string) => {
    try {
        const response = await api.get(`/livros/${id}`);
        return response.data;
    } catch (error) {
        console.log("Erro ao tentar achar o livro pelo ID.", error);
    }
}

export const getAllLivros = async (): Promise<Livro[]> => {
  const response = await api.get<Livro[]>("/livros");
  return response.data;
};
