import { Music2 } from "lucide-react";
import ConverterCard from "@/components/ConverterCard";

const Index = () => {
  return (
    <div className="noise-overlay min-h-screen flex flex-col items-center justify-center px-4 py-16 relative">
      <div className="relative z-10 w-full max-w-xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 mb-5">
            <Music2 className="w-7 h-7 text-primary" />
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-2">
            YT → MP3
          </h1>
          <p className="text-muted-foreground text-sm">
            Convert YouTube videos to high-quality MP3 files
          </p>
        </div>

        {/* Converter */}
        <ConverterCard />

        {/* Footer legal */}
        <p className="mt-10 text-center text-xs text-muted-foreground/60 max-w-sm mx-auto leading-relaxed">
          For personal use only. Users are responsible for complying with YouTube's Terms of Service and applicable copyright laws.
        </p>
      </div>
    </div>
  );
};

export default Index;
