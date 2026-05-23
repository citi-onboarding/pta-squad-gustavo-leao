
import { useMemo, useState } from "react";
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
} from "@assets";

// Allowed status values to keep typing consistent.
type LoanStatus = "Devolvido" | "Em andamento" | "Atrasado";

// Data shape for a loan shown in a card.
interface LoanItem {
  id: string;
  title: string;
  clientName: string;
  clientEmail: string;
  cover: ImageSourcePropType;
  rentalDate: string;
  expectedReturn: string;
  status: LoanStatus;
}

// Mock data for Sprint 2 API integration comes in the next sprint.
const LOANS: LoanItem[] = [
  {
    id: "1",
    title: "Dom Casmurro",
    clientName: "João Silva",
    clientEmail: "joao.silva@email.com",
    cover: romance,
    rentalDate: "02/03/2026",
    expectedReturn: "12/03/2026",
    status: "Devolvido",
  },
  {
    id: "2",
    title: "Clean Code",
    clientName: "João Silva",
    clientEmail: "joao.silva@email.com",
    cover: tecnologia,
    rentalDate: "15/04/2026",
    expectedReturn: "30/04/2026",
    status: "Em andamento",
  },
  {
    id: "3",
    title: "História do Brasil",
    clientName: "João Silva",
    clientEmail: "joao.silva@email.com",
    cover: historia,
    rentalDate: "01/03/2026",
    expectedReturn: "10/03/2026",
    status: "Atrasado",
  },
  {
    id: "4",
    title: "Introdução à Ciência",
    clientName: "João Silva",
    clientEmail: "joao.silva@email.com",
    cover: ciencias,
    rentalDate: "20/04/2026",
    expectedReturn: "05/05/2026",
    status: "Em andamento",
  },
  {
    id: "5",
    title: "O Pequeno Príncipe",
    clientName: "João Silva",
    clientEmail: "joao.silva@email.com",
    cover: romance,
    rentalDate: "10/03/2026",
    expectedReturn: "20/03/2026",
    status: "Devolvido",
  },
  {
    id: "6",
    title: "Capitaes da Areia",
    clientName: "Pedro Siqueira",
    clientEmail: "pedro.siqueira@email.com",
    cover: romance,
    rentalDate: "08/05/2026",
    expectedReturn: "18/05/2026",
    status: "Em andamento",
  },
  {
    id: "7",
    title: "A Revolucao dos Bichos",
    clientName: "Pedro Siqueira",
    clientEmail: "pedro.siqueira@email.com",
    cover: historia,
    rentalDate: "01/04/2026",
    expectedReturn: "11/04/2026",
    status: "Devolvido",
  },
  {
    id: "8",
    title: "Vidas Secas",
    clientName: "Gustavo Leao",
    clientEmail: "gustavo.leao@email.com",
    cover: romance,
    rentalDate: "12/05/2026",
    expectedReturn: "22/05/2026",
    status: "Em andamento",
  },
  {
    id: "9",
    title: "Memorias Postumas",
    clientName: "Gustavo Leao",
    clientEmail: "gustavo.leao@email.com",
    cover: historia,
    rentalDate: "14/03/2026",
    expectedReturn: "24/03/2026",
    status: "Atrasado",
  },
];

// Maps status to badge styles (color and text).
const statusBadgeStyles: Record<LoanStatus, string> = {
  Devolvido: "bg-emerald-100 text-emerald-700",
  "Em andamento": "bg-amber-100 text-amber-700",
  Atrasado: "bg-rose-100 text-rose-700",
};

const App: React.FC = () => {
  // Stores the text typed in the search field.
  const [searchTerm, setSearchTerm] = useState("");
  // Tracks whether the user has clicked "Search".
  const [hasSearched, setHasSearched] = useState(false);
  // Stores the filtered list that will render the cards.
  const [results, setResults] = useState<LoanItem[]>([]);

  // Builds the total label from the results count.
  const totalLabel = useMemo(
    () => `${results.length} empréstimo(s) encontrado(s)`,
    [results.length]
  );

  // Applies a local filter by client email while there is no API.
  const handleSearch = () => {
    // Normalizes the term to avoid case differences.
    const term = searchTerm.trim().toLowerCase();
    // If there is a term, filter by client email; otherwise return all.
    let filtered: LoanItem[];

    if (term.length) {
      filtered = LOANS.filter(
        (loan) => loan.clientEmail.toLowerCase() === term
      );
    } else {
      filtered = [];
    }

    // Updates the list and allows results to render.
    setResults(filtered);
    setHasSearched(true);
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
                    source={loan.cover}
                    className="rounded-lg"
                    style={{ width: 84, height: 112 }}
                    resizeMode="cover"
                  />
                  <View className="flex-1">
                    <Text className="text-sm font-barlowSemiBold text-slate-800">
                      {loan.title}
                    </Text>
                    <View className="mt-3">
                      <Text
                        className={`self-start rounded-full px-2.5 py-1 text-xs font-barlowSemiBold ${
                          statusBadgeStyles[loan.status]
                        }`}
                      >
                        {loan.status}
                      </Text>
                    </View>
                    <View className="mt-3 gap-2">
                      <View className="flex-row items-center gap-2">
                        <Calendar size={14} color="#94A3B8" />
                        <Text className="text-sm font-barlowRegular text-slate-600">
                          Locação: {loan.rentalDate}
                        </Text>
                      </View>
                      <View className="flex-row items-center gap-2">
                        <Calendar size={14} color="#94A3B8" />
                        <Text className="text-sm font-barlowRegular text-slate-600">
                          Devolução: {loan.expectedReturn}
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
