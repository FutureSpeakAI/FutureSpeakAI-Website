import { Check, Copy } from "lucide-react";
import { useState } from "react";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
}

export function CodeBlock({ code, language = "html", filename = "index.html" }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  
  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group rounded-xl border border-border bg-card overflow-hidden shadow-sm shadow-black/5 transition-all duration-300 hover:shadow-md hover:border-border/80">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-muted/30">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-border/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-border/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-border/80" />
          </div>
          <span className="text-xs font-medium text-muted-foreground ml-2">{filename}</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-[10px] font-mono text-muted-foreground/70 uppercase tracking-widest">{language}</span>
          <button 
            onClick={copy} 
            className="text-muted-foreground hover:text-foreground transition-colors flex items-center p-1 rounded-md hover:bg-muted"
            aria-label="Copy code"
            title="Copy to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
      <div className="p-5 overflow-x-auto bg-background/50">
        <pre className="text-[13px] leading-loose font-mono text-foreground/80">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}
