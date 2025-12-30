import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LotteryBall } from "./LotteryBall";
import { Sparkles } from "lucide-react";

interface DrawnNumbersInputProps {
  drawnNumbers: number[];
  onSetDrawnNumbers: (numbers: number[]) => void;
}

export function DrawnNumbersInput({ drawnNumbers, onSetDrawnNumbers }: DrawnNumbersInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = () => {
    const numbers = inputValue
      .split(/[,\s]+/)
      .map(n => parseInt(n.trim(), 10))
      .filter(n => !isNaN(n) && n >= 1 && n <= 60)
      .slice(0, 6);

    if (numbers.length === 6) {
      onSetDrawnNumbers(numbers.sort((a, b) => a - b));
      setInputValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Sparkles className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-semibold text-foreground">Números Sorteados</h2>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          type="text"
          placeholder="Ex: 01 - 15 - 23 - 34 - 45 - 60"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-secondary border-border text-foreground placeholder:text-muted-foreground"
        />
        <Button onClick={handleSubmit} className="shrink-0">
          Confirmar
        </Button>
      </div>

      {drawnNumbers.length > 0 && (
        <div className="flex flex-wrap gap-3 justify-center p-6 bg-card rounded-xl border border-border">
          {drawnNumbers.map((num, idx) => (
            <LotteryBall key={idx} number={num} variant="drawn" />
          ))}
        </div>
      )}

      {drawnNumbers.length === 0 && (
        <p className="text-muted-foreground text-sm text-center">
          Insira os 6 números sorteados separados por traço (ex: 01 - 15 - 23 - 34 - 45 - 60)
        </p>
      )}
    </div>
  );
}
