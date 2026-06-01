// Serviço para enviar lembrete de empréstimo via API
import api from "./api"

export async function sendLoanReminder(loanId: string) {
  try {
    await api.post(`/emprestimos/${loanId}/lembrete`)
    return true
  } catch (err: any) {
    let errorMsg = 'Erro ao enviar lembrete.'
    if (err?.response?.data?.error) errorMsg = err.response.data.error
    throw new Error(errorMsg)
  }
}
