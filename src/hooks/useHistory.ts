import { useState, useEffect } from "react";
import { HistoryEntry } from "@/components/HistoryDisplay";

const STORAGE_KEY = "mega-virada-history";

export const useHistory = () => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch {
        setHistory([]);
      }
    }
  }, []);

  const saveToStorage = (entries: HistoryEntry[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  };

  const addEntry = (drawnNumbers: number[], games: number[][]) => {
    const results = games.map(game => ({
      game,
      matches: game.filter(num => drawnNumbers.includes(num)).length,
    }));

    const newEntry: HistoryEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleString("pt-BR"),
      drawnNumbers,
      games,
      results,
    };

    const newHistory = [newEntry, ...history];
    setHistory(newHistory);
    saveToStorage(newHistory);
  };

  const deleteEntry = (id: string) => {
    const newHistory = history.filter(entry => entry.id !== id);
    setHistory(newHistory);
    saveToStorage(newHistory);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    history,
    addEntry,
    deleteEntry,
    clearHistory,
  };
};
