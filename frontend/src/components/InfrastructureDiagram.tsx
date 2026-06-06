import { motion } from "framer-motion";
import InteractiveMermaid from "./InteractiveMermaid";

const infrastructureChart = `---
config:
  layout: elk
---
flowchart TB
  subgraph PublicEdge["📡 Public Edge Layer"]
    WAF["Cloudflare Edge"]
    CFTunnel["Cloudflare Tunnel"]
  end

  subgraph Internet["🌍 Public Internet"]
    Users["End Users"]
    Slack["Slack Channel"]
  end

  subgraph CI_CD["🔄 GHA CI/CD Pipeline"]
    Git["GitHub Repo CI/CD"]
    ALint["Ansible Lint"]
    Molecule["Molecule Testing"]
    CiCheck["Linter/Formatter/StaticAnalysis"]
    Trivy["Trivy Security Scan"]
    GHCR["Github Registry"]
  end

  subgraph Tailscale["🌐 Tailscale Devices"]
    subgraph MainDevices["🖥️💻 Main Devices"]
      MainPC["MainPC"]
      MainLaptop["MainLaptop"]
      Ansible["Master Ansible"]
      Terraform["Master Terraform"]
    end

    subgraph Pi5["⚙️ Node - Raspberry Pi 5"]
      subgraph SSHD1["🔒 SSHD Configs"]
        F2B["Fail2ban"] --> NoIP["No Local IP SSH"] --> Port22["Only on Port 22"] --> UFW["Only allow Tailscale Devices"] --> AKeys["No Key, No Entry"] --> APerms["No Root Login"] --> Access["SSH Completed"]
      end
      
      subgraph Docker["🐳 Docker Containers"]
        DLogs["Docker Logs"]
        
        subgraph DiagramStack["📊 Compose - Diagram Stack"]
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

    subgraph DigitalOcean["💧 DigitalOcean Cloud"]
      subgraph Droplet1[" Debian Droplet"]
        subgraph DODocker["🐳 Docker Compose - Traffic Stack"]
          DONginx["Nginx Reverse Proxy"]
          DOCfD["Cloudflared Tunnel"]
        end

        subgraph AppLayer["💼 Compose - Portfolio Website Stack"]
          Frontend["React/Vite Frontend"]
          Backend["Node.js Backend"]
        end
      end
    end
  end

  subgraph SubMainPC["🖥️ Personal Computer"]
    Ollama["Local Ollama Models"] --> SSH1["SSH Keys"]
  end
  subgraph SubMainLaptop["💻 Personal Laptop"]
    SSH2["SSH Keys"]
  end

  %% CI/CD Flows
  Git -- CI Check --> ALint & CiCheck
  CiCheck -- Action --> Trivy
  ALint -- Deploy --> Molecule
  Molecule -- Deploy --> SSHD1
  Trivy -- Build/Push --> GHCR

  %% Edge/Ingress Flows
  Users -- HTTPS --> WAF --> CFTunnel
  CFTunnel -. HTTPS .-> DOCfD
  DOCfD --> DONginx
  DONginx -- HTTP --> Frontend & Backend
  SSH1 & SSH2 -- Tailscale Tunnel --> SSHD1

  %% Deployment / Registry Pulls
  Frontend & Backend -- Pull w/Token --> GHCR
  Frontend2 & Nodejs2 -- Pull w/Token --> GHCR

  %% Observability Stack Internal Routing
  Alloy -- Scrape Logs --> DLogs
  Alloy -- Remote Write --> Prom
  Alloy -- Loki Push --> Loki
  Alloy -- OTLP --> Tempo
  Prom & Loki & Tempo -- Query --> Grafana
  Prom -- Alerting Rules --> AManager --> Slack

  %% --- New Telemetry Links (Diagram Stack -> Observability Stack) ---
  Frontend2 -. Frontend Logs/Traces .-> Alloy
  OTLPDep & OTLPDep2 -. OTLP Metrics & Spans .-> Alloy
  PostgresExporter -- Scrapes Metrics --> Postgres
  PostgresExporter -. Metrics :9187 .-> Alloy

  %% Class Styling Assignments
  WAF:::edgeLayer
  CFTunnel:::edgeLayer
  Users:::edgeLayer
  Slack:::edgeLayer
  Git:::gha
  ALint:::gha
  Molecule:::gha
  CiCheck:::gha
  Trivy:::gha
  GHCR:::gha
  Ollama:::vmLayer
  SSH1:::vmLayer
  Terraform:::vmLayer
  Ansible:::vmLayer
  SSH2:::vmLayer
  F2B:::netLayer
  NoIP:::netLayer
  Port22:::netLayer
  UFW:::netLayer
  AKeys:::netLayer
  APerms:::netLayer
  Access:::netLayer
  DLogs:::container
  Frontend:::container
  Backend:::container
  Alloy:::container
  Prom:::container
  Loki:::container
  Tempo:::container
  Grafana:::container
  AManager:::container
  DONginx:::container
  DOCfD:::container
  Droplet1:::physical
  
  %% Applied Styles to Diagram Stack
  Frontend2:::container
  Nodejs2:::container
  OTLPDep:::container
  OTLPDep2:::container
  Postgres:::container
  PostgresExporter:::container

  %% Class Definitions
  classDef edgeLayer fill:#b30000,stroke:#ff4d4d,stroke-width:2px,color:#ffffff
  classDef netLayer fill:#0059b3,stroke:#3399ff,stroke-width:2px,color:#ffffff
  classDef physical fill:#333333,stroke:#666666,stroke-width:2px,color:#ffffff
  classDef container fill:#008080,stroke:#00cbcb,stroke-width:2px,color:#ffffff
  classDef vmLayer fill:#6a0db2,stroke:#b366ff,stroke-width:2px,color:#ffffff
  classDef storage fill:#b37400,stroke:#ffbf4d,stroke-width:2px,color:#ffffff
  classDef gha fill:#3d802e,stroke:#b2ffa1,stroke-width:2px,color:#ffffff
`;

export default function InfrastructureDiagram() {
  return (
    <motion.div
      id="infrastructure-diagram"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      className="py-24"
    >
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
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
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.5 }}
        >
          <InteractiveMermaid chart={infrastructureChart} />
        </motion.div>
      </div>
    </motion.div>
  );
}
