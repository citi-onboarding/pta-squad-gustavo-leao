import api from './api';

export async function getEmprestimosUsuario(email: string) {
    try{
        const response = await api.get('/emprestimos', {
            params: { client: email }
        });
        return response.data;
    }
    catch(error){
        console.error("Erro ao buscar empréstimos do usuário:", error);
        throw error;
    }
}   