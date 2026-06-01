import api from './api';

export async function getAllLivros() {
  const response = await api.get('/livros');
  return response.data;
}

export async function deleteLivro(id: string) {
  const response = await api.delete(`/livros/${id}`);
  return response.data;
}
