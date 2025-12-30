import { useState } from "react";
import { DrawnNumbersInput } from "@/components/DrawnNumbersInput";
import { GamesInput } from "@/components/GamesInput";
import { FileImport } from "@/components/FileImport";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { InstallPWA } from "@/components/InstallPWA";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clover, Sparkles } from "lucide-react";

const Index = () => {
  const [drawnNumbers, setDrawnNumbers] = useState<number[]>([]);
  const [games, setGames] = useState<number[][]>([]);

  const handleAddGame = (game: number[]) => {
    setGames(prev => [...prev, game]);
  };

  const handleRemoveGame = (index: number) => {
    setGames(prev => prev.filter((_, i) => i !== index));
  };

  const handleClearGames = () => {
    setGames([]);
  };

  const handleImportGames = (importedGames: number[][]) => {
    setGames(prev => [...prev, ...importedGames]);
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <header className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Clover className="w-10 h-10 text-primary animate-float" />
            <h1 className="text-3xl sm:text-4xl font-bold text-gradient-gold">
              Mega da Virada
            </h1>
            <Sparkles className="w-8 h-8 text-primary animate-float" style={{ animationDelay: "0.5s" }} />
          </div>
          <p className="text-muted-foreground">
            Verifique seus jogos e descubra seus acertos
          </p>
        </header>

        {/* Drawn Numbers Section */}
        <section className="bg-card border border-border rounded-2xl p-6">
          <DrawnNumbersInput
            drawnNumbers={drawnNumbers}
            onSetDrawnNumbers={setDrawnNumbers}
          />
        </section>

        {/* Games Input Section */}
        <section className="bg-card border border-border rounded-2xl p-6">
          <Tabs defaultValue="manual" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="manual">Adicionar Manual</TabsTrigger>
              <TabsTrigger value="import">Importar Arquivo</TabsTrigger>
            </TabsList>
            
            <TabsContent value="manual">
              <GamesInput
                games={games}
                onAddGame={handleAddGame}
                onRemoveGame={handleRemoveGame}
                onClearGames={handleClearGames}
              />
            </TabsContent>
            
            <TabsContent value="import">
              <FileImport onImportGames={handleImportGames} />
              {games.length > 0 && (
                <div className="mt-6 pt-6 border-t border-border">
                  <GamesInput
                    games={games}
                    onAddGame={handleAddGame}
                    onRemoveGame={handleRemoveGame}
                    onClearGames={handleClearGames}
                  />
                </div>
              )}
            </TabsContent>
          </Tabs>
        </section>

        {/* Results Section */}
        <section className="bg-card border border-border rounded-2xl p-6">
          <ResultsDisplay drawnNumbers={drawnNumbers} games={games} />
          
          {(drawnNumbers.length === 0 || games.length === 0) && (
            <div className="text-center text-muted-foreground py-8">
              <p>Adicione os números sorteados e seus jogos para ver os resultados</p>
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="text-center text-sm text-muted-foreground">
          <p>Boa sorte! 🍀</p>
        </footer>
      </div>

      <InstallPWA />
    </div>
  );
};

export default Index;
