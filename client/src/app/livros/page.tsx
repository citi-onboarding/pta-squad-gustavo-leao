"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { CardLivro } from "@/components/livro";

interface Livro {
    id: string;
    title: string;
    author: string;
    category: string;
    cover: string;
    totalQty: number;
}

// Mock — integração com API ocorre na Sprint 3
const mockLivros: Livro[] = [
    { id: "1", title: "Clean Code", author: "Robert C. Martin", category: "Tecnologia", cover: "/assets/Tecnologia.png", totalQty: 5 },
    { id: "2", title: "O Pequeno Príncipe", author: "Antoine de Saint-Exupéry", category: "Infantil", cover: "/assets/Infantil.png", totalQty: 8 },
    { id: "3", title: "Dom Casmurro", author: "Machado de Assis", category: "Romance", cover: "/assets/Romance.png", totalQty: 3 },
    { id: "4", title: "Sapiens", author: "Yuval Noah Harari", category: "História", cover: "/assets/Historia.png", totalQty: 4 },
    { id: "5", title: "Cosmos", author: "Carl Sagan", category: "Ciências", cover: "/assets/Ciencias.png", totalQty: 4 },
    { id: "6", title: "1984", author: "George Orwell", category: "Romance", cover: "/assets/Romance.png", totalQty: 7 },
];

const CATEGORIAS = ["Todas", ...new Set(mockLivros.map((l) => l.category))];

export default function LivrosPage() {
    const [query, setQuery] = useState("");
    const [categoria, setCategoria] = useState("Todas");

    const livrosFiltrados = useMemo(() => {
        const termo = query.trim().toLowerCase();
        return mockLivros.filter((livro) => {
            const matchTermo =
                !termo ||
                livro.title.toLowerCase().includes(termo) ||
                livro.author.toLowerCase().includes(termo);
            const matchCategoria = categoria === "Todas" || livro.category === categoria;
            return matchTermo && matchCategoria;
        });
    }, [query, categoria]);

    return (
        <main className="mx-auto max-w-7xl px-6 py-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Livros</h1>
                <p className="text-gray-600">Gerencie o acervo da biblioteca</p>
            </div>

            <div className="mb-6 flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                        type="search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Buscar por título ou autor..."
                        className="w-full rounded-md border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                </div>
                <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 sm:w-48"
                >
                    {CATEGORIAS.map((cat) => (
                        <option key={cat} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>
            </div>

            {livrosFiltrados.length === 0 ? (
                <div className="rounded-lg border border-dashed border-gray-300 bg-white py-16 text-center">
                    <p className="text-gray-500">Nenhum livro encontrado.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {livrosFiltrados.map((livro) => (
                        <CardLivro
                            key={livro.id}
                            title={livro.title}
                            author={livro.author}
                            category={livro.category}
                            cover={livro.cover}
                            totalQty={livro.totalQty}
                        />
                    ))}
                </div>
            )}
        </main>
    );
}