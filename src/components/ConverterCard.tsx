import { useState, useCallback } from "react";
import { Download, AlertCircle, CheckCircle2, Music } from "lucide-react";
import QualitySelector from "./QualitySelector";
import WaveformAnimation from "./WaveformAnimation";
import { cn } from "@/lib/utils";

type Quality = "320" | "192" | "128";
type Status = "idle" | "loading" | "success" | "error";

const YOUTUBE_REGEX =
  /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[a-zA-Z0-9_-]{11}/;

const API_URL = "/api/download";

const ConverterCard = () => {
  const [url, setUrl] = useState("");
  const [quality, setQuality] = useState<Quality>("192");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [urlError, setUrlError] = useState("");

  const validateUrl = (value: string) => {
    if (!value.trim()) {
      setUrlError("");
      return false;
    }
    if (!YOUTUBE_REGEX.test(value.trim())) {
      setUrlError("Please enter a valid YouTube URL");
      return false;
    }
    setUrlError("");
    return true;
  };

  const handleSubmit = useCallback(async () => {
    if (!validateUrl(url)) {
      if (!url.trim()) setUrlError("URL is required");
      return;
    }

    setStatus("loading");
    setError("");

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim(), quality }),
      });

      if (!res.ok) {
        let msg = "Conversion failed. Please try again.";
        try {
          const json = await res.json();
          if (json.error) msg = json.error;
        } catch {
          // Failed to parse error JSON, use default message
        }
        throw new Error(msg);
      }

      const blob = await res.blob();
      const disposition = res.headers.get("Content-Disposition");
      let filename = "download.mp3";
      if (disposition) {
        const match = disposition.match(/filename="?(.+?)"?$/);
        if (match) filename = match[1];
      }

      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);

      setStatus("success");
      setTimeout(() => {
        setStatus("idle");
        setUrl("");
        setQuality("192");
      }, 3000);
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }, [url, quality]);

  const isLoading = status === "loading";

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="rounded-2xl bg-card border border-border p-8 shadow-2xl relative overflow-hidden">
        {/* Subtle top accent line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent" />

        {/* URL Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            YouTube URL
          </label>
          <div className="relative">
            <input
              type="url"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (urlError) validateUrl(e.target.value);
                if (status === "error") setStatus("idle");
              }}
              placeholder="Paste YouTube URL here..."
              disabled={isLoading}
              className={cn(
                "w-full rounded-lg bg-surface-input border px-4 py-3.5 text-foreground",
                "placeholder:text-muted-foreground/50 text-sm font-mono",
                "transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                urlError ? "border-destructive" : "border-border"
              )}
            />
          </div>
          {urlError && (
            <p className="mt-1.5 text-xs text-destructive flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {urlError}
            </p>
          )}
        </div>

        {/* Quality Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Audio Quality
          </label>
          <QualitySelector value={quality} onChange={setQuality} disabled={isLoading} />
        </div>

        {/* Loading waveform */}
        {isLoading && (
          <div className="mb-6 flex flex-col items-center gap-3">
            <WaveformAnimation />
            <p className="text-sm text-muted-foreground animate-pulse">
              Converting... this may take up to 30 seconds
            </p>
          </div>
        )}

        {/* Error */}
        {status === "error" && (
          <div className="mb-6 rounded-lg bg-destructive/10 border border-destructive/20 p-3 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* Success */}
        {status === "success" && (
          <div className="mb-6 rounded-lg bg-primary/10 border border-primary/20 p-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
            <p className="text-sm text-primary">Download started!</p>
          </div>
        )}

        {/* Download Button */}
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className={cn(
            "btn-press w-full rounded-lg py-4 px-6 font-semibold text-sm",
            "flex items-center justify-center gap-2",
            "transition-all duration-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            "disabled:cursor-not-allowed",
            isLoading
              ? "bg-primary/60 text-primary-foreground/70 animate-pulse-glow"
              : "bg-primary text-primary-foreground hover:brightness-110 active:brightness-95 shadow-lg hover:shadow-primary/25"
          )}
        >
          {isLoading ? (
            <>
              <Music className="w-4 h-4 animate-spin" />
              Converting...
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              Download MP3
            </>
          )}
        </button>
      </div>

      {/* Quality Info */}
      <div className="mt-8 rounded-xl bg-card/50 border border-border/50 p-6">
        <h3 className="text-sm font-display font-bold text-foreground mb-3">
          Quality Guide
        </h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex justify-between">
            <span>High (320 kbps)</span>
            <span>~7–10 MB per song</span>
          </div>
          <div className="flex justify-between">
            <span>Medium (192 kbps) — Recommended</span>
            <span>~4–6 MB per song</span>
          </div>
          <div className="flex justify-between">
            <span>Low (128 kbps)</span>
            <span>~3–4 MB per song</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConverterCard;
