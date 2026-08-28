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
        Infisical["Infisical Secret Platform"]
  end

 subgraph GitHub_Platform["🐙 GitHub Platform Ecosystem"]
        subgraph Repositories["Source Repositories (npm Monorepo Workspace)"]
            Git["Infra & Code Repo"]
            App_Monorepo["App Monorepo (Portfolio & Diagram Packages)"]
            GitOps_Repo["GitOps Repo (Manifests)"]
        end

        subgraph CI_Pipeline["GitHub Actions: CI Workflow"]
            CiCheck["Linter / Analysis / Audit"]
        end

        subgraph CD_Pipeline["GitHub Actions: CD Workflow"]
            subgraph Matrix_Jobs["Build & Test Matrix"]
                Build_Local["1. Build Local Image"]
                Trivy["2. Trivy Security Scan"]
                Smoke_Run["3. Run Smoke Container"]
                Push_Multi["4. Push Multi-Arch Image"]

                Build_Local --> Trivy --> Smoke_Run --> Push_Multi
            end

            subgraph Kustomize_Job["Update GitOps Manifests"]
                Clone_GitOps["Clone GitOps Repo"]
                Kustomize_Edit["Kustomize Set Image Tags"]
                Git_Push["Commit & Push to Main"]

                Clone_GitOps --> Kustomize_Edit --> Git_Push
            end

            Trigger -- if CI Success --> Matrix_Jobs
            Matrix_Jobs -- needs --> Kustomize_Job
        end

        GHCR["GitHub Container Registry (GHCR)"]

        Git --> CiCheck
        CI_Pipeline -. Triggers .-> Trigger
        Push_Multi -- Pulls / Pushes --> GHCR
        Git_Push -- Updates --> GitOps_Repo

        App_Monorepo -. Dependabot .-> App_Monorepo
        App_Monorepo --> GitOps_Repo
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

 subgraph Tailscale["Tailscale Mesh Network"]
        MainDevices
        Pi5
  end

 subgraph Pi5["⚙️ Node - Raspberry Pi 5"]
        subgraph SSHD1["SSHD Hardening"]
            Access["SSH Completed"]
            APerms["No Root Login"]
            AKeys["No Key, No Entry"]
            UFW["Only allow Tailscale Devices"]
            Port22["Only on Port 22"]
            NoIP["No Local IP SSH"]
            F2B["Fail2ban"]
        end

        subgraph Docker["🐳 Docker Containers (Isolated Dev/Test Only. Not running everyday for RAM and I/O Limits)"]
            subgraph ObservabilityStack["Compose - Observability Stack (LGTM + Alloy - Dev/Testing)"]
                Alloy["Grafana Alloy :12345"]
                Prom["Prometheus :9090"]
                Loki["Loki :3100"]
                Tempo["Tempo :3200"]
                Grafana["Grafana Visualization :3030"]
                AManager["AlertManager :9093"]
                DLogs["Docker Logs"]
            end
        end

        subgraph K3s_Cluster["☸️ Local k3s Cluster (Single-Node)"]
            ArgoCD["Helm: ArgoCD Operator"]
            Ingress["Helm: Traefik / Ingress-NGINX"]
            TunnelPod["Cloudflared Tunnel Pod"]

            subgraph Workloads["Namespaces & Pods"]
                subgraph Portfolio_App["Portfolio Stack"]
                    Portfolio_Frontend_Pod["Portfolio Frontend"]
                end

                subgraph Diagram_App["Migrated Diagram Stack"]
                    Frontend2["React/Vite Frontend (Diagram)"]
                    Backend2["Node JS Backend"]
                    Postgres_Pod[("PostgreSQL Pod")]
                end
            end
        end
  end

    Users --> CloudflareEdge
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

    Terraform -- Provisions k3s Resources & Helm Releases --> K3s_Cluster

    GitOps_Repo --> ArgoCD
    ArgoCD --> Workloads
    Workloads -. Self-Heal Control Loop .-> ArgoCD
    Workloads -. Pulls Validated Images .-> GHCR

    CloudflareEdge -- Secure Tunnel --> TunnelPod
    TunnelPod --> Ingress
    Ingress --> Portfolio_Frontend_Pod & Portfolio_Backend_Pod & Frontend2 & Backend2
    Backend2 --> Postgres_Pod

    AManager -- Webhook Alerts --> Slack

    Infisical -. Pulls Configuration Secrets .-> Terraform
    Infisical -. Lookup Static Configuration Secrets .-> Ansible
    Terraform -- Creates Secret Resource (via Variables) --> K3s_Cluster
    `;

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
