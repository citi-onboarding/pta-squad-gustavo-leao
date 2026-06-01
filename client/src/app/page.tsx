"use client";

import { useEffect, useState } from "react";
import { Clock, BookOpen, AlertCircle } from "lucide-react";

import { Widget } from "@/components/widgets";
import { ChartByCategory } from "@/components/chartByCategory";
import { LatestLoans } from "@/components/latestLoans";

import { getAllLivros } from "@/service/livro";
import { getAllEmprestimos } from "@/service/emprestimo";

export default function Home() {
  const [totalLivros, setTotalLivros] = useState(0);
  const [emprestimosAtivos, setEmprestimosAtivos] = useState(0);
  const [livrosAtrasados, setLivrosAtrasados] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [livros, emprestimos] = await Promise.all([
          getAllLivros(),
          getAllEmprestimos(),
        ]);

        const total = livros.reduce((acc, l) => acc + l.totalQty, 0);
        const ativos = emprestimos.filter(
          (e) => e.status === "EmAndamento" || e.status === "Atrasado"
        ).length;
        const atrasados = emprestimos.filter(
          (e) => e.status === "Atrasado"
        ).length;

        setTotalLivros(total);
        setEmprestimosAtivos(ativos);
        setLivrosAtrasados(atrasados);
      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="flex flex-col gap-6 p-8 bg-slate-100">
      <div className="flex flex-col gap-y-4">
        <div className="p-4">
          <p className="font-medium text-lg">Dashboard</p>
          <p className="text-sm text-gray-500">Visão geral da biblioteca</p>
        </div>

        <div className="flex gap-x-3">
          <Widget
            name="Total de livros"
            value={totalLivros}
            icon={<BookOpen className="text-green-500" />}
            className="bg-green-100"
          />
          <Widget
            name="Empréstimos ativos"
            value={emprestimosAtivos}
            icon={<Clock className="text-blue-500" />}
            className="bg-blue-100"
          />
          <Widget
            name="Livros atrasados"
            value={livrosAtrasados}
            icon={<AlertCircle className="text-red-500" />}
            className="bg-red-100"
          />
        </div>
      </div>

      <div>
        <ChartByCategory />
      </div>

      <div>
        <LatestLoans />
      </div>
    </div>
  );
}