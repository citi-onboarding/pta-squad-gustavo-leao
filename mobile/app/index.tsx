// React hooks for state and derived values.
import { useMemo, useState } from "react";
// Core React Native components for layout and interaction.
import { ScrollView, Text, TextInput, View, Pressable } from "react-native";
// Calendar icon for the date rows.
import { Calendar } from "lucide-react-native";
// CITi logo imported from the assets package.
import { citi as CitiLogo } from "@assets";

// Allowed status values to keep typing consistent.
type LoanStatus = "Devolvido" | "Em andamento" | "Atrasado";

// Data shape for a loan shown in a card.
interface LoanItem {
  id: string;
  bookTitle: string;
  clientName: string;
  rentalDate: string;
  expectedReturn: string;
  status: LoanStatus;
}

// Mock data for Sprint 2; API integration comes in the next sprint.
const LOANS: LoanItem[] = [
  {
    id: "1",
    bookTitle: "Dom Casmurro",
    clientName: "João Silva",
    rentalDate: "02/03/2026",
    expectedReturn: "12/03/2026",
    status: "Devolvido",
  },
  {
    id: "2",
    bookTitle: "Clean Code",
    clientName: "João Silva",
    rentalDate: "15/04/2026",
    expectedReturn: "30/04/2026",
    status: "Em andamento",
  },
  {
    id: "3",
    bookTitle: "História do Brasil",
    clientName: "João Silva",
    rentalDate: "01/03/2026",
    expectedReturn: "10/03/2026",
    status: "Atrasado",
  },
  {
    id: "4",
    bookTitle: "Introdução à Ciência",
    clientName: "João Silva",
    rentalDate: "20/04/2026",
    expectedReturn: "05/05/2026",
    status: "Em andamento",
  },
  {
    id: "5",
    bookTitle: "O Pequeno Príncipe",
    clientName: "João Silva",
    rentalDate: "10/03/2026",
    expectedReturn: "20/03/2026",
    status: "Devolvido",
  },
  {
    id: "6",
    bookTitle: "Capitaes da Areia",
    clientName: "Pedro Siqueira",
    rentalDate: "08/05/2026",
    expectedReturn: "18/05/2026",
    status: "Em andamento",
  },
  {
    id: "7",
    bookTitle: "A Revolucao dos Bichos",
    clientName: "Pedro Siqueira",
    rentalDate: "01/04/2026",
    expectedReturn: "11/04/2026",
    status: "Devolvido",
  },
  {
    id: "8",
    bookTitle: "Vidas Secas",
    clientName: "Gustavo Leao",
    rentalDate: "12/05/2026",
    expectedReturn: "22/05/2026",
    status: "Em andamento",
  },
  {
    id: "9",
    bookTitle: "Memorias Postumas",
    clientName: "Gustavo Leao",
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

  // Applies a local filter by client name while there is no API.
  const handleSearch = () => {
    // Normalizes the term to avoid case differences.
    const term = searchTerm.trim().toLowerCase();
    // If there is a term, filter by client name; otherwise return all.
    const filtered = term.length
      ? LOANS.filter((loan) =>
          loan.clientName.toLowerCase().includes(term)
        )
      : LOANS;

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
        {/* Header with logo and page title */}
        <View className="flex-row items-center gap-3">
          <CitiLogo width={40} height={40} />
          <Text className="text-xl font-barlowBold text-emerald-600">
            Meus Empréstimos
          </Text>
        </View>

        {/* Search field and button to trigger filtering */}
        <View className="mt-5">
          <TextInput
            placeholder="Nome do cliente"
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

        {/* Shows the total count after the search */}
        {hasSearched && (
          <Text className="mt-5 text-sm font-barlowRegular text-gray-500">
            {totalLabel}
          </Text>
        )}

        {/* Cards list with filtered loans */}
        {hasSearched && (
          <View className="mt-4 gap-4">
            {results.map((loan) => (
              <View
                key={loan.id}
                className="rounded-2xl border border-slate-200 bg-[#EAF2FF] p-4 shadow-sm"
              >
                {/* Book title */}
                <Text className="text-base font-barlowSemiBold text-slate-800">
                  {loan.bookTitle}
                </Text>
                <View className="mt-3">
                  {/* Badge color is defined by status */}
                  <Text
                    className={`self-start rounded-full px-2.5 py-1 text-xs font-barlowSemiBold ${
                      statusBadgeStyles[loan.status]
                    }`}
                  >
                    {loan.status}
                  </Text>
                </View>
                {/* Rental and return dates */}
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
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default App;
