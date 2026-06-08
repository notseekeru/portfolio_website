import { motion } from "framer-motion";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Hero from "../components/Hero";
import About from "../components/About";
import InfrastructureDiagram from "../components/InfrastructureDiagram";
import Blog from "../components/Blog";
import Contact from "../components/Contact";

export default function Home() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      // Use requestAnimationFrame to ensure the DOM has painted the sections
      // rather than a hardcoded sluggish 300ms delay
      requestAnimationFrame(() => {
        const el = document.getElementById(location.hash.substring(1));
        if (el) el.scrollIntoView({ behavior: "smooth" });
      });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div id="home">
        <Hero />
      </div>
      <div className="max-w-6xl mx-auto">
        <Divider />
      </div>
      <About />
      <div className="max-w-6xl mx-auto">
        <Divider />
      </div>
      <InfrastructureDiagram />
      <div className="max-w-6xl mx-auto">
        <Divider />
      </div>
      <Blog />
      <div className="max-w-6xl mx-auto">
        <Divider />
      </div>
      <Contact />
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
