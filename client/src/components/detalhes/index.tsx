import { useEffect, useState, useRef } from "react"
import { X, BookOpen, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { sendLoanReminder } from "@/service/loanReminder"

import { getLivroById } from "@/service/livro"
import { getEmprestimosByLivroId, patchDevolver, patchPerdido } from "@/service/emprestimo"

type LoanStatus = "EmAndamento" | "Atrasado" | "Devolvido" | "Perdido"

interface Loan {
  id: string
  clientName: string
  clientEmail: string
  rentalDate: string
  expectedReturn: string
  status: LoanStatus
}

interface Book {
  title: string
  author: string
  isbn: string
  category: string
  publisher: string
  year: number
  totalQty: number
  availableQty: number
  cover?: string
}

const STATUS_STYLES: Record<LoanStatus, { bg: string; text: string; label: string }> = {
  EmAndamento: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Em Andamento" },
  Atrasado:    { bg: "bg-red-100",    text: "text-red-800",    label: "Atrasado" },
  Devolvido:   { bg: "bg-emerald-100",text: "text-emerald-800",label: "Devolvido" },
  Perdido:     { bg: "bg-gray-100",   text: "text-gray-700",   label: "Perdido" },
}

function StatusBadge({ status }: { status: LoanStatus }) {
  const { bg, text, label } = STATUS_STYLES[status]
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${bg} ${text}`}>
      {label}
    </span>
  )
}

function InfoField({
  label,
  value,
  highlight = false,
}: {
  label: string
  value: string | number
  highlight?: boolean
}) {
  return (
    <div>
      <p className="mb-0.5 text-xs text-muted-foreground">{label}</p>
      <p className={`text-sm font-medium ${highlight ? "text-emerald-600" : ""}`}>
        {value}
      </p>
    </div>
  )
}

interface LoanMenuProps {
  loan: Loan
  onReminder: (loan: Loan) => void
  onReturn: (id: string) => void
  onLost: (id: string) => void
}

function LoanMenu({ loan, onReminder, onReturn, onLost }: LoanMenuProps) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  function handleAction(action: () => void) {
    action()
    setOpen(false)
  }

  return (
    <div className="relative" ref={menuRef}>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 text-muted-foreground"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Abrir menu de ações"
      >
        <MoreHorizontal className="h-4 w-4" />
      </Button>

      {open && (
        <div className="absolute right-0 top-8 z-10 min-w-[160px] overflow-hidden rounded-lg border border-border bg-white shadow-md">
          {loan.status === "Atrasado" && (
            <button
              className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-muted"
              onClick={() => handleAction(() => onReminder(loan))}
            >
              Enviar Lembrete
            </button>
          )}
          <button
            className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-muted"
            onClick={() => handleAction(() => onReturn(loan.id))}
          >
            Livro Devolvido
          </button>
          <button
            className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-muted"
            onClick={() => handleAction(() => onLost(loan.id))}
          >
            Livro Perdido
          </button>
        </div>
      )}
    </div>
  )
}

function LoanCard({
  loan,
  onReminder,
  onReturn,
  onLost,
}: {
  loan: Loan
  onReminder: (loan: Loan) => void
  onReturn: (id: string) => void
  onLost: (id: string) => void
}) {
  const isOverdue = loan.status === "Atrasado"
  const hasMenu = loan.status === "EmAndamento" || isOverdue

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("pt-BR")
  }

  function calcProgress(start: string, end: string): number {
    const startDate = new Date(start).getTime();
    const endDate = new Date(end).getTime();
    const today = new Date().getTime();
    
    const total = endDate - startDate;
    const elapsed = today - startDate;
    
    return Math.min(Math.max((elapsed / total) * 100, 0), 100);
}

  return (
    <div className="rounded-lg border border-border bg-background px-4 py-3">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">{loan.clientName}</span>
            <StatusBadge status={loan.status} />
          </div>
          <p className="text-xs text-muted-foreground">{loan.clientEmail}</p>
          <p className="text-xs text-muted-foreground">
            Data de locação:{" "}
            <span className="font-medium text-foreground">{formatDate(loan.rentalDate)}</span>
            {"   "}
            Previsão de retorno:{" "}
            <span className={`font-medium ${isOverdue ? "text-red-700" : "text-foreground"}`}>
              {formatDate(loan.expectedReturn)}
            </span>
          </p>
          {(loan.status === "EmAndamento" || loan.status === "Atrasado") && (
              <div className="mt-2 h-1.5 w-full rounded-full bg-gray-200">
                  <div
                      className={`h-1.5 rounded-full ${loan.status === "Atrasado" ? "bg-red-500" : "bg-green-500"}`}
                      style={{ width: `${calcProgress(loan.rentalDate, loan.expectedReturn)}%` }}
                  />
              </div>
          )}
        </div>

        {hasMenu && (
          <LoanMenu
            loan={loan}
            onReminder={onReminder}
            onReturn={onReturn}
            onLost={onLost}
          />
        )}
      </div>
    </div>
  )
}

export interface BookDetailsModalProps {
  open: boolean
  onClose: () => void
  bookId?: string
}

export function BookDetailsModal({ open, onClose, bookId }: BookDetailsModalProps) {
  const [bookData, setBookData] = useState<Book | null>(null)
  const [loans, setLoans] = useState<Loan[]>([])

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [open, onClose])

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [open])

  useEffect(() => {
    if (!open || !bookId) return
    getLivroById(bookId).then((data) => {
      if (data) setBookData(data)
    })
  }, [open, bookId])

  useEffect(() => {
    if (!open || !bookId) return
    getEmprestimosByLivroId(bookId).then((data) => {
      if (data) setLoans(data)
    })
  }, [open, bookId])

  // Reset ao fechar pra evitar mostrar dados antigos no próximo abrir
  useEffect(() => {
    if (!open) {
      setBookData(null)
      setLoans([])
    }
  }, [open])

  if (!open) return null

  async function handleReminder(loan: Loan) {
    try {
      await sendLoanReminder(loan.id)
      alert(`Lembrete enviado para ${loan.clientEmail}`)
    } catch (err: any) {
      alert(err?.message || "Erro ao enviar lembrete.")
    }
  }

  async function handleReturn(id: string) {
    await patchDevolver(id)
    alert("Empréstimo marcado como devolvido.")
    setLoans((prev) =>
      prev.map((loan) => (loan.id === id ? { ...loan, status: "Devolvido" } : loan))
    )
  }

  async function handleLost(id: string) {
    await patchPerdido(id)
    alert("Empréstimo marcado como perdido.")
    setLoans((prev) =>
      prev.map((loan) => (loan.id === id ? { ...loan, status: "Perdido" } : loan))
    )
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
    >
      <div
        className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between border-b px-6 py-4">
          <h2 id="modal-title" className="text-base font-semibold text-foreground">
            Detalhes do Livro
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Fechar">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="overflow-y-auto">
          {!bookData ? (
            <div className="px-6 py-12 text-center text-sm text-muted-foreground">
              Carregando informações do livro...
            </div>
          ) : (
            <>
              <div className="flex gap-5 border-b px-6 py-5">
                <div className="flex h-28 w-20 shrink-0 items-center justify-center rounded-lg border bg-muted">
                  {bookData.cover ? (
                    <img
                      src={bookData.cover}
                      alt={`Capa de ${bookData.title}`}
                      className="h-full w-full rounded-lg object-cover"
                    />
                  ) : (
                    <BookOpen className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>

                <div className="flex-1 space-y-3">
                  <div>
                    <p className="text-base font-semibold leading-snug">{bookData.title}</p>
                    <p className="text-sm text-muted-foreground">{bookData.author}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-x-8 gap-y-2.5">
                    <InfoField label="ISBN" value={bookData.isbn} />
                    <div>
                      <p className="mb-0.5 text-xs text-muted-foreground">Categoria</p>
                      <p className="text-sm font-medium text-blue-500">{bookData.category}</p>
                    </div>
                    <InfoField label="Editora" value={bookData.publisher} />
                    <InfoField label="Ano" value={bookData.year} />
                    <InfoField label="Quantidade Total" value={`${bookData.totalQty} unidades`} />
                    <InfoField
                      label="Quantidade Disponível"
                      value={`${bookData.availableQty} unidades`}
                      highlight
                    />
                  </div>
                </div>
              </div>

              <div className="px-6 py-5">
                <h3 className="mb-3 text-sm font-semibold text-foreground">
                  Histórico de Empréstimos
                </h3>

                {loans.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Nenhum empréstimo registrado.</p>
                ) : (
                  <div className="space-y-2.5">
                    {loans.map((loan) => (
                      <LoanCard
                        key={loan.id}
                        loan={loan}
                        onReminder={handleReminder}
                        onReturn={handleReturn}
                        onLost={handleLost}
                      />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}