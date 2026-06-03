
import { useMemo, useState, useEffect } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  View,
  Pressable,
  Image,
  ImageSourcePropType,
} from "react-native";
import { Calendar } from "lucide-react-native";
import {
  logoCopy,
  historia,
  ciencias,
  romance,
  tecnologia,
  infantil,
} from "@assets";
import { getAllEmprestimos } from "../service/emprestimo";
import { getAllLivros } from "../service/livro";

// Allowed status values to keep typing consistent.
type LoanStatus = "Devolvido" | "EmAndamento" | "Atrasado" | "Perdido";

// Data shape for a loan shown in a card.
interface LoanItem {
  id: string;
  bookId: string;
  title: string;
  clientName: string;
  clientEmail: string;
  cover: ImageSourcePropType;
  rentalDate: string;
  expectedReturn: string;
  status: LoanStatus;
}

// Maps status to badge styles (color and text).
const statusBadgeStyles: Record<LoanStatus, string> = {
  Devolvido: "bg-emerald-100 text-emerald-700",
  "EmAndamento": "bg-amber-100 text-amber-700",
  Atrasado: "bg-rose-100 text-rose-700",
  Perdido: "bg-gray-100 text-gray-700",
};

const statusLabels: Record<LoanStatus, string> = {
  Devolvido: "Devolvido",
  EmAndamento: "Em Andamento",
  Atrasado: "Atrasado",
  Perdido: "Perdido",
};

const bookCovers: Record<string, any> = {
  "/assets/Historia.png": historia,
  "/assets/Ciencias.png": ciencias,
  "/assets/Romance.png": romance,
  "/assets/Tecnologia.png": tecnologia,
  "/assets/Infantil.png": infantil,
};


const App: React.FC = () => {
  // Stores the text typed in the search field.
  const [searchTerm, setSearchTerm] = useState("");
  // Tracks whether the user has clicked "Search".
  const [hasSearched, setHasSearched] = useState(false);
  // Stores the filtered list that will render the cards.
  const [results, setResults] = useState<LoanItem[]>([]);

  const [isLoading, setIsLoading] = useState(false)

  const [livrosMapa, setLivrosMapa] = useState<Record<string, any>>({});

  useEffect(() => {
    const buscarLivros = async () => {
      try {
        const data = await getAllLivros();
        
        // transforms the array of books into a map for quick access by ID.
        const mapa: Record<string, any> = {};
        data.forEach((livro: any) => {
          mapa[livro.id] = livro;
        });
        
        setLivrosMapa(mapa);
      } catch (error) {
        console.error("Erro ao buscar catálogo de livros");
      }
    };
    buscarLivros();
  }, []);


  // Builds the total label from the results count.
  const totalLabel = useMemo(
    () => `${results.length} empréstimo(s) encontrado(s)`,
    [results.length]
  );

  // Applies a local filter by client email while there is no API.
  const handleSearch = async () => {
    // Normalizes the term to avoid case differences.
    const terms = searchTerm.trim().toLowerCase(); 
    
    if (!terms.length) {
      setResults([]);
      return;
    }

    setIsLoading(true)

    try {
      const allData = await getAllEmprestimos();
      const data = allData.filter((loan: LoanItem) => 
      loan.clientEmail.toLowerCase() === terms
      );
      
      if (data.length === 0) {
        alert("Nenhum empréstimo encontrado para este email.");
      }

      setResults(data);
      setHasSearched(true);
      setIsLoading(false)

    } catch (error) {
      console.error("Erro ao buscar empréstimos do usuário:", error);
      //alertar ususário sobre erro
      setIsLoading(false)
    }

  };

  // function to format ISO date string to "dd/mm/yyyy" format
  const formatarData = (dataIso: string) => {
    if (!dataIso.includes('T')) return dataIso; 
    
    const data = new Date(dataIso);
    return data.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
  };

  return (
    // ScrollView allows the list to grow with scrolling.
    <ScrollView
      className="flex-1 bg-[#F5F5F5]"
      contentContainerStyle={{ paddingBottom: 28 }}
    >
      <View className="px-5 pt-4">
        <View className="flex-row items-center gap-3">
          <Image
            source={logoCopy}
            style={{ width: 72, height: 32 }}
            resizeMode="contain"
          />
          <Text className="text-xl font-barlowBold text-emerald-600">
            Meus Empréstimos
          </Text>
        </View>

        <View className="mt-5">
          <TextInput
            placeholder="Email do cliente"
            value={searchTerm}
            onChangeText={setSearchTerm}
            className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-[15px] font-barlowRegular"
          />
          <Pressable
            onPress={handleSearch}
            className="mt-3 rounded-xl bg-emerald-500 py-3"
          >
            <Text className="text-center text-[15px] font-barlowSemiBold text-white">
              Buscar
            </Text>
          </Pressable>
        </View>

        {hasSearched && (
          <Text className="mt-5 text-sm font-barlowRegular text-gray-500">
            {totalLabel}
          </Text>
        )}

        {hasSearched && (
          <View className="mt-4 gap-4">
            {results.map((loan) => (
              <View
                key={loan.id}
                className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm"
              >
                <View className="flex-row gap-2">
                  <Image
                    source={bookCovers[livrosMapa[loan.bookId]?.cover] || logoCopy} 
                    className="rounded-lg"
                    style={{ width: 84, height: 112 }}
                    resizeMode="cover"
/>
                  <View className="flex-1">
                    <Text className="text-sm font-barlowSemiBold text-slate-800">
                      {livrosMapa[loan.bookId]?.title || "Carregando livro..."}
                    </Text>
                    <View className="mt-3">
                      <Text
                        className={`self-start rounded-full px-2.5 py-1 text-xs font-barlowSemiBold ${
                          statusBadgeStyles[loan.status]
                        }`}
                      >
                        {statusLabels[loan.status]}
                      </Text>
                    </View>
                    <View className="mt-3 gap-2">
                      <View className="flex-row items-center gap-2">
                        <Calendar size={14} color="#94A3B8" />
                        <Text className="text-sm font-barlowRegular text-slate-600">
                          Locação: {formatarData(loan.rentalDate)}
                        </Text>
                      </View>
                      <View className="flex-row items-center gap-2">
                        <Calendar size={14} color="#94A3B8" />
                        <Text className="text-sm font-barlowRegular text-slate-600">
                          Devolução: {formatarData(loan.expectedReturn)}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default App;
