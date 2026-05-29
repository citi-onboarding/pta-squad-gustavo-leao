import { api } from "./api";

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

export const getAllLivros = async (): Promise<Livro[]> => {
  const response = await api.get<Livro[]>("/livros");
  return response.data;
};