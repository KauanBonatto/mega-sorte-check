import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Ticket } from "lucide-react";

interface GamesInputProps {
  games: number[][];
  onAddGame: (game: number[]) => void;
  onRemoveGame: (index: number) => void;
  onClearGames: () => void;
}

export function GamesInput({ games, onAddGame, onRemoveGame, onClearGames }: GamesInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleAddGame = () => {
    const numbers = inputValue
      .split(/[,\s]+/)
      .map(n => parseInt(n.trim(), 10))
      .filter(n => !isNaN(n) && n >= 1 && n <= 60);

    if (numbers.length >= 6) {
      onAddGame(numbers.sort((a, b) => a - b));
      setInputValue("");
    }
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

      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          type="text"
          placeholder="Ex: 01, 15, 23, 34, 45, 60"
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
        Adicione jogos com 6 ou mais números separados por vírgula ou espaço
      </p>
    </div>
  );
}
