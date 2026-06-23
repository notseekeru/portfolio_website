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
    CiCheck["Linter/Formatter/StaticAnalysis"]
    Trivy["Trivy Security Scan"]
    GHCR["Github Registry"]
  end

subgraph Tailscale["Tailscale"]
    subgraph MainDevices["🖥️💻 Main Devices"]
      
      MainPC["MainPC"]
      MainLaptop["MainLaptop"]
      Ansible["Master Ansible"]
      Terraform["Master Terraform"]
      Kubectl["Kubernetes Control Plane"]
    end

    subgraph MainPC["🖥️ Personal Computer"]
      Ollama["Local Ollama Models"] --> SSH1["SSH Keys"]
    end
    subgraph MainLaptop["💻 Personal Laptop"]
      SSH2["SSH Keys"]
    end

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
        end

        subgraph ObservabilityStack["📊 Compose - Observability Stack (LGTM + Alloy)"]
          Alloy["Grafana Alloy:12345"]
          Prom["Prometheus:9090"]
          Loki["Loki:3100"]
          Tempo["Tempo:3200"]
          Grafana["Grafana Visualization :3030"]
          AManager["AlertManager:9093"]
        end
      end
    end
  end

  subgraph DOKS["☸️ DOKS (3-Node Cluster)"]
    ArgoCD["ArgoCD Operator"]
    Ingress["Ingress-Nginx Controller"]
    TunnelPod["Cloudflared Pod"]

    subgraph Workloads["⚙️ Namespaces"]
      AppPod["Portfolio Pods (Frontend/Backend)"]
      DBPod["Postgres StatefulSet"]
    end
  end

  Workloads -- Kubelet pulls image --> GHCR
  ArgoCD -- Updates Manifest --> Workloads
  TunnelPod -- Internal K8s Service --> Ingress
  Ingress -- Route --> AppPod
  AppPod -- Internal Service --> DBPod

  CloudflareEdge -- QUIC/HTTPS --> TunnelPod
  Git -- CI Check --> ALint & CiCheck
  CiCheck --> Trivy
  ALint -- Deploy --> Molecule
  Molecule -- Deploy --> SSHD1
  Trivy -- CD Build/Push --> GHCR

  SSH1 & SSH2 -- Tailscale Tunnel --> SSHD1

  Alloy -- Scrape Logs --> DLogs
  Alloy -- Remote Write --> Prom
  Alloy -- Loki Push --> Loki
  Alloy -- OTLP --> Tempo
  Prom & Loki & Tempo -- Query --> Grafana
  Prom -- Alerting Rules --> AManager --> Slack

  Frontend2 -. Frontend Logs/Traces .-> Alloy
  OTLPDep & OTLPDep2 -. OTLP Metrics & Spans .-> Alloy
  PostgresExporter -- Scrapes Metrics --> Postgres
  PostgresExporter -. Metrics :9187 .-> Alloy

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
            to Raspberry Pi 5 and monitoring stack.
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
