I thought my GitOps pipeline was automated. It wasn't.

I spent three days scratching my head, wondering why my cluster wouldn't pull my latest image updates. I was using :latest tags, and my ArgoCD sync was doing… absolutely nothing.

It turns out, the "reconciliation loop" doesn't care about the image tag if the manifest itself hasn't changed. I was confusing "image update" with "infrastructure drift."

Most people will tell you "don't use :latest tags" because it's good practice. I learned it because I got burned by it.

The Fix: I ditched :latest for SHA-based tagging via GitHub Actions.
CI builds the image + tags with the Git SHA.

The pipeline patches the Kustomize manifest with that specific SHA.

ArgoCD sees the manifest change and triggers the pull.

The takeaway for other students: Stop chasing the "cleanest" architecture and start chasing the "most observable" one. If you can't tell exactly which commit is live in your cluster right now just by looking at a manifest, your pipeline is too opaque.

I’m currently mapping this out in my homelab, it’s messy, but at least I know what’s actually running.

The diagram of the pipeline is presented below.
