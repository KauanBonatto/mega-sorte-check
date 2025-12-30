import { LotteryBall } from "./LotteryBall";
import { Trophy, PartyPopper, Frown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResultsDisplayProps {
  drawnNumbers: number[];
  games: number[][];
}

function getMatchCount(game: number[], drawnNumbers: number[]): number {
  return game.filter(n => drawnNumbers.includes(n)).length;
}

function getMatchLabel(count: number): { label: string; color: string; icon?: React.ReactNode } {
  if (count === 6) return { label: "SENA! 🎉", color: "text-primary", icon: <PartyPopper className="w-5 h-5" /> };
  if (count === 5) return { label: "Quina!", color: "text-success" };
  if (count === 4) return { label: "Quadra", color: "text-success" };
  if (count >= 1) return { label: `${count} acerto${count > 1 ? "s" : ""}`, color: "text-muted-foreground" };
  return { label: "Nenhum acerto", color: "text-muted-foreground", icon: <Frown className="w-4 h-4" /> };
}

export function ResultsDisplay({ drawnNumbers, games }: ResultsDisplayProps) {
  if (drawnNumbers.length === 0 || games.length === 0) {
    return null;
  }

  const results = games.map((game, idx) => ({
    index: idx,
    game,
    matches: getMatchCount(game, drawnNumbers),
    matchedNumbers: game.filter(n => drawnNumbers.includes(n)),
  })).sort((a, b) => b.matches - a.matches);

  const totalWithPrize = results.filter(r => r.matches >= 4).length;
  const maxMatches = Math.max(...results.map(r => r.matches));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Trophy className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-semibold text-foreground">Resultados</h2>
      </div>

      {maxMatches >= 4 && (
        <div className="bg-gradient-to-r from-primary/20 to-success/20 border border-primary/30 rounded-xl p-4 text-center animate-shimmer">
          <p className="text-lg font-semibold text-primary">
            🎉 Parabéns! Você tem {totalWithPrize} jogo{totalWithPrize > 1 ? "s" : ""} premiado{totalWithPrize > 1 ? "s" : ""}!
          </p>
        </div>
      )}

      <div className="space-y-3">
        {results.map((result) => {
          const matchInfo = getMatchLabel(result.matches);
          const isPrize = result.matches >= 4;

          return (
            <div
              key={result.index}
              className={cn(
                "p-4 rounded-xl border transition-all",
                isPrize
                  ? "bg-card border-primary/30 glow-gold"
                  : "bg-card/50 border-border"
              )}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground text-sm font-medium w-12">
                    Jogo #{result.index + 1}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {result.game.map((num, idx) => (
                      <LotteryBall
                        key={idx}
                        number={num}
                        size="sm"
                        isMatch={result.matchedNumbers.includes(num)}
                      />
                    ))}
                  </div>
                </div>
                <div className={cn("flex items-center gap-2 font-semibold", matchInfo.color)}>
                  {matchInfo.icon}
                  <span>{matchInfo.label}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-border">
        {[6, 5, 4, 3].map((count) => {
          const gamesWithCount = results.filter(r => r.matches === count).length;
          const labels: Record<number, string> = { 6: "Sena", 5: "Quina", 4: "Quadra", 3: "3 acertos" };
          return (
            <div key={count} className="text-center p-3 bg-secondary/30 rounded-lg">
              <div className="text-2xl font-bold text-foreground">{gamesWithCount}</div>
              <div className="text-sm text-muted-foreground">{labels[count]}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
