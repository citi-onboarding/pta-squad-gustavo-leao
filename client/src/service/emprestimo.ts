import api from './api';
import { emprestimoDataProps } from '../components/emprestimo';

export async function postEmprestimo(data: emprestimoDataProps) {
    try {
        const response = await api.post('/emprestimos', data);
        return response.data;
    } catch(error) {
        console.error("Erro ao cadastrar empréstimo:", error);
        throw error;
    }
}