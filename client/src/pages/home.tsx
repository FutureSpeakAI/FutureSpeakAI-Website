import { useConfig } from "@/hooks/use-config";
import { motion } from "framer-motion";
import { FileCode2, Globe, FileUp, Sparkles } from "lucide-react";
import { CodeBlock } from "@/components/ui/code-block";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

export default function Home() {
  const { data: config } = useConfig();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 sm:p-12 font-sans selection:bg-foreground selection:text-background relative overflow-hidden">
      
      {/* Extremely subtle background gradient */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-muted/50 to-transparent pointer-events-none -z-10" />

      <motion.div 
        variants={container} 
        initial="hidden" 
        animate="show" 
        className="w-full max-w-4xl mx-auto flex flex-col items-center text-center"
      >
        {/* Status Indicator */}
        <motion.div variants={item} className="flex items-center space-x-2 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 px-3 py-1.5 rounded-full mb-10">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="tracking-wide uppercase">Deployment Active</span>
        </motion.div>

        {/* Hero Copy */}
        <motion.h1 variants={item} className="text-4xl sm:text-5xl md:text-6xl font-light tracking-tight text-foreground mb-6">
          {config?.title || "Your blank canvas awaits."}
        </motion.h1>

        <motion.p variants={item} className="text-lg md:text-xl text-muted-foreground font-light max-w-2xl mb-16 leading-relaxed">
          Your web server is running successfully. To display your own custom HTML, simply replace the default placeholder file.
        </motion.p>

        {/* Instructional Steps Grid */}
        <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left mb-16">
          <div className="p-6 rounded-2xl border border-border bg-card/50 shadow-sm shadow-black/[0.02] hover:shadow-md hover:bg-card transition-all duration-300">
            <div className="w-10 h-10 rounded-full border border-border bg-background flex items-center justify-center mb-5 text-foreground shadow-sm">
              <Globe className="w-4 h-4 text-muted-foreground" />
            </div>
            <h3 className="font-medium text-foreground mb-2 text-sm tracking-wide uppercase">1. Locate</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Open your project workspace and navigate directly to the <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded text-foreground">client/index.html</code> file.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-border bg-card/50 shadow-sm shadow-black/[0.02] hover:shadow-md hover:bg-card transition-all duration-300">
            <div className="w-10 h-10 rounded-full border border-border bg-background flex items-center justify-center mb-5 text-foreground shadow-sm">
              <FileCode2 className="w-4 h-4 text-muted-foreground" />
            </div>
            <h3 className="font-medium text-foreground mb-2 text-sm tracking-wide uppercase">2. Replace</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Delete the placeholder code and paste in your own custom HTML, CSS, and JS structure.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-border bg-card/50 shadow-sm shadow-black/[0.02] hover:shadow-md hover:bg-card transition-all duration-300">
            <div className="w-10 h-10 rounded-full border border-border bg-background flex items-center justify-center mb-5 text-foreground shadow-sm">
              <Sparkles className="w-4 h-4 text-muted-foreground" />
            </div>
            <h3 className="font-medium text-foreground mb-2 text-sm tracking-wide uppercase">3. Deploy</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Save the file. Your deployment will automatically pick up the changes and serve them instantly.
            </p>
          </div>
        </motion.div>
        
        {/* Code Example Section */}
        <motion.div variants={item} className="w-full text-left max-w-3xl">
          <div className="mb-4 ml-2 flex items-center text-sm font-medium text-foreground tracking-wide uppercase">
            <FileUp className="w-4 h-4 mr-2 text-muted-foreground" /> 
            Starter Template
          </div>
          <CodeBlock 
            filename="client/index.html"
            language="html"
            code={`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My Custom Website</title>
    <!-- Add your custom fonts or CSS links here -->
    <style>
      body {
        font-family: system-ui, sans-serif;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100vh;
        margin: 0;
        background: #f9fafb;
      }
      h1 { color: #111827; font-weight: 500; }
    </style>
  </head>
  <body>
    <h1>Hello, World!</h1>
  </body>
</html>`} 
          />
        </motion.div>

        {/* Footer */}
        <motion.footer variants={item} className="mt-24 text-center text-xs text-muted-foreground tracking-widest uppercase">
          Ready to build something amazing
        </motion.footer>
      </motion.div>
    </div>
  );
}
