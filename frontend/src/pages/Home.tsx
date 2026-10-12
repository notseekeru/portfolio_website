import { useEffect, Fragment, lazy, Suspense } from "react";
import { useLocation } from "react-router-dom";
import { useInView } from "../hooks/useInView";
import Hero from "../components/Hero";
import Blog from "../components/Blog";
import Projects from "../components/Projects";
import Contact from "../components/Contact";

const InfrastructureDiagram = lazy(() => import("../components/InfrastructureDiagram"));

// Anchor and padding sit on this wrapper so nav links and scroll-spy find the section before
// mermaid is fetched; the height reservation keeps the page from jumping when it swaps in.
function DeferredDiagram() {
    const { ref, inView } = useInView({ rootMargin: "600px 0px" });

    return (
        <div id="infrastructure-diagram" ref={ref} className={`py-24 ${inView ? "" : "min-h-[900px]"}`}>
            <Suspense fallback={null}>{inView && <InfrastructureDiagram />}</Suspense>
        </div>
    );
}

const sections = [
    { id: "home", Component: Hero },
    { id: "projects", Component: Projects },
    { id: "infrastructure-diagram", Component: DeferredDiagram },
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
        <div>
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
