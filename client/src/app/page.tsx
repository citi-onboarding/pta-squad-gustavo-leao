"use client"

import { Clock, BookOpen, AlertCircle } from "lucide-react";

import { Widget } from "@/components/widgets";

import { ChartByCategory } from "@/components/chartByCategory";

import { LatestLoans } from "@/components/latestLoans";

export default function Home() {
  return (
    <div className="flex flex-col gap-6 p-8 bg-slate-100">
      <div className="flex flex-col gap-y-4"> {/* Title, total book qty, active loans, overdue books */}
        <div className="p-4">
          <p className="font-medium text-lg">Dashboard</p>
          <p className="text-sm text-gray-500">Visão geral da biblioteca</p>
        </div>

        <div className="flex gap-x-3">
          <Widget
            name="Total de livros"
            value={1245}
            icon={<BookOpen className="text-green-500" />}
            className="bg-green-100"
          />
          <Widget
            name="Empréstimos ativos"
            value={87}
            icon={<Clock className="text-blue-500" />}
            className="bg-blue-100"
          />
          <Widget
            name="Livros atrasados"
            value={12}
            icon={<AlertCircle className="text-red-500" />}
            className="bg-red-100"
          />
        </div>

      </div>

      <div className=""> {/* Books by category (graphic) */}
        <ChartByCategory/>
      </div>

      <div className=""> {/* Latest loans */}
        <LatestLoans/>
      </div>

    </div>
  );
}
