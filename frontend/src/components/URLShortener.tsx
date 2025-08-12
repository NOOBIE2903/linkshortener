import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Copy, Check, Link, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShortenedUrl {
  originalUrl: string;
  shortUrl: string;
}

export const URLShortener = () => {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [shortenedUrl, setShortenedUrl] = useState<ShortenedUrl | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const API_BASE = "http://127.0.0.1:8000"; // Django backend base URL

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!url.trim()) {
      setError("Please enter a URL");
      return;
    }

    if (!isValidUrl(url)) {
      setError("Please enter a valid URL");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/shorten/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ long_url: url })
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      setShortenedUrl({
        originalUrl: data.long_url,
        shortUrl: `${API_BASE}/${data.short_code}` // full short URL
      });

    } catch (err) {
      console.error(err);
      setError("Failed to shorten URL. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (shortenedUrl) {
      try {
        await navigator.clipboard.writeText(shortenedUrl.shortUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  };

  const handleNewUrl = () => {
    setUrl("");
    setShortenedUrl(null);
    setError("");
    setCopied(false);
  };

  return (
    <div className="min-h-screen bg-gradient-pastel relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary-glow rounded-full blur-xl"></div>
        <div className="absolute bottom-32 right-20 w-40 h-40 bg-secondary rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-accent rounded-full blur-lg"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16 min-h-screen flex flex-col items-center justify-center">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="p-3 bg-gradient-card rounded-2xl shadow-glass backdrop-blur-sm">
              <Link className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4">
            Link <span className="text-primary">Shaper</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-lg mx-auto leading-relaxed">
            Transform your long URLs into beautiful, shareable links in seconds
          </p>
        </div>

        {/* Main Card */}
        <Card className="w-full max-w-2xl bg-gradient-card backdrop-blur-sm border-0 shadow-glass p-8 md:p-12">
          {!shortenedUrl ? (
            /* Input Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="url" className="text-sm font-medium text-foreground">
                  Enter your long URL
                </label>
                <div className="relative">
                  <Input
                    id="url"
                    type="url"
                    placeholder="https://example.com/very/long/url/path"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className={cn(
                      "h-14 px-4 text-lg bg-input border-border focus:bg-input-focus focus:border-primary transition-all duration-300",
                      error && "border-destructive focus:border-destructive"
                    )}
                    disabled={isLoading}
                  />
                  <Link className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                </div>
                {error && (
                  <p className="text-sm text-destructive animate-in slide-in-from-top-1 duration-300">
                    {error}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                variant="hero"
                size="lg"
                disabled={isLoading}
                className="w-full h-14 text-lg font-semibold"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    Shortening...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Shorten URL
                  </div>
                )}
              </Button>
            </form>
          ) : (
            /* Result Display */
            <div className="space-y-8 text-center">
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Check className="h-6 w-6 text-success" />
                  <span className="text-lg font-medium text-success">URL Shortened Successfully!</span>
                </div>
                <p className="text-sm text-muted-foreground">Your new short URL is ready</p>
              </div>

              <div className="space-y-4">
                {/* Original URL */}
                <div className="p-4 bg-muted rounded-xl">
                  <p className="text-xs text-muted-foreground mb-1">Original URL</p>
                  <p className="text-sm text-foreground break-all">{shortenedUrl.originalUrl}</p>
                </div>

                {/* Shortened URL */}
                <div className="p-6 bg-gradient-hero rounded-xl shadow-soft">
                  <p className="text-xs text-primary-foreground mb-2 opacity-90">Your Short URL</p>
                  <div className="flex items-center gap-3">
                    <p className="text-lg font-semibold text-primary-foreground flex-1 break-all">
                      {shortenedUrl.shortUrl}
                    </p>
                    <Button
                      variant="glass"
                      size="sm"
                      onClick={copyToClipboard}
                      className="shrink-0"
                    >
                      {copied ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {copied && (
                  <p className="text-sm text-success animate-in slide-in-from-top-1 duration-300">
                    ✨ Copied to clipboard!
                  </p>
                )}
              </div>

              <Button
                variant="outline"
                onClick={handleNewUrl}
                className="w-full"
              >
                Shorten Another URL
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
