import { useState } from "react";

import { Bookmark, Eye, Trash2 } from "lucide-react";

import { Button } from "../ui/button";

import { EmprestimoForm } from "../emprestimo";

interface CardLivroProps {
    image?: string;
    title?: string;
    autor?: string;
    category?: string;
    totalQty?: number;
}

export function CardLivro({ image, title = "Clean Code", autor = "Robert C. Martin", category = "Tecnologia", totalQty = 5 }: CardLivroProps) {   // default values
    const [isOpenEmprestimo, setIsOpenEmprestimo] = useState(false);
    const [isOpenDetalhe, setIsOpenDetalhes] = useState(false);

    const categoryImages: Record<string, string> = {
        Romance: "/assets/Romance.png",
        Infantil: "/assets/Infantil.png",
        Tecnologia: "/assets/Tecnologia.png",
        Historia: "/assets/Historia.png",
        Ciencias: "/assets/Ciencias.png"
    };

    const bookImage = image ?? categoryImages[category ?? ""];

    const onLoan = () => { setIsOpenEmprestimo(true) }

    const onDetails = () => { setIsOpenDetalhes(true) }

    const onDelete = () => { console.log("Deletar livro chamado!") }

    return(
        <div>
            <div className="w-80 h-auto flex-col rounded-lg shadow-lg"> {/* CardLivro */}
                <div className="w-full h-48 bg-gray-100 rounded-t-lg">
                    <img src={bookImage} alt={title} className="w-full h-48 object-cover rounded-t-lg"/>
                </div>

                <div className="flex-col gap-2 px-4 py-2">
                    <p className="text-lg text-black font-medium">{title}</p>
                    <p className=" text-gray-700">{autor}</p>
                    <p className="text-sm text-green-400">{category}</p>
                    <p className="text-sm">Disponível: {totalQty} unidade(s)</p>
                </div>

                <div className="w-full flex px-4 pb-3 pt-3 gap-2">
                    <Button onClick={onDetails} className="flex-2 text-green-400 border-green-400 border-2 text-md" variant={"outline"}>
                        <Eye></Eye>Ver
                    </Button>

                    <Button onClick={onLoan} className="flex-1 bg-green-400 text-md">
                        <Bookmark></Bookmark>Emprestar
                    </Button>

                    <Button onClick={onDelete} variant={"destructive"}>
                        <Trash2></Trash2>
                    </Button>
                </div>

            </div>

            {isOpenEmprestimo && ( // EmprestimoForm
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <EmprestimoForm 
                    bookTitle={title} 
                    onClose={() => setIsOpenEmprestimo(false)}/>
                </div>
            )}

            {isOpenDetalhe && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    {/* Call Detalhes here */}
                </div>
            )}

        </div>
    );



}