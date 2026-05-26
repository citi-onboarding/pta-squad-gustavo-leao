import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type LoanStatus = "Em andamento" | "Atrasado" | "Devolvido" | "Perdido";

interface Loan {
  id: string;
  book: string;
  client: string;
  loanDate: string;
  returnDate: string;
  status: LoanStatus;
}

// Mock — integração com API ocorre na Sprint 3
const mockLoans: Loan[] = [
  {
    id: "1",
    book: "Clean Code",
    client: "João Silva",
    loanDate: "20/04/2026",
    returnDate: "27/04/2026",
    status: "Em andamento",
  },
  {
    id: "2",
    book: "O Pequeno Príncipe",
    client: "Maria Santos",
    loanDate: "18/04/2026",
    returnDate: "25/04/2026",
    status: "Atrasado",
  },
  {
    id: "3",
    book: "Dom Casmurro",
    client: "Pedro Costa",
    loanDate: "15/04/2026",
    returnDate: "22/04/2026",
    status: "Devolvido",
  },
  {
    id: "4",
    book: "JavaScript: The Good Parts",
    client: "Ana Oliveira",
    loanDate: "22/04/2026",
    returnDate: "29/04/2026",
    status: "Em andamento",
  },
];

const STATUS_STYLES: Record<LoanStatus, string> = {
  "Em andamento": "bg-amber-100 text-amber-700",
  "Atrasado": "bg-rose-100 text-rose-700",
  "Devolvido": "bg-emerald-100 text-emerald-700",
  "Perdido": "bg-cyan-100 text-cyan-800"
};

function StatusBadge({ status }: { status: LoanStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        STATUS_STYLES[status]
      )}
    >
      {status}
    </span>
  );
}

export function LatestLoans() {
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
              {mockLoans.map((loan) => (
                <tr key={loan.id} className="border-b last:border-0">
                  <td className="py-3 text-foreground">{loan.book}</td>
                  <td className="py-3 text-muted-foreground">{loan.client}</td>
                  <td className="py-3 text-muted-foreground">{loan.loanDate}</td>
                  <td className="py-3 text-muted-foreground">{loan.returnDate}</td>
                  <td className="py-3">
                    <StatusBadge status={loan.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}