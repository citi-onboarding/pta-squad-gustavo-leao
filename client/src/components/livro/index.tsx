import { useState } from "react";

export function CardLivro() {
    const [isOpenEmprestimo, setIsOpenEmprestimo] = useState(false);
    const [isOpenDetalhe, setIsOpenDetalhes] = useState(false);

    const bookInfo = { title: "Clean Code", autor: "Robert C. Martin", category: "Tecnologia", totalQty: 5 }; // mocked data

    const onLoan = () => { setIsOpenEmprestimo(true) }

    const onDetails = () => { setIsOpenDetalhes(true) }

    const onDelete = () => { console.log("Deletar livro chamado!") }

    return(
        <div>
            <div className="w-96 h-auto flex-col rounded-lg shadow-lg"> {/* CardLivro */}
                <div className="w-full h-48 bg-gray-100 rounded-t-lg">
                    {/* Image here */}
                </div>

                <div className="flex-col gap-2 px-4 py-2">
                    <p className="text-lg text-black font-medium">{bookInfo.title}</p>
                    <p className=" text-gray-700">{bookInfo.autor}</p>
                    <p className="text-sm text-green-400">{bookInfo.category}</p>
                    <p className="text-sm">Disponível: {bookInfo.totalQty} unidade(s)</p>
                </div>

            </div>

            {isOpenEmprestimo && ( // EmprestimoForm
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    {/* Call EmprestimoForm here */}
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