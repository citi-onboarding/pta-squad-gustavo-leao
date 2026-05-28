import api from "./api";
/* routes:
routes.get("/emprestimos/livro/:bookId", emprestimoController.listarPorLivro);
routes.patch("/emprestimos/:id", emprestimoController.devolver);
routes.patch("/emprestimos/:id/perdido", emprestimoController.marcarPerdido); */

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