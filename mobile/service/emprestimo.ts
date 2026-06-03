import api from './api';

export async function getAllEmprestimos() {
    try{
        const response = await api.get('/emprestimos');
        return response.data;
    }
    catch(error){
        console.error("Erro ao buscar empréstimos do usuário:", error);
        throw error;
    }
}   