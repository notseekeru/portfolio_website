import { motion } from "framer-motion";
import Hero from "../components/Hero";
import About from "../components/About";
import Experience from "../components/Experience";

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Hero />
      <div className="max-w-6xl mx-auto">
        <Divider />
      </div>
      <About />
      <div className="max-w-6xl mx-auto">
        <Divider />
      </div>
      <Experience />
      <div className="max-w-6xl mx-auto">
        <Divider />
      </div>
    </motion.div>
  );
}

function Divider() {
  return (
    <div className="px-6">
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </div>
  );
}
