import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LotteryBall } from "./LotteryBall";
import { Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DrawnNumbersInputProps {
  drawnNumbers: number[];
  onSetDrawnNumbers: (numbers: number[]) => void;
}

export function DrawnNumbersInput({ drawnNumbers, onSetDrawnNumbers }: DrawnNumbersInputProps) {
  const [inputValue, setInputValue] = useState("");
  const { toast } = useToast();

  const generateRandomNumbers = () => {
    const numbers: number[] = [];
    while (numbers.length < 6) {
      const randomNum = Math.floor(Math.random() * 60) + 1;
      if (!numbers.includes(randomNum)) {
        numbers.push(randomNum);
      }
    }
    const sortedNumbers = numbers.sort((a, b) => a - b);
    onSetDrawnNumbers(sortedNumbers);
    setInputValue("");
    toast({
      title: "Números aleatórios gerados!",
      description: `Números: ${sortedNumbers.map(n => n.toString().padStart(2, "0")).join(" - ")}`,
    });
  };

  const handleSubmit = () => {
    if (!inputValue.trim()) {
      toast({
        title: "Campo vazio",
        description: "Digite os 6 números sorteados.",
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
        description: "Cada número deve aparecer apenas uma vez.",
        variant: "destructive",
      });
      return;
    }

    // Check for exactly 6 numbers
    if (uniqueNumbers.length !== 6) {
      toast({
        title: "Quantidade incorreta",
        description: `Insira exatamente 6 números. Você inseriu ${uniqueNumbers.length}.`,
        variant: "destructive",
      });
      return;
    }

    onSetDrawnNumbers(uniqueNumbers.sort((a, b) => a - b));
    setInputValue("");
    toast({
      title: "Números confirmados!",
      description: "Os números sorteados foram registrados.",
    });
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
          <Button onClick={handleSubmit} className="shrink-0">
            Confirmar
          </Button>
        </div>
        <Button 
          onClick={generateRandomNumbers} 
          variant="outline" 
          className="w-full sm:w-auto"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Gerar Aleatório
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
