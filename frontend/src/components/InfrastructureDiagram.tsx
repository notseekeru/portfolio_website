import InteractiveMermaid from "../utils/InteractiveMermaid";
import { useInView } from "../hooks/useInView";

const infrastructureChart = `---
config:
  layout: elk
---
flowchart TB
  subgraph Internet["🌍 Public Internet"]
    Users["End Users"]
    Slack["Slack Channel"]
    CloudflareEdge["Cloudflare Edge"]
  end

  subgraph CI_CD["🔄 GHA CI/CD Pipeline"]
    Git["GitHub Repo CI/CD"]
    ALint["Ansible Lint"]
    Molecule["Molecule Testing"]
    CiCheck["Linter/Formatter/StaticAnalysis/Audit"]
    Trivy["Trivy Security Scan"]
    GHCR["Github Registry"]

    Git --> ALint & CiCheck
    CiCheck --> Trivy
    ALint --> Molecule
    Trivy --> GHCR
  end

  subgraph Tailscale["Tailscale"]
    subgraph MainDevices["🖥️💻 Main Devices"]
      MainPC["MainPC"]
      MainLaptop["MainLaptop"]
      Ansible["Master Ansible"]
      Terraform["Master Terraform"]
      Kubectl["Kubernetes Control Plane"]
      Kubeconfig["kubeconfig"]
      DynamicInven["Dynamic Inventory"]
    end

    Kubectl --> Kubeconfig
    Terraform --> Kubeconfig
    Terraform --> DynamicInven
    Ansible --> DynamicInven

    subgraph MainPC["🖥️ Personal Computer"]
      Ollama["Local Ollama Models"] --> SSH1["SSH Keys"]
    end
    subgraph MainLaptop["💻 Personal Laptop"]
      SSH2["SSH Keys"]
    end

    SSH1 & SSH2 --> SSHD1

    subgraph Pi5["⚙️ Node - Raspberry Pi 5"]
      subgraph SSHD1["🔒 SSHD Configs"]
        F2B["Fail2ban"] --> NoIP["No Local IP SSH"] --> Port22["Only on Port 22"] --> UFW["Only allow Tailscale Devices"] --> AKeys["No Key, No Entry"] --> APerms["No Root Login"] --> Access["SSH Completed"]
      end
      
      subgraph Docker["🐳 Docker Containers"]
        DLogs["Docker Logs"]
        
        subgraph DiagramStack["📊 Compose - Diagram Stack (Observability Experimentation Application)"]
          Frontend2["React/Vite Frontend (Diagram)"]
          subgraph Backend2["Node.js Backend (Diagram)"]
            Nodejs2["Node JS Runtime"]
            OTLPDep["OTLP Metrics HTTP"]
            OTLPDep2["OTLP Spans HTTP"]
          end
          Postgres["Postgres DB :5432"]
          PostgresExporter["Postgres Exporter :9187"]

          Frontend2 -.-> Alloy
          OTLPDep & OTLPDep2 -.-> Alloy
          PostgresExporter --> Postgres
          PostgresExporter -.-> Alloy
        end

        subgraph ObservabilityStack["📊 Compose - Observability Stack (LGTM + Alloy)"]
          Alloy["Grafana Alloy:12345"]
          Prom["Prometheus:9090"]
          Loki["Loki:3100"]
          Tempo["Tempo:3200"]
          Grafana["Grafana Visualization :3030"]
          AManager["AlertManager:9093"]

          Alloy --> DLogs
          Alloy --> Prom
          Alloy --> Loki
          Alloy --> Tempo
          Prom & Loki & Tempo --> Grafana
          Prom --> AManager
          AManager --> Slack
        end
      end
    end
  end

  subgraph DOKS["☸️ DOKS (3-Node Cluster)"]
    ArgoCD["ArgoCD Operator"]
    Ingress["Ingress-Nginx Controller"]
    TunnelPod["Cloudflared Pod"]

    subgraph Workloads["⚙️ Namespaces"]
      Portfolio_Frontend_Pod
      Portfolio_Backend_Pod
    end

    CloudflareEdge --> TunnelPod
    ArgoCD --> Workloads
    TunnelPod --> Ingress
    Ingress --> Portfolio_Frontend_Pod
    Ingress --> Portfolio_Backend_Pod
    Workloads --> GHCR
  end

  `;

export default function InfrastructureDiagram() {
  const { ref: sectionRef, inView: sectionInView } = useInView();
  const { ref: headerRef, inView: headerInView } = useInView();
  const { ref: chartRef, inView: chartInView } = useInView();

  return (
    <div
      id="infrastructure-diagram"
      ref={sectionRef}
      className={`py-24 transition-opacity duration-300 ${sectionInView ? "opacity-100" : "opacity-0"}`}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div
          ref={headerRef}
          className={`mb-16 transition-all duration-500 ${headerInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
        >
          <span className="font-mono text-xs text-accent tracking-[0.3em] uppercase">
            Architecture
          </span>
          <h1 className="text-4xl lg:text-5xl font-bold text-zinc-100 mt-2 mb-4">
            Full Infrastructure Diagram
          </h1>
          <p className="text-zinc-500 max-w-lg">
            End-to-end homelab infrastructure breakdown — from Cloudflare edge
            to Raspberry Pi 5, Managed Cloud Kubernetes Clusters and monitoring
            stack.
          </p>
        </div>

        <div
          ref={chartRef}
          className={`transition-all duration-500 ${chartInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
          style={{ transitionDelay: "0.15s" }}
        >
          <InteractiveMermaid chart={infrastructureChart} />
        </div>
      </div>
    </div>
  );
}
