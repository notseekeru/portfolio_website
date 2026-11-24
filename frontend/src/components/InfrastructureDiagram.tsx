import * as m from "motion/react-m";
import { fade, maskRise, slideIn, stagger, revealViewport } from "../utils/reveal";

const SOURCE = "/infra-stack.png?v=6";

const ALT =
    "Infrastructure map. Homelab: a Cloudflare tunnel reaches cloudflared and ingress-nginx on a Raspberry Pi 5 running k3s, where ArgoCD syncs the portfolio and maxterview pods. Maxterview uses Neon, Clerk and NVIDIA NIM, and Grafana Alloy ships logs to Grafana Cloud, which alerts Slack. AWS: a second Cloudflare tunnel reaches one EC2 edge box serving the S3 build and proxying /api to a Lambda API, which writes to private RDS and queues work on SQS for a worker Lambda; the queue dead-letters after three failures, CloudWatch and Budgets alert SNS, and GitHub Actions deploys through an OIDC role to ECR and S3.";

export default function InfrastructureDiagram() {
    return (
        <div className="max-w-shell mx-auto px-6 sm:px-8 lg:px-12">
            <m.div variants={stagger(0.07)} initial="hidden" whileInView="show" viewport={revealViewport} className="mb-12">
                <m.span variants={slideIn} className="font-mono text-xs tracking-widest text-accent">
                    ARCHITECTURE
                </m.span>
                <m.h1 variants={maskRise} className="font-display text-4xl lg:text-6xl text-bone mt-3 mb-5">
                    Infrastructure
                </m.h1>
                <m.p variants={fade} className="text-muted max-w-lg">
                    One map: the Pi 5 homelab on k3s and the sesume stack on AWS.
                </m.p>
            </m.div>

            <m.div variants={fade} initial="hidden" whileInView="show" viewport={revealViewport}>
                <figure>
                    <a href={SOURCE} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-lg border border-border">
                        <img src={SOURCE} alt={ALT} width={1600} height={1300} className="block w-full h-auto" />
                    </a>
                    <figcaption className="mt-4 flex justify-end">
                        <a href={SOURCE} target="_blank" rel="noreferrer" className="font-mono text-xs text-muted hover:text-bone transition-colors">
                            Open full size
                        </a>
                    </figcaption>
                </figure>
            </m.div>
        </div>
    );
}
