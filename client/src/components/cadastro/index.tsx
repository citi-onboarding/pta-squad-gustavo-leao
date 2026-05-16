
import { Button } from "../ui/button";

import { useForm } from "react-hook-form";

export interface formDataProps { // usei o export interface para facilitar o lift state up posteriormente
    title: string,
    author: string,
    isbn: string,
    publisher: string,
    year: number,
    totalQty: number,
    category: string
}

export function Form() {
    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<formDataProps>();

    const selectedCategory = watch("category");


    const onSubmit = (data: formDataProps) => {
        console.log(data);
    };

    return (
        <form className="w-1/2 h-1/4 p-8 gap-2" onSubmit={handleSubmit(onSubmit)}>
            <div className="gap-2">
                <div className="grid grid-cols-2 gap-4 flex-1 rounded-lg border p-4">
                    <div>
                        <label>Título</label>
                        <input placeholder="Digite o título do livro" className="w-full rounded-lg border p-2 outline-none focus:ring-2 focus:ring-green-500"
                        {...register("title", {required: "Este é um campo obrigatório"})}/>
                        {errors.title && <span>{errors.title.message}</span>}
                    </div>
                    
                    <div>
                        <label>Autor</label>
                        <input placeholder="Digite o nome do autor" className="w-full rounded-lg border p-2 outline-none focus:ring-2 focus:ring-green-500"
                        {...register("author", {required: "Este é um campo obrigatório"})}/>
                        {errors.author && <span>{errors.author.message}</span>}
                    </div>

                    <div>
                        <label>ISBN</label>
                        <input placeholder="Digite o ISBN" className="w-full rounded-lg border p-2 outline-none focus:ring-2 focus:ring-green-500"
                        {...register("isbn", // validate: não deixa que o ISBN seja cadastrado contendo algo diferente de 10 ou 13 dígitos
                            {required: "Este é um campo obrigatório", 
                            validate: (value) => value.length === 10 || value.length === 13 || "ISBN deve ter 10 ou 13 dígitos"})}/>
                        {errors.isbn && <span>{errors.isbn.message}</span>}
                    </div>
                    
                    <div>
                        <label>Editora</label>
                        <input placeholder="Digite a editora" className="w-full rounded-lg border p-2 outline-none focus:ring-2 focus:ring-green-500"
                        {...register("publisher", {required: "Este é um campo obrigatório"})}/>
                        {errors.publisher && <span>{errors.publisher.message}</span>}
                    </div>

                    <div>
                        <label>Ano</label>
                        <input placeholder="Digite o ano" className="w-full rounded-lg border p-2 outline-none focus:ring-2 focus:ring-green-500"
                        {...register("year", {required: "Este é um campo obrigatório"})}/>
                        {errors.year && <span>{errors.year.message}</span>}
                    </div>

                    <div>
                        <label>Quantidade</label>
                        <input placeholder="Digite a quantidade" className="w-full rounded-lg border p-2 outline-none focus:ring-2 focus:ring-green-500"
                        {...register("totalQty", 
                            {required: "Este é um campo obrigatório",
                            validate: (value) => value >= 0 || "Quantidade não pode ser negativa"})}/>
                        {errors.totalQty && <span>{errors.totalQty.message}</span>}
                    </div>
                </div>
                
                <div className="flex flex-col gap-2">
                    <label>Categoria</label>

                    <div className="flex gap-4">
                        {["Romance", "Infantil", "Tecnologia", "Historia", "Ciencias"].map((category) => (
                        <div
                            key={category}
                            onClick={() => setValue("category", category)}
                            className={`rounded-lg cursor-pointer border-2 p-4 w-0 flex-1 h-32 flex flex-col items-center justify-end ${selectedCategory === category ? "border-green-500" : "border-gray-300"}`}>
                            {category}
                        </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end gap-2">
                    <Button variant="outline" type="button">Cancelar</Button> {/* type="button" pra que esse botão não submeta o form */}
                    <Button className="bg-green-500 hover:bg-green-600 text-white">Salvar livro</Button>
                </div>
            </div>
        </form>
    );
}