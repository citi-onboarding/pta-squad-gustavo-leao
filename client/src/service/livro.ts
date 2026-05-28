import api from "./api";

export const getLivroById = async (id: string) => {
    try {
        const response = await api.get(`/livros/${id}`);
        return response.data;
    } catch (error) {
        console.log("Erro ao tentar achar o livro pelo ID.", error);
    }
}