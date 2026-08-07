import { useEffect, Fragment } from "react";
import { useLocation } from "react-router-dom";
import Hero from "../components/Hero";
import InfrastructureDiagram from "../components/InfrastructureDiagram";
import Blog from "../components/Blog";
import Projects from "../components/Projects";
import Contact from "../components/Contact";

const sections = [
    { id: "home", Component: Hero },
    { id: "infrastructure-diagram", Component: InfrastructureDiagram },
    { id: "projects", Component: Projects },
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
        <div className="animate-fade-in">
            {sections.map(({ id, Component }, i) => (
                <Fragment key={id}>
                    {i > 0 && <Divider />}
                    <div id={id}>
                        <Component />
                    </div>
                </Fragment>
            ))}
        </div>
    );
}
