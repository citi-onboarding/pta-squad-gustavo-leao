import api from './api';

export async function getAllLivros() {
    try{
        const response = await api.get('/livros');
        return response.data;
    }
    catch(error){
        console.error("Erro ao buscar livros:", error);
        throw error;
    }
}   