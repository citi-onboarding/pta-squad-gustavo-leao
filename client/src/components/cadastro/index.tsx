
import { Button } from "../ui/button";

import { useForm } from "react-hook-form";

import { postBook } from "../../service/livro";

export interface formDataProps { // I used export interface to facilitate lift state up later
    title: string,
    author: string,
    isbn: string,
    publisher: string,
    year: number,
    totalQty: number,
    category: string
}

export function Form() {
    const { register, handleSubmit, watch, setValue, reset, setError, formState: { errors } } = useForm<formDataProps>();
    register("category", { required: "*Selecione uma categoria" });

    const selectedCategory = watch("category");

    const onCancel = () => {
        reset();
    }

    const onSubmit = async (data: formDataProps) => {
        if (!data.category) { // prevents the user from submitting the form without clicking on any category
        setError("category", { message: "*Selecione uma categoria" });
        return;
        }
        try {
            await postBook(data);
            reset(); 
        } catch (error) {
            console.error(error);
        }
    };

    // className="w-1/2 h-1/4 p-8 gap-2"
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="gap-2 rounded-lg border-2 shadow-md p-4">
                <div className="grid grid-cols-2 gap-4 flex-1 rounded-lg p-4">
                    <div>
                        <label>Título</label>
                        <input placeholder="Digite o título do livro" className="w-full rounded-lg border p-2 outline-none focus:ring-2 focus:ring-green-400"
                        {...register("title", {
                            required: "*Este é um campo obrigatório",
                            validate: (value) => isNaN(Number(value)) || "*O título não pode ser um número"})}/>
                        {errors.title && <span className="text-red-500 text-sm">{errors.title.message}</span>}
                    </div>
                    
                    <div>
                        <label>Autor</label>
                        <input placeholder="Digite o nome do autor" className="w-full rounded-lg border p-2 outline-none focus:ring-2 focus:ring-green-400"
                        {...register("author", {
                            required: "*Este é um campo obrigatório",
                            validate: (value) => isNaN(Number(value)) || "*O autor não pode ser um número"})}/>
                        {errors.author && <span className="text-red-500 text-sm">{errors.author.message}</span>}
                    </div>

                    <div>
                        <label>ISBN</label>
                        <input placeholder="Digite o ISBN" className="w-full rounded-lg border p-2 outline-none focus:ring-2 focus:ring-green-400"
                        {...register("isbn", // validate: prevents ISBN from being registered with anything other than 10 or 13 digits
                            {required: "*Este é um campo obrigatório", 
                            validate: {
                                numeric: (value) => !isNaN(Number(value)) || "*ISBN deve conter apenas números",
                                length: (value) => value.length === 10 || value.length === 13 || "*ISBN deve ter 10 ou 13 dígitos"}})}/>
                        {errors.isbn && <span className="text-red-500 text-sm">{errors.isbn.message}</span>}
                    </div>
                    
                    <div>
                        <label>Editora</label>
                        <input placeholder="Digite a editora" className="w-full rounded-lg border p-2 outline-none focus:ring-2 focus:ring-green-400"
                        {...register("publisher", {
                            required: "*Este é um campo obrigatório",
                            validate: (value) => isNaN(Number(value)) || "*A editora não pode ser um número"})}/>
                        {errors.publisher && <span className="text-red-500 text-sm">{errors.publisher.message}</span>}
                    </div>

                    <div>
                        <label>Ano</label>
                        <input placeholder="Digite o ano" className="w-full rounded-lg border p-2 outline-none focus:ring-2 focus:ring-green-400"
                        {...register("year", 
                        {required: "*Este é um campo obrigatório",
                         valueAsNumber: true,
                         validate: (value) => value >= 0 || "*Ano não pode ser negativo"
                         })}/>
                        {errors.year && <span className="text-red-500 text-sm">{errors.year.message}</span>}
                    </div>

                    <div>
                        <label>Quantidade</label>
                        <input placeholder="Digite a quantidade" className="w-full rounded-lg border p-2 outline-none focus:ring-2 focus:ring-green-400"
                        {...register("totalQty", 
                            {required: "*Este é um campo obrigatório",
                             valueAsNumber: true, 
                             validate: (value) => value >= 0 || "*Quantidade não pode ser negativa"
                            })}/>
                        {errors.totalQty && <span className="text-red-500 text-sm">{errors.totalQty.message}</span>}
                    </div>
                </div>

                <hr className="my-4" />

                <div className="flex flex-col gap-2">
                    <label>Categoria</label>

                    <div className="flex gap-4">
                        {["Romance", "Infantil", "Tecnologia", "Historia", "Ciencias"].map((category) => (
                        <div
                            key={category}
                            onClick={() => setValue("category", category, { shouldValidate: true })}
                            className={`rounded-lg cursor-pointer border-2 p-4 w-0 flex-1 h-32 flex flex-col items-center justify-end ${selectedCategory === category ? "border-green-400" : "border-gray-300"}`}>
                            {category}
                        </div>
                        ))}
                    </div>
                    {errors.category && <span className="text-red-500 text-sm">{errors.category.message}</span>}
                </div>

                <hr className="my-4" />

                <div className="flex justify-end gap-2 mt-3">
                    <Button className="border-green-400 border-2 text-green-400" variant="outline" type="button" onClick={onCancel}>Cancelar</Button> {/* type="button" so this button doesn't submit the form */}
                    <Button className="bg-green-400 hover:bg-green-600 text-white">Salvar livro</Button>
                </div>
            </div>
        </form>
    );
}