import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-6 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-center"
      >
        <h1 className="text-8xl font-light tracking-tighter mb-6 text-foreground/20">404</h1>
        <p className="text-muted-foreground mb-12 text-lg font-light tracking-wide">The page you're looking for doesn't exist.</p>
        
        <Link 
          href="/" 
          className="inline-flex items-center justify-center text-sm font-medium tracking-wide uppercase text-foreground hover:text-muted-foreground transition-all duration-200 border-b border-transparent hover:border-muted-foreground pb-1"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Return to root
        </Link>
      </motion.div>
    </div>
  );
}
