import api from './api';
import { formDataProps } from '../components/cadastro';

export async function postBook(data: formDataProps) {
    try {
        const response = await api.post('/livros', data);
        return response.data;
    } catch(error) {
        console.error("Erro ao cadastrar livro:", error);
        throw error;
    }
}