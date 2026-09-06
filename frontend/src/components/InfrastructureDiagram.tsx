import InteractiveMermaid from "../utils/InteractiveMermaid";
import { useInView } from "../hooks/useInView";
import { infrastructureChart } from "../utils/infrastructureChart";

export default function InfrastructureDiagram() {
    const { ref: sectionRef, inView: sectionInView } = useInView();
    const { ref: headerRef, inView: headerInView } = useInView();
    const { ref: chartRef, inView: chartInView } = useInView();

    return (
        <div id="infrastructure-diagram" ref={sectionRef} className={`py-24 transition-opacity duration-300 ${sectionInView ? "opacity-100" : "opacity-0"}`}>
            <div className="max-w-6xl mx-auto px-6">
                <div ref={headerRef} className={`mb-16 transition-all duration-500 ${headerInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}>
                    <span className="font-mono text-xs tracking-widest text-accent">ARCHITECTURE</span>
                    <h1 className="font-display text-4xl lg:text-6xl text-bone mt-3 mb-5">Infrastructure</h1>
                    <p className="text-muted max-w-lg">End-to-end homelab breakdown — edge to a Raspberry Pi 5.</p>
                </div>

                <div ref={chartRef} className={`transition-all duration-500 ${chartInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`} style={{ transitionDelay: "0.15s" }}>
                    <div className="flex flex-col h-[750px]">
                        <InteractiveMermaid chart={infrastructureChart} />
                    </div>
                </div>
            </div>
        </div>
    );
}
