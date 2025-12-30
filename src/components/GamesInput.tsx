import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Ticket, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GamesInputProps {
  games: number[][];
  onAddGame: (game: number[]) => void;
  onRemoveGame: (index: number) => void;
  onClearGames: () => void;
}

export function GamesInput({ games, onAddGame, onRemoveGame, onClearGames }: GamesInputProps) {
  const [inputValue, setInputValue] = useState("");
  const { toast } = useToast();

  const generateRandomGame = () => {
    const numbers: number[] = [];
    while (numbers.length < 6) {
      const randomNum = Math.floor(Math.random() * 60) + 1;
      if (!numbers.includes(randomNum)) {
        numbers.push(randomNum);
      }
    }
    const sortedNumbers = numbers.sort((a, b) => a - b);
    onAddGame(sortedNumbers);
    setInputValue("");
    toast({
      title: "Jogo aleatório adicionado!",
      description: `Jogo #${games.length + 1} com números: ${sortedNumbers.map(n => n.toString().padStart(2, "0")).join(" - ")}`,
    });
  };

  const handleAddGame = () => {
    if (!inputValue.trim()) {
      toast({
        title: "Campo vazio",
        description: "Digite os números do seu jogo.",
        variant: "destructive",
      });
      return;
    }

    // Parse all numbers from input
    const rawNumbers = inputValue
      .split(/[-,\s]+/)
      .map(n => n.trim())
      .filter(n => n !== "");

    // Check for invalid entries (non-numbers)
    const invalidEntries = rawNumbers.filter(n => isNaN(parseInt(n, 10)));
    if (invalidEntries.length > 0) {
      toast({
        title: "Formato inválido",
        description: "Use apenas números separados por traço. Ex: 01 - 15 - 23 - 34 - 45 - 60",
        variant: "destructive",
      });
      return;
    }

    const parsedNumbers = rawNumbers.map(n => parseInt(n, 10));

    // Check for numbers out of range (1-60)
    const outOfRange = parsedNumbers.filter(n => n < 1 || n > 60);
    if (outOfRange.length > 0) {
      toast({
        title: "Números fora do limite",
        description: `Os números devem estar entre 01 e 60. Números inválidos: ${outOfRange.join(", ")}`,
        variant: "destructive",
      });
      return;
    }

    // Check for duplicates
    const uniqueNumbers = [...new Set(parsedNumbers)];
    if (uniqueNumbers.length !== parsedNumbers.length) {
      toast({
        title: "Números duplicados",
        description: "Cada número deve aparecer apenas uma vez no jogo.",
        variant: "destructive",
      });
      return;
    }

    // Check for minimum 6 numbers
    if (uniqueNumbers.length < 6) {
      toast({
        title: "Quantidade insuficiente",
        description: `Um jogo precisa ter no mínimo 6 números. Você inseriu ${uniqueNumbers.length}.`,
        variant: "destructive",
      });
      return;
    }

    // Check for maximun 20 numbers
    if (uniqueNumbers.length > 20) {
      toast({
        title: "Quantidade ultrapassada",
        description: `Um jogo pode ter no máximo 20 números. Você inseriu ${uniqueNumbers.length}.`,
        variant: "destructive",
      });
      return;
    }

    onAddGame(uniqueNumbers.sort((a, b) => a - b));
    setInputValue("");
    toast({
      title: "Jogo adicionado!",
      description: `Jogo #${games.length + 1} com ${uniqueNumbers.length} números foi registrado.`,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddGame();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Ticket className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Seus Jogos</h2>
          {games.length > 0 && (
            <span className="text-sm text-muted-foreground">({games.length} jogos)</span>
          )}
        </div>
        {games.length > 0 && (
          <Button variant="ghost" size="sm" onClick={onClearGames} className="text-destructive hover:text-destructive">
            <Trash2 className="w-4 h-4 mr-2" />
            Limpar
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            type="text"
            placeholder="Ex: 01 - 15 - 23 - 34 - 45 - 60"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-secondary border-border text-foreground placeholder:text-muted-foreground"
          />
          <Button onClick={handleAddGame} variant="secondary" className="shrink-0">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar
          </Button>
        </div>
        <Button 
          onClick={generateRandomGame} 
          variant="outline" 
          className="w-full sm:w-auto"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Gerar Jogo Aleatório
        </Button>
      </div>

      {games.length > 0 && (
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {games.map((game, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg border border-border group"
            >
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-sm w-8">#{idx + 1}</span>
                <span className="font-mono text-foreground">
                  {game.map(n => n.toString().padStart(2, "0")).join(" - ")}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemoveGame(idx)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <p className="text-muted-foreground text-sm text-center">
        Adicione jogos com 6 ou mais números separados por traço (ex: 01 - 15 - 23 - 34 - 45 - 60)
      </p>
    </div>
  );
}
