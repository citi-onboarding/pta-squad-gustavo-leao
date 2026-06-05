"use client";

import { useMemo, useState, useEffect } from "react";
import { Search } from "lucide-react";

import { CardLivro } from "@/components/livro";
import { getAllLivros, deleteLivro } from "@/service/livros";

interface Livro {
    id: string;
    title: string;
    author: string;
    category: string;
    cover: string;
    totalQty: number;
}

const CATEGORIAS_PADRAO = ["Todas"];


export default function LivrosPage() {
    const [query, setQuery] = useState("");
    const [categoria, setCategoria] = useState("Todas");
    const [livros, setLivros] = useState<Livro[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchLivros() {
            setLoading(true);
            setError(null);
            try {
                const data = await getAllLivros();
                setLivros(data);
                console.log(data);
            } catch (err) {
                setError("Erro ao buscar livros");
            } finally {
                setLoading(false);
            }
        }
        fetchLivros();
    }, []);

    const categorias = useMemo(() => {
        return [
            ...CATEGORIAS_PADRAO,
            ...Array.from(new Set(livros.map((l) => l.category)))
        ];
    }, [livros]);

    const livrosFiltrados = useMemo(() => {
        const termo = query.trim().toLowerCase();
        return livros.filter((livro) => {
            const matchTermo =
                !termo ||
                livro.title.toLowerCase().includes(termo) ||
                livro.author.toLowerCase().includes(termo);
            const matchCategoria = categoria === "Todas" || livro.category === categoria;
            return matchTermo && matchCategoria;
        });
    }, [query, categoria, livros]);

    async function handleDeleteLivro(id: string) {
        try {
            await deleteLivro(id);
            alert(`Livro ${livros.find((l) => l.id === id)?.title} deletado com sucesso`);
            setLivros((prev) => prev.filter((l) => l.id !== id));
        } catch (error: any) {
            if (error.response && error.response.status === 400) {
                alert("Não é possível remover um livro com empréstimos ativos");
            } else {
                alert("Erro ao deletar livro");
                console.error(error);
            }
        }
    }

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
                    {categorias.map((cat) => (
                        <option key={cat} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>
            </div>

            {loading ? (
                <div className="rounded-lg border border-dashed border-gray-300 bg-white py-16 text-center">
                    <p className="text-gray-500">Carregando livros...</p>
                </div>
            ) : error ? (
                <div className="rounded-lg border border-dashed border-gray-300 bg-white py-16 text-center">
                    <p className="text-red-500">{error}</p>
                </div>
            ) : livrosFiltrados.length === 0 ? (
                <div className="rounded-lg border border-dashed border-gray-300 bg-white py-16 text-center">
                    <p className="text-gray-500">Nenhum livro encontrado.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {livrosFiltrados.map((livro) => (
                        <CardLivro
                            key={livro.id}
                            id={livro.id}
                            title={livro.title}
                            author={livro.author}
                            category={livro.category}
                            cover={livro.cover}
                            totalQty={livro.totalQty}
                            onDelete={handleDeleteLivro}
                        />
                    ))}
                </div>
            )}
        </main>
    );
}