"use client";

import { Form } from "@/components/cadastro";

export default function formPage() {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-16">
            <div className="w-full max-w-2xl">
                <h1 className="text-2xl font-bold mb-1">Cadastrar Novo Livro</h1>
                <p className="text-gray-500 mb-4">Adicione um novo livro ao acervo</p>
                <Form />
            </div>
        </div>
    );
}