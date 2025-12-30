import { useState, useEffect } from "react";
import { History, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LotteryBall } from "@/components/LotteryBall";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export interface HistoryEntry {
  id: string;
  date: string;
  drawnNumbers: number[];
  games: number[][];
  results: {
    game: number[];
    matches: number;
  }[];
}

interface HistoryDisplayProps {
  history: HistoryEntry[];
  onClearHistory: () => void;
  onDeleteEntry: (id: string) => void;
}

export const HistoryDisplay = ({ history, onClearHistory, onDeleteEntry }: HistoryDisplayProps) => {
  const [expandedEntries, setExpandedEntries] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    setExpandedEntries(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const getMatchLabel = (count: number) => {
    if (count === 6) return { label: "Sena!", color: "text-green-500" };
    if (count === 5) return { label: "Quina!", color: "text-blue-500" };
    if (count === 4) return { label: "Quadra!", color: "text-purple-500" };
    if (count === 3) return { label: "Terno", color: "text-orange-500" };
    return { label: `${count} acertos`, color: "text-muted-foreground" };
  };

  if (history.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>Nenhuma verificação salva ainda</p>
        <p className="text-sm mt-2">Faça uma verificação para salvar no histórico</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <History className="w-5 h-5 text-primary" />
          Histórico de Verificações
        </h3>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
              <Trash2 className="w-4 h-4 mr-1" />
              Limpar Tudo
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Limpar histórico?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação não pode ser desfeita. Todas as verificações salvas serão removidas.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={onClearHistory}>Limpar</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="space-y-3">
        {history.map((entry) => {
          const isExpanded = expandedEntries.has(entry.id);
          const bestResult = Math.max(...entry.results.map(r => r.matches));
          const bestLabel = getMatchLabel(bestResult);

          return (
            <div
              key={entry.id}
              className="border border-border rounded-lg overflow-hidden"
            >
              <button
                onClick={() => toggleExpanded(entry.id)}
                className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors text-left"
              >
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{entry.date}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{entry.games.length} jogo(s)</span>
                    <span className={`text-sm font-medium ${bestLabel.color}`}>
                      Melhor: {bestLabel.label}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remover verificação?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta verificação será removida do histórico.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onDeleteEntry(entry.id)}>
                          Remover
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
              </button>

              {isExpanded && (
                <div className="p-4 pt-0 space-y-4 border-t border-border">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Números sorteados:</p>
                    <div className="flex flex-wrap gap-2">
                      {entry.drawnNumbers.map((num) => (
                        <LotteryBall key={num} number={num} size="sm" variant="drawn" />
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Jogos verificados:</p>
                    <div className="space-y-2">
                      {entry.results.map((result, idx) => {
                        const matchLabel = getMatchLabel(result.matches);
                        return (
                          <div
                            key={idx}
                            className="flex flex-wrap items-center gap-2 p-2 bg-muted/30 rounded-lg"
                          >
                            <span className="text-xs text-muted-foreground w-8">
                              #{idx + 1}
                            </span>
                            {result.game.map((num) => (
                              <LotteryBall
                                key={num}
                                number={num}
                                size="sm"
                                isMatch={entry.drawnNumbers.includes(num)}
                              />
                            ))}
                            <span className={`text-xs font-medium ml-auto ${matchLabel.color}`}>
                              {matchLabel.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
