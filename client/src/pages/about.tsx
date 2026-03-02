import { motion } from "framer-motion";
import profilePhoto from "@assets/1760623171257_1771883927684.jpg";

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

export default function About() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 sm:p-12 font-sans selection:bg-foreground selection:text-background relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-muted/50 to-transparent pointer-events-none -z-10" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="w-full max-w-2xl mx-auto flex flex-col items-center text-center"
      >
        <motion.div variants={item} className="mb-8">
          <img
            src={profilePhoto}
            alt="Profile photo"
            data-testid="img-profile-photo"
            className="w-40 h-40 rounded-full object-cover border-2 border-border shadow-md"
          />
        </motion.div>

        <motion.h1 variants={item} className="text-3xl sm:text-4xl font-light tracking-tight text-foreground mb-4">
          About Me
        </motion.h1>

        <motion.p variants={item} className="text-lg text-muted-foreground font-light max-w-xl leading-relaxed mb-8">
          Welcome to my personal site. This is where I share my work, ideas, and a little bit about who I am.
        </motion.p>

        <motion.div variants={item}>
          <a
            href="/"
            data-testid="link-back-home"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
          >
            Back to home
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
}
