import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FileImportProps {
  onImportGames: (games: number[][]) => void;
}

export function FileImport({ onImportGames }: FileImportProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const lines = content.split("\n").filter(line => line.trim());
      
      const games: number[][] = [];
      
      for (const line of lines) {
        // Skip comment lines
        if (line.startsWith("#") || line.startsWith("//")) continue;
        
        const numbers = line
          .split(/[,\s\-;]+/)
          .map(n => parseInt(n.trim(), 10))
          .filter(n => !isNaN(n) && n >= 1 && n <= 60);

        if (numbers.length >= 6) {
          games.push(numbers.sort((a, b) => a - b));
        }
      }

      if (games.length > 0) {
        onImportGames(games);
        toast({
          title: "Jogos importados!",
          description: `${games.length} jogos foram importados com sucesso.`,
        });
      } else {
        toast({
          title: "Nenhum jogo encontrado",
          description: "Verifique o formato do arquivo.",
          variant: "destructive",
        });
      }

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt"
        onChange={handleFileChange}
        className="hidden"
      />
      
      <Button
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        className="w-full border-dashed border-2 h-20 hover:bg-secondary/50"
      >
        <div className="flex flex-col items-center gap-2">
          <Upload className="w-5 h-5" />
          <span>Importar arquivo TXT</span>
        </div>
      </Button>

      <div className="bg-secondary/30 rounded-lg p-4 space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FileText className="w-4 h-4" />
          <span>Formato do arquivo:</span>
        </div>
        <pre className="text-xs text-muted-foreground font-mono bg-background/50 p-3 rounded overflow-x-auto">
{`# Cada linha é um jogo
01 - 15 - 23 - 34 - 45 - 60
02 - 16 - 24 - 35 - 46 - 59
03 - 17 - 25 - 36 - 47 - 58`}
        </pre>
      </div>
    </div>
  );
}
