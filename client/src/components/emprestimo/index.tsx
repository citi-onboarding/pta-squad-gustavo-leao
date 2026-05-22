import { useForm } from "react-hook-form";

import { Button } from "../ui/button";

export interface emprestimoDataProps {
    bookTitle: string;
    name: string;
    email: string;
    dateBeggining: string;
    dateEnd: string;
}

interface EmprestimoFormProps {
    onClose?: () => void; // auxiliary function that will run a close protocol when integrated with the main-component
    bookTitle?: string; // gets book's title to fill the input automatically when the user clicks on "Emprestar"
}
    // if the user doesn't inform the title, it will be "O Pequeno Príncipe" by default
export function EmprestimoForm({ onClose, bookTitle = "O Pequeno Príncipe" }: EmprestimoFormProps) {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<emprestimoDataProps>()

    const selectedBook = bookTitle;

    const onSubmit = (data: emprestimoDataProps) => {
            console.log(data);
            reset(); // clears all fields when the form is submitted
            onClose?.(); 
        };
    
    const onCancel = () => {
        reset();
        onClose?.();
    }

    return(
        <div className="bg-white flex-col w-3/12 p-6 shadow-md rounded-lg">

            <div className="flex justify-between">
                <h1 className="text-lg font-bold">Realizar Empréstimo</h1>
                <Button className="text-black font-extrabold" variant="outline" type="button" onClick={onCancel}>X</Button>
            </div>

            <hr className="my-4" />
            
            
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="p-4 bg-gray-100 rounded-lg">
                    <label className="text-sm">Livro selecionado</label>
                    <p className="font-bold">{selectedBook}</p>
                    <input type="hidden" {...register("bookTitle")} value={selectedBook} />
                </div>
                <div className="gap-4">
                    <div>
                            <label>Nome do Cliente</label>
                            <input placeholder="Digite o nome do cliente" className="w-full rounded-lg border p-2 outline-none focus:ring-2 focus:ring-green-400"
                            {...register("name", {
                                required: "*Este é um campo obrigatório",
                                validate: (value) => isNaN(Number(value)) || "*O nome não pode ser um número"})}/>
                            {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
                    </div>

                    <div>
                            <label>Email do Cliente</label>
                            <input placeholder="Digite o email do cliente" className="w-full rounded-lg border p-2 outline-none focus:ring-2 focus:ring-green-400"
                            {...register("email", {
                                required: "*Este é um campo obrigatório",
                                validate: (value) => isNaN(Number(value)) || "*O email não pode ser um número"})}/>
                            {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
                    </div>

                    <div>
                        <label>Data da Locação</label>
                        <input type="date" className="w-full rounded-lg border p-2 outline-none focus:ring-2 focus:ring-green-400"
                        {...register("dateBeggining", { required: "*Este é um campo obrigatório" })}/>
                        {errors.dateBeggining && <span className="text-red-500 text-sm">{errors.dateBeggining.message}</span>}
                    </div>

                    <div>
                        <label>Data Prevista de Devolução</label>
                        <input type="date" className="w-full rounded-lg border p-2 outline-none focus:ring-2 focus:ring-green-400"
                        {...register("dateEnd", { required: "*Este é um campo obrigatório" })}/>
                        {errors.dateEnd && <span className="text-red-500 text-sm">{errors.dateEnd.message}</span>}
                    </div>
                </div>  

                <div className="flex justify-end gap-2 mt-3">
                    <Button className="border-green-400 border-2 text-green-400" variant="outline" type="button" onClick={onCancel}>Cancelar</Button> {/* type="button" so this button doesn't submit the form */}
                    <Button className="bg-green-400 hover:bg-green-600 text-white">Confirmar empréstimo</Button>
                </div>                  
            </form>
        </div>
    )
}