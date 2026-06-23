import { motion } from "framer-motion";
import { useEffect, Fragment } from "react";
import { useLocation } from "react-router-dom";
import Hero from "../components/Hero";
import About from "../components/About";
import InfrastructureDiagram from "../components/InfrastructureDiagram";
import Blog from "../components/Blog";
import Contact from "../components/Contact";
import { fadeIn } from "../lib/motion";

const sections = [
  { id: "home", Component: Hero },
  { id: "about", Component: About },
  { id: "infrastructure-diagram", Component: InfrastructureDiagram },
  { id: "blog", Component: Blog },
  { id: "contact", Component: Contact },
] as const;

function Divider() {
  return (
    <div className="max-w-6xl mx-auto px-6">
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </div>
  );
}

export default function Home() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
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
      variants={fadeIn}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {sections.map(({ id, Component }, i) => (
        <Fragment key={id}>
          {i > 0 && <Divider />}
          <div id={id}>
            <Component />
          </div>
        </Fragment>
      ))}
    </motion.div>
  );
}
