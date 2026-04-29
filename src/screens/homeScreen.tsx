import {
  User,
  Heart,
  Star,
  Home,
  Briefcase,
  Smile,
  Volume2,
  Mic,
  Sprout,
  TreePine,
  DollarSign,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HomeScreenProps {
  userName: string;
}

const cards = [
  { icon: Sprout, label: "Plantio", bg: "#35504A" },
  { icon: TreePine, label: "Plantação", bg: "#4a6e65" },
  //{ icon: Star, label: "Tempo de Plantação", bg: "#5d8a7d" },
  { icon: DollarSign, label: "Renda", bg: "#3a7a5c" },
  { icon: Heart, label: "Perfil", bg: "#2d6b5a" },
  //{ icon: User, label: "Em breve", bg: "#35504A" },
];

const speak = (text: string) => {
  if ("speechSynthesis" in window) {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "pt-BR";
    u.rate = 0.8;
    speechSynthesis.speak(u);
  }
};

const green = "#35504A";

export function HomeScreen({ userName }: HomeScreenProps) {
  const navigate = useNavigate();
  return (
    <div
      className="flex flex-col min-h-screen relative pb-28"
      style={{
        background:
          "linear-gradient(to bottom, #e8efed, #f5f8f7)",
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-6 pt-8 pb-4">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center shadow-md"
          style={{
            background: `linear-gradient(135deg, ${green}, #4a6e65)`,
          }}
        >
          <User className="w-6 h-6 text-white" />
        </div>
        <button
          onClick={() =>
            speak(
              `Olá ${userName}. Esta é sua tela principal. Toque no alto falante de cada item para ouvir o que ele faz.`,
            )
          }
          className="ml-auto rounded-full p-3 shadow-md active:scale-95 transition-all"
          style={{ backgroundColor: green }}
        >
          <Volume2 className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Cards 2x2 */}
      <div className="flex flex-col gap-6 px-6 mt-4">
        {Array.from({
          length: Math.ceil(cards.length / 2),
        }).map((_, rowIdx) => {
          const pair = cards.slice(rowIdx * 2, rowIdx * 2 + 2);
          return (
            <div
              key={rowIdx}
              className="grid grid-cols-2 gap-4"
            >
              {pair.map((card, i) => {
                const Icon = card.icon;
                const idx = rowIdx * 2 + i;
                return (
                  <div
                    key={idx}
                    className="flex flex-col gap-2"
                  >
                    {/* Speaker + label */}
                    <button
                      onClick={() => speak(card.label)}
                      className="flex items-center gap-2 self-start px-2 active:scale-95 transition-all"
                    >
                      <Volume2
                        className="w-5 h-5"
                        style={{ color: green }}
                      />
                      <span
                        style={{
                          color: green,
                          fontSize: "0.85rem",
                        }}
                      >
                        {card.label}
                      </span>
                    </button>
                    {/* Card */}
                    <button
                      onClick={() => {
                        if (card.label === "Plantio") {
                          navigate("/add-plant");
                        } else if (card.label === "Plantação") {
                          navigate("/plant");
                        }
                      }}
                      className="aspect-square rounded-3xl flex items-center justify-center shadow-lg active:scale-90 transition-all hover:brightness-110"
                      style={{ backgroundColor: card.bg }}
                    >
                      <Icon
                        className="w-14 h-14 text-white"
                        strokeWidth={1.5}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Floating mic */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 max-w-[430px] w-full flex justify-center pointer-events-none">
        <button
          onClick={() =>
            speak("Microfone ativado. Diga o que deseja fazer.")
          }
          className="pointer-events-auto rounded-full flex items-center justify-center shadow-2xl active:scale-90 transition-all hover:brightness-110"
          style={{
            width: 72,
            height: 72,
            background: `linear-gradient(135deg, ${green}, #4a6e65)`,
          }}
        >
          <Mic className="w-9 h-9 text-white" />
        </button>
      </div>
    </div>
  );
}