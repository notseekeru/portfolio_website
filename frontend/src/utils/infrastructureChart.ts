// Diagram edit rules: additive only, never remove/rename/restructure existing nodes.
// Mirror the current format: same ID style, quoted labels, elk layout, ports on nodes.
// One node per real workload, no duplicate or placeholder nodes.
// Source of truth: ~/gitops and ~/terraform. Flag additions before editing.
export const infrastructureChart = `---
config:
  layout: elk
---
flowchart TB
 subgraph Internet["Public Internet & Edge"]
        Users["End Users"]
        Slack["Slack Channel"]
        CloudflareEdge["Cloudflare Edge (DNS + SSL)"]
        Infisical["Infisical Secret Platform"]
        NeonDB["Neon Postgres (maxterview)"]
        GrafanaCloud["Grafana Cloud (Loki + Alerts)"]
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
                subgraph Portfolio_App["Portfolio Stack (ns portfolio)"]
                    Portfolio_Frontend_Pod["Portfolio Frontend"]
                end

                subgraph Diagram_App["Migrated Diagram Stack (ns diagram)"]
                    Frontend2["React/Vite Frontend (Diagram)"]
                    Backend2["Node JS Backend"]
                    Postgres_Pod[("PostgreSQL Pod")]
                end

                subgraph Maxterview_App["Maxterview Stack (ns maxterview)"]
                    Frontend3["React/Vite Frontend (Maxterview)"]
                    Backend3["FastAPI Backend"]
                    Migration_Job["PreSync Migration Job"]
                    Alloy_Max["Grafana Alloy (maxterview)"]
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
    Ingress --> Portfolio_Frontend_Pod & Frontend2 & Backend2
    Ingress --> Frontend3 & Backend3
    Backend2 --> Postgres_Pod

    Backend3 --> NeonDB
    Migration_Job --> NeonDB
    Alloy_Max --> GrafanaCloud
    GrafanaCloud --> Slack

    AManager -- Webhook Alerts --> Slack

    Infisical -. Pulls Configuration Secrets .-> Terraform
    Infisical -. Lookup Static Configuration Secrets .-> Ansible
    Terraform -- Creates Secret Resource (via Variables) --> K3s_Cluster
    `;
