import InteractiveMermaid from "../utils/InteractiveMermaid";
import { useInView } from "../hooks/useInView";

const infrastructureChart = `---
config:
  layout: elk
---
flowchart TB
 subgraph Internet["Public Internet & Edge"]
        Users["End Users"]
        Slack["Slack Channel"]
        CloudflareEdge["Cloudflare Edge (DNS + SSL)"]
  end
 subgraph Repositories["Source Repositories"]
        Git["Infra & Code Repo"]
        Portfolio_Repo["Portfolio Site Repo (SHA Tags)"]
        Diagram_Repo["Diagram App Repo (SHA Tags)"]
        GitOps_Repo["GitOps Repo (Manifests)"]
  end
 subgraph CI_Pipeline["GitHub Actions: CI Workflow"]
        ALint["Ansible Lint"]
        Molecule["Molecule Testing"]
        CiCheck["Linter/Formatter/Portfolio Analysis/Audit"]
  end
 subgraph Matrix_Jobs["Build & Test Matrix (Frontend / Backend)"]
        Build_Local["1. Build Local Image"]
        Trivy["2. Trivy Security Scan"]
        Smoke_Run["3. Run Smoke Container"]
        Health_Check["4. Wait & Smoke Test"]
        Push_Multi["5. Push Multi-Arch Image (amd64/arm64)"]
        Cleanup["6. Post-Job Cleanup"]
  end
 subgraph Kustomize_Job["Update GitOps Manifests"]
        Clone_GitOps["Clone GitOps Repo"]
        Kustomize_Edit["Kustomize Set Image Tags"]
        Git_Push["Commit & Push to Main"]
  end
 subgraph CD_Pipeline["GitHub Actions: CD Workflow"]
    direction TB
        Trigger{"workflow_run: CI Completed"}
        Matrix_Jobs
        Kustomize_Job
  end
 subgraph GitHub_Platform["🐙 GitHub Platform Ecosystem"]
        Repositories
        CI_Pipeline
        CD_Pipeline
        GHCR["GitHub Container Registry (GHCR)"]
  end
 subgraph Automation["Automation Control Plane"]
        Makefile["make apply"]
        Ansible["Master Ansible"]
        Terraform["Master Terraform"]
        Kubectl["Kubernetes Control Plane (kubectl)"]
        Kubeconfig["kubeconfig"]
        DynamicInven["Dynamic Inventory"]
  end
 subgraph MainDevices["Management and Orchestration Nodes"]
        MainPC["MainPC"]
        MainLaptop["MainLaptop"]
        Automation
        SSH1["SSH Keys (PC)"]
        SSH2["SSH Keys (Laptop)"]
  end
 subgraph SSHD1["SSHD Hardening"]
        Access["SSH Completed"]
        APerms["No Root Login"]
        AKeys["No Key, No Entry"]
        UFW["Only allow Tailscale Devices"]
        Port22["Only on Port 22"]
        NoIP["No Local IP SSH"]
        F2B["Fail2ban"]
  end
 subgraph ObservabilityStack["Compose - Observability Stack (LGTM + Alloy)"]
        Alloy["Grafana Alloy :12345"]
        Prom["Prometheus :9090"]
        Loki["Loki :3100"]
        Tempo["Tempo :3200"]
        Grafana["Grafana Visualization :3030"]
        AManager["AlertManager :9093"]
        DLogs["Docker Logs"]
  end
 subgraph Docker["Docker Containers (Observability Experiments)"]
        ObservabilityStack
  end
 subgraph Pi5["Node - Raspberry Pi 5"]
        SSHD1
        Docker
  end
 subgraph Tailscale["Tailscale Mesh Network"]
        MainDevices
        Pi5
  end
 subgraph Portfolio_App["Portfolio Stack"]
        Portfolio_Frontend_Pod["Portfolio Frontend"]
        Portfolio_Backend_Pod["Portfolio Backend"]
  end
 subgraph Diagram_App["Migrated Diagram Stack"]
        Frontend2["React/Vite Frontend (Diagram)"]
        Backend2["Node JS Backend"]
  end
 subgraph Workloads["Namespaces and Pods"]
        Portfolio_App
        Diagram_App
  end
 subgraph DOKS["DOKS (3-Node Kubernetes Cluster)"]
        DO_API["DigitalOcean API"]
        ArgoCD["Helm: ArgoCD Operator"]
        Ingress["Helm: Ingress-NGINX Controller"]
        TunnelPod["Cloudflared Tunnel Pod"]
        DO_DB[("Managed PostgreSQL")]
        Workloads
  end
    Users --> CloudflareEdge
    Portfolio_Repo -. Dependabot .-> Portfolio_Repo
    Diagram_Repo -. Dependabot .-> Diagram_Repo
    Portfolio_Repo --> GitOps_Repo
    Diagram_Repo --> GitOps_Repo
    Git --> ALint & CiCheck
    ALint --> Molecule
    Build_Local --> Trivy
    Trivy --> Smoke_Run
    Smoke_Run --> Health_Check
    Health_Check --> Push_Multi
    Push_Multi --> Cleanup
    Clone_GitOps --> Kustomize_Edit
    Kustomize_Edit --> Git_Push
    Trigger -- if CI Success --> Matrix_Jobs
    Matrix_Jobs -- needs --> Kustomize_Job
    CI_Pipeline -. Triggers .-> Trigger
    Push_Multi -- Pulls / Pushes --> GHCR
    Git_Push -- Updates --> GitOps_Repo
    Makefile --> Terraform & Ansible
    Kubectl --> Kubeconfig
    Terraform --> Kubeconfig & DynamicInven
    Ansible --> DynamicInven
    MainPC --> SSH1
    MainLaptop --> SSH2
    F2B --> NoIP
    NoIP --> Port22
    Port22 --> UFW
    UFW --> AKeys
    AKeys --> APerms
    APerms --> Access
    Alloy --> DLogs & Prom & Loki & Tempo
    Prom --> Grafana & AManager
    Loki --> Grafana
    Tempo --> Grafana
    SSH1 --> SSHD1
    SSH2 --> SSHD1
    Terraform -- Provisions Cluster and DB --> DO_API
    DO_API --> ArgoCD & Ingress & DO_DB
    GitOps_Repo --> ArgoCD
    ArgoCD --> Workloads
    Workloads -. "Self-Heal Control Loop" .-> ArgoCD
    Workloads -. Pulls Validated Images .-> GHCR
    CloudflareEdge -- Secure Tunnel --> TunnelPod
    TunnelPod --> Ingress
    Ingress --> Portfolio_Frontend_Pod & Portfolio_Backend_Pod & Frontend2 & Backend2
    AManager -- Webhook Alerts --> Slack
    `;

export default function InfrastructureDiagram() {
    const { ref: sectionRef, inView: sectionInView } = useInView();
    const { ref: headerRef, inView: headerInView } = useInView();
    const { ref: chartRef, inView: chartInView } = useInView();

    return (
        <div id="infrastructure-diagram" ref={sectionRef} className={`py-24 transition-opacity duration-300 ${sectionInView ? "opacity-100" : "opacity-0"}`}>
            <div className="max-w-6xl mx-auto px-6">
                <div ref={headerRef} className={`mb-16 transition-all duration-500 ${headerInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}>
                    <span className="font-mono text-xs text-accent tracking-[0.3em] uppercase">Architecture</span>
                    <h1 className="text-4xl lg:text-5xl font-bold text-zinc-100 mt-2 mb-4">Full Infrastructure Diagram</h1>
                    <p className="text-zinc-500 max-w-lg">End-to-end homelab infrastructure breakdown — from Cloudflare edge to Raspberry Pi 5, Managed Cloud Kubernetes Clusters and monitoring stack.</p>
                </div>

                <div ref={chartRef} className={`transition-all duration-500 ${chartInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`} style={{ transitionDelay: "0.15s" }}>
                    <InteractiveMermaid chart={infrastructureChart} />
                </div>
            </div>
        </div>
    );
}
