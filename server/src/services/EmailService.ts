import nodemailer from "nodemailer";

type ReminderPayload = {
  to: string;
  clientName: string;
  bookTitle: string;
  expectedReturn: string;
};

class EmailService {
  private createTransporter() {
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
      throw new Error("SMTP_CONFIG_MISSING");
    }

    const port = Number(SMTP_PORT);

    return nodemailer.createTransport({
      host: SMTP_HOST,
      port,
      secure: port === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });
  }

  // Função auxiliar para deixar a data no formato PT-BR (DD/MM/AAAA)
  private formatDate(dateString: string): string {
    try {
      // Trata o formato YYYY-MM-DD adicionando o horário para evitar problemas de fuso horário local
      const date = new Date(`${dateString}T12:00:00`);
      return new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(date);
    } catch {
      return dateString; // Caso a conversão falhe, mantém o original por segurança
    }
  }

  async sendReminder(payload: ReminderPayload) {
    const transporter = this.createTransporter();
    const formattedDate = this.formatDate(payload.expectedReturn);

    await transporter.sendMail({
      from: `Biblioteca de Engenharia <${process.env.SMTP_USER}>`,
      to: payload.to,
      subject: `Lembrete: Devolução do livro "${payload.bookTitle}" 📚`,
      // Mantemos o text alternativo caso o app de email não suporte HTML
      text: `Olá, ${payload.clientName}! Tudo bem? Passando para lembrar que o prazo de devolução do livro "${payload.bookTitle}" foi em ${formattedDate}. Se puder, passa na biblioteca para regularizar. Abraços!`,
      // Template HTML formatado e amigável
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; color: #333333;">
          <div style="text-align: center; margin-bottom: 24px;">
            <span style="font-size: 40px;">📚</span>
            <h2 style="color: #0070f3; margin: 10px 0 0 0; font-weight: 600;">Aviso de Devolução</h2>
          </div>
          
          <p style="font-size: 16px; line-height: 1.6; color: #444444;">
            Olá, <strong>${payload.clientName}</strong>! Tudo bem?
          </p>
          
          <p style="font-size: 15px; line-height: 1.6; color: #555555;">
            Esperamos que esteja aproveitando bastante a leitura! Passando aqui apenas para te lembrar que o prazo para a devolução do livro listado abaixo já venceu:
          </p>
          
          <div style="background-color: #f9f9f9; border-left: 4px solid #0070f3; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0 0 8px 0; font-size: 15px;"><strong>📖 Livro:</strong> ${payload.bookTitle}</p>
            <p style="margin: 0; font-size: 15px; color: #d32f2f;"><strong>📅 Prazo final:</strong> ${formattedDate}</p>
          </div>
          
          <p style="font-size: 15px; line-height: 1.6; color: #555555;">
            Se você puder, dê uma passadinha na biblioteca o quanto antes para fazer a devolução ou renovar o empréstimo.Agradecemos muito a sua colaboração!
          </p>
          
          <p style="font-size: 14px; color: #777777; font-style: italic; margin-top: 30px;">
            Caso você já tenha feito a devolução recentemente, por favor desconsidere esta mensagem.
          </p>
          
          <hr style="border: 0; border-top: 1px solid #eaeaea; margin: 30px 0 20px 0;" />
          
          <p style="font-size: 14px; text-align: center; color: #999999; margin: 0;">
            Atenciosamente,<br />
            <strong>Equipe da Biblioteca</strong>
          </p>
        </div>
      `,
    });
  }
}

export default new EmailService();
