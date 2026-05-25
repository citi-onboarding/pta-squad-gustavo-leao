"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { CardLivro } from "@/components/livro";

interface Livro {
  id: string;
  title: string;
  autor: string;
  category: string;
  totalQty: number;
}

// Mock — integração com API ocorre na Sprint 3
const mockLivros: Livro[] = [
  { id: "1", title: "Clean Code", autor: "Robert C. Martin", category: "Tecnologia", totalQty: 5 },
  { id: "2", title: "Dom Casmurro", autor: "Machado de Assis", category: "Romance", totalQty: 3 },
  { id: "3", title: "O Pequeno Príncipe", autor: "Antoine de Saint-Exupéry", category: "Infantil", totalQty: 8 },
  { id: "4", title: "Sapiens", autor: "Yuval Noah Harari", category: "História", totalQty: 4 },
  { id: "5", title: "1984", autor: "George Orwell", category: "Romance", totalQty: 6 },
  { id: "6", title: "JavaScript: The Good Parts", autor: "Douglas Crockford", category: "Tecnologia", totalQty: 2 },
  { id: "7", title: "Uma Breve História do Tempo", autor: "Stephen Hawking", category: "Ciências", totalQty: 3 },
  { id: "8", title: "O Hobbit", autor: "J.R.R. Tolkien", category: "Romance", totalQty: 7 },
];

export default function LivrosPage() {
  const [query, setQuery] = useState("");

  const livrosFiltrados = useMemo(() => {
    const termo = query.trim().toLowerCase();
    if (!termo) return mockLivros;
    return mockLivros.filter((livro) =>
      livro.title.toLowerCase().includes(termo)
    );
  }, [query]);

  return (
    <main className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Livros</h1>
        <p className="text-gray-600">Acervo da biblioteca escolar</p>
      </div>

      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por título..."
          className="w-full rounded-md border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        />
      </div>

      {livrosFiltrados.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 bg-white py-16 text-center">
          <p className="text-gray-500">
            Nenhum livro encontrado para &quot;{query}&quot;.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {livrosFiltrados.map((livro) => (
            <CardLivro
              key={livro.id}
              title={livro.title}
              autor={livro.autor}
              category={livro.category}
              totalQty={livro.totalQty}
            />
          ))}
        </div>
      )}
    </main>
  );
}