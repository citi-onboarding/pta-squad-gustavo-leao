"use client";

import { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getAllEmprestimos, type LoanStatus } from "@/service/emprestimo";
import { getAllLivros } from "@/service/livro";

interface LoanRow {
  id: string;
  book: string;
  client: string;
  loanDate: string;
  returnDate: string;
  status: LoanStatus;
}

const STATUS_LABEL: Record<LoanStatus, string> = {
  EmAndamento: "Em andamento",
  Atrasado: "Atrasado",
  Devolvido: "Devolvido",
  Perdido: "Perdido",
};

const STATUS_STYLES: Record<LoanStatus, string> = {
  EmAndamento: "bg-amber-100 text-amber-700",
  Atrasado: "bg-rose-100 text-rose-700",
  Devolvido: "bg-emerald-100 text-emerald-700",
  Perdido: "bg-gray-100 text-gray-700",
};

function StatusBadge({ status }: { status: LoanStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        STATUS_STYLES[status]
      )}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR");
}

export function LatestLoans() {
  const [loans, setLoans] = useState<LoanRow[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [emprestimos, livros] = await Promise.all([
          getAllEmprestimos(),
          getAllLivros(),
        ]);

        // Mapa de id -> título pra cruzar rapidamente
        const livrosById = new Map(livros.map((l) => [l.id, l.title]));

        const rows: LoanRow[] = emprestimos
          .sort(
            (a, b) =>
              new Date(b.rentalDate).getTime() -
              new Date(a.rentalDate).getTime()
          )
          .slice(0, 4)
          .map((e) => ({
            id: e.id,
            book: livrosById.get(e.bookId) ?? "—",
            client: e.clientName,
            loanDate: formatDate(e.rentalDate),
            returnDate: formatDate(e.expectedReturn),
            status: e.status,
          }));

        setLoans(rows);
      } catch (error) {
        console.error("Erro ao buscar empréstimos:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          Últimos Empréstimos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="pb-3 font-medium">Livro</th>
                <th className="pb-3 font-medium">Cliente</th>
                <th className="pb-3 font-medium">Data de Locação</th>
                <th className="pb-3 font-medium">Data de Devolução</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {loans.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-muted-foreground">
                    Nenhum empréstimo registrado.
                  </td>
                </tr>
              ) : (
                loans.map((loan) => (
                  <tr key={loan.id} className="border-b last:border-0">
                    <td className="py-3 text-foreground">{loan.book}</td>
                    <td className="py-3 text-muted-foreground">{loan.client}</td>
                    <td className="py-3 text-muted-foreground">{loan.loanDate}</td>
                    <td className="py-3 text-muted-foreground">{loan.returnDate}</td>
                    <td className="py-3">
                      <StatusBadge status={loan.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}