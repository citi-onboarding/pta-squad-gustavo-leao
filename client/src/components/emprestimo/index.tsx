import { useForm } from "react-hook-form";

import { Button } from "../ui/button";

import { postEmprestimo } from "../../service/emprestimo";

export interface emprestimoDataProps {
    bookId?: string;
    title: string;
    clientName: string;
    clientEmail: string;
    rentalDate: string;
    expectedReturn: string;
}

interface EmprestimoFormProps {
    onClose?: () => void; // auxiliary function that will run a close protocol when integrated with the main-component
    title?: string; // gets book's title to fill the input automatically when the user clicks on "Emprestar"
    bookId?: string
}
export function EmprestimoForm({ onClose, title, bookId }: EmprestimoFormProps) {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<emprestimoDataProps>()

    const selectedBook = title;

    const onSubmit = async (data: emprestimoDataProps) => {
            try {
                await postEmprestimo({ ...data, bookId });
                alert("Empréstimo realizado com sucesso")
                reset(); 
                onClose?.();
            } catch (error) {
            console.error(error);
            }

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
                    <input type="hidden" {...register("title")} value={selectedBook} />
                </div>
                <div className="gap-4">
                    <div>
                            <label>Nome do Cliente</label>
                            <input placeholder="Digite o nome do cliente" className="w-full rounded-lg border p-2 outline-none focus:ring-2 focus:ring-green-400"
                            {...register("clientName", {
                                required: "*Este é um campo obrigatório",
                                validate: (value) => isNaN(Number(value)) || "*O nome não pode ser um número"})}/>
                            {errors.clientName && <span className="text-red-500 text-sm">{errors.clientName.message}</span>}
                    </div>

                    <div>
                            <label>Email do Cliente</label>
                            <input placeholder="Digite o email do cliente" className="w-full rounded-lg border p-2 outline-none focus:ring-2 focus:ring-green-400"
                            {...register("clientEmail", {
                                required: "*Este é um campo obrigatório",
                                validate: (value) => isNaN(Number(value)) || "*O email não pode ser um número"})}/>
                            {errors.clientEmail && <span className="text-red-500 text-sm">{errors.clientEmail.message}</span>}
                    </div>

                    <div>
                        <label>Data da Locação</label>
                        <input type="date" className="w-full rounded-lg border p-2 outline-none focus:ring-2 focus:ring-green-400"
                        {...register("rentalDate", { required: "*Este é um campo obrigatório" })}/>
                        {errors.rentalDate && <span className="text-red-500 text-sm">{errors.rentalDate.message}</span>}
                    </div>

                    <div>
                        <label>Data Prevista de Devolução</label>
                        <input type="date" className="w-full rounded-lg border p-2 outline-none focus:ring-2 focus:ring-green-400"
                        {...register("expectedReturn", { required: "*Este é um campo obrigatório" })}/>
                        {errors.expectedReturn && <span className="text-red-500 text-sm">{errors.expectedReturn.message}</span>}
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