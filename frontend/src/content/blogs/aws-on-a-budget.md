---
title: AWS on a Budget
date: 2026-09-05
description: I built a free-tier, 3-tier AWS stack entirely in Terraform because that is where the market is. The hard part was never provisioning. It was that the .tf was AI-written and I had to hand-audit every block, and that my state lived on R2 whose credentials collided with the real AWS keys on one shared env var.
github: https://github.com/notseekeru/terraform
---

# Summary

I built AWS properly, for the first time, and I did it on free-tier money. A real 3-tier fault-tolerant stack under Terraform, because rolling your own ALB + ASG + RDS + CloudFront is where the industry actually lives, and I wanted to prove I could make it hold. The .tf was largely AI-generated and then hand-hardened block by block before any of it touched state; that audit, not the generation, was where I learned the architecture. Two things fought me the whole way. First, billing reality: every enterprise best practice carried a dollar sign, and the ones that survived had to earn their headroom. Second, a genuinely confusing credential collision that bit during plain `init`, before a single resource had ever deployed: my Terraform state lives in a Cloudflare R2 bucket, R2 is S3-compatible, and S3 compatibility means it reads the same `AWS_ACCESS_KEY_ID` that the real AWS provider does. Two accounts tripped over one variable name and for a while I could not see how one env var broke both sides. This is the collision, the namespace fix, and the cost rails that let me destroy and rebuild the stack while spending almost nothing.

---
## Build First, Exam Label Later

Let me be direct about the framing. This was never an exam study project. The `SAA-C03` label on my own `AWS.md` came after, pinned on retroactively as a resume angle, because the architecture I built maps cleanly onto that exam. The spark was build-first: a real 3-tier architecture on AWS because that is where the market is. Framing it as studying for a certification would be a comfortable lie, and it would also be the wrong lesson. The lesson was that I could hand Terraform to an AI, generate most of a multi-service stack, and then sit down and audit every resource closely enough to catch what the model got subtly wrong.

Different money, separate story. This is not the $200 DigitalOcean credit arc from [Cloud Automation Veins](https://portfolio.seekeru.tech/blog/cloud-automation-veins). That was k3s and GitOps on borrowed cloud credits with a hard expiry. AWS had its own roughly $200 in promotional credit and its own free-tier guardrails, and its own lesson: NAT Gateway at ~$33 a month made private subnets a luxury, so app instances live in public subnets and pull packages over the internet gateway, then `make destroy` when I stop working so the month's bill stays at zero. Separate stack, separate money, same stubbornness about not paying for things I can reason my way out of.

The through-line is the thing I keep circling back to in every project here: I do not trust output I do not understand. When the AI wrote my Terraform, I refused to apply it unexamined. When traffic flowed, I refused to leave it unfenced. When the collision hit, I could not move past it until I had named the exact variable that broke both sides.

## The Cost Rails First

Before a single resource existed I wired the alarms that make an always-destroyable build financially survivable. Both publish to one `billing-alerts` SNS topic, which means one email confirmation click at the start, then nothing else to babysit:

**Zero-spend budget.** An `aws_budgets_budget` pinned at `$1.00` USD. This is the tripwire for pure carelessness, not for legitimate progress. Free-tier-compliant resources are supposed to cost nothing, so any sign of a real bill means I fat-fingered an instance class or left something running overnight and it needs to page me loudly.

**Credit-cap budget.** A second budget near `var.credit_cap_usd` (default `190.0`) that fires at **95% actual spend** and **90% forecasted spend**. That 90% forecast alarm is the honest one. 95% actual means the money is basically gone; 90% forecast gives me runway to shut it down. Both budgets guard the same ~$200 promotional balance from different directions: one catches the mistake, the other catches the slow leak.

```hcl
# monitoring.tf (abridged)
resource "aws_budgets_budget" "credit_cap" {
  # Guards the ~$200 free-tier credit balance: alerts before the
  # promotional credits are exhausted, distinct from the zero-spend guardrail.
  name              = "credit-cap-budget"
  budget_type       = "COST"
  limit_amount      = tostring(var.credit_cap_usd)
  limit_unit        = "USD"
  time_period_start = "2024-01-01_00:00"
  time_unit         = "MONTHLY"

  notification {
    # Actual spend hits the credit cap
    comparison_operator       = "GREATER_THAN"
    threshold                 = 95
    threshold_type            = "PERCENTAGE"
    notification_type         = "ACTUAL"
    subscriber_sns_topic_arns = [aws_sns_topic.billing_alerts.arn]
  }

  notification {
    # Projected spend about to exceed the credit cap
    comparison_operator       = "GREATER_THAN"
    threshold                 = 90
    threshold_type            = "PERCENTAGE"
    notification_type         = "FORECASTED"
    subscriber_sns_topic_arns = [aws_sns_topic.billing_alerts.arn]
  }
}
```

The rails end with `make destroy`, a first-class Makefile target, and aws-nuke with an accounts allowlist so teardown is account-scoped and cannot wander. Same rhythm as the earlier lab: `make init`, `make plan` against R2 state, `make apply`, and a clean `make destroy` when I am done for the day so the monthly bill reads zero.

**CloudWatch CPU alarm on the ASG.** I keep a `GreaterThanThreshold` alarm on `CPUUtilization` (average over 300s, two evaluation periods, threshold 80) that pages the same `billing_alerts` topic. Because a three-tier dance whose ALB target-group health check never matches a real route will churn instances instead of replacing one broken one, and churn burns compute hours without you noticing. `health_check_type = "ELB"` plus a health check on an actual route is what prevents the loop:

```hcl
# compute.tf (abridged)
resource "aws_autoscaling_group" "main" {
  vpc_zone_identifier = aws_subnet.public[*].id
  target_group_arns   = [aws_lb_target_group.main.arn]
  health_check_type   = "ELB"
  min_size            = 1
  max_size            = 3
}

resource "aws_autoscaling_policy" "cpu" {
  name                   = "cpu-target-tracking"
  policy_type            = "TargetTrackingScaling"
  autoscaling_group_name = aws_autoscaling_group.main.name

  target_tracking_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ASGAverageCPUUtilization"
    }
    target_value = 50.0
  }
}
```

Two budgets, one SNS topic, one alarm, one destroy target. That is the entire financial perimeter, and it is deliberately small because every extra alarm is future alert noise I will learn to ignore. **Mean Time To Notice** is handling the money, not tracking another dashboard.

## The Architecture I Could Afford to Build

Region `ap-southeast-1`, everything Terraform-native and inline HCL, no public VPC modules. AWS.md in the repo explains the deliberate choice: the standard `terraform-aws-modules/vpc` hides implicit NAT gateways and KMS keys that quietly show up on a bill, and explicit visibility matters more than typing convenience in an account that must stay free. I also refused public modules for a dumber reason than billing: you cannot audit what you do not understand, and in an AI-generated stack the audit is the entire point. A big share of this `.tf` was written by a model. I read every resource block back out of it, chased each gotcha below to ground, and picked apart what the confidence was subtly wrong about. Whatever skill this built was earned in that read-back, not in the generation.

```text
Internet User
   └─ CNAME via Cloudflare
   Application Load Balancer (public subnets)
      ├─ Security group: ingress 80 only
      └─ ASG → 2× t4g.micro (AL2023 arm64, SSM AMI param)
              └─ Security group: ingress 5432 only
                 RDS PostgreSQL dbadmin single-AZ (private)
```

Compute defaults to `t4g.micro`, the ARM Graviton instance, resolved through an SSM parameter rather than a hardcoded AMI id. That one lookup (`AL2023 arm64 via SSM param`) is the sort of thing that looks like trivia and actually determines whether the launch template resolves to a valid image on apply.

**RDS username `dbadmin`, not `admin`.** PostgreSQL reserves `admin` as a `MasterUsername`, so a default example that uses it fails at provision time. The fix is a non-reserved word, and it looks trivial right up until it stops a database from existing. A cheap lesson that never made sense on paper and only real in apply.

**RDS is single-AZ, but the subnet group spans two AZs.** The free-tier guardrail is single-AZ so the instance stays inside the 750 free monthly RDS hours. The subnet group spanning two availability zones is the pre-architected escape hatch. The moment I am willing to spend ~$80 a month and flip `multi_az = true`, there is already a standby subnet waiting. Cost discipline now, readiness later, no rework.

**S3 assets behind CloudFront with OAC.** Static files live in a private S3 bucket, served through a CloudFront distribution with Origin Access Control. The gotcha that nearly emptied a weekend: `aws_cloudfront_origin_access_control` only *signs* the request. The bucket still needs an `aws_s3_bucket_policy` granting `s3:GetObject` to the CloudFront principal scoped by `aws:SourceArn`, or every origin request returns 403 regardless of the OAC config. Policy-less OAC is a signed knock on a locked door.

**Database credentials sit in SSM under `/app/*`, not baked into the AMI.** The default `AmazonSSMManagedInstanceCore` policy only grants read under `parameter/aws/*`, so params under `/app/db_endpoint` and `/app/POSTGRES_PASSWORD` need an inline IAM role policy with `ssm:GetParameter` on `parameter/app/*`. Miss it and EC2 gets `AccessDenied` when it boots and reaches for the connection string, a failure that surfaces only at runtime. Because SSM params propagate a few seconds after an instance profile attaches, the user-data script has to retry or wait on cloud-init.

Honest current state, because I would rather say it flatly than let a reader think this is a finished production app. It is not. The app instance serves static nginx and is not yet wired to read those SSM params, so the RDS tier is provisioned and reachable but unused by the app. The S3 bucket sits unseeded, which means the CloudFront distribution still returns 403 until real assets are uploaded. The skeleton is real and verified once, but putting an actual application through it is the step that would prove it, and that step is still ahead of me.

39 resources, drift-free: `terraform plan` reporting `No changes. Infrastructure matches the configuration.`, earned through repeated `make destroy` and re-apply cycles.

## When Two Clouds Share a Name

This whole build very nearly never got off the ground, because it died in the most boring possible place: plain `make init`, before a single AWS resource had ever been provisioned. Terraform reported `InvalidAccessKeyId` on the AWS provider and a separate "value cannot be empty" on the R2 state backend, and for a long while I genuinely could not see how one thing was breaking both sides. The errors felt contradictory, so I chased them as separate bugs, one per boundary. Rotate credentials. Re-check Infisical. Second-guess whether the account was even usable. Every instinct pointed at authentication, and none of it helped, because the account and the keys were fine the whole time.

The mistake was assuming there is only one thing in the world that reads a variable named `AWS_ACCESS_KEY_ID`. This repo keeps its state in a Cloudflare R2 bucket via the S3-compatible backend, and secrets are injected by `infisical run --`. R2 is S3-compatible, and S3 compatibility means it speaks the same environment language as real AWS. When only the DigitalOcean provider lived here, that shared vocabulary never mattered, because DigitalOcean has no S3 SDK. The AWS provider ended the truce. My Infisical project held two credential pairs, and they had collided on one native name:

| Secret in Infisical | Held | Who consumes it |
| --- | --- | --- |
| `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` | **R2** keys | s3 backend **and** aws provider |
| `TF_VAR_AWS_ACCESS_KEY_ID` / `TF_VAR_AWS_SECRET_ACCESS_KEY` | real AWS | read by nothing |

So the real AWS keys were parked under `TF_VAR_*`, which only defines a Terraform input variable that nothing consumes. The prefixed name is a decoy, not a partition. Both the backend and the provider kept reading the *native* unprefixed variable, which held R2 keys, so the provider tried to authenticate against real AWS with Cloudflare credentials, surfacing AWS's telltale `InvalidAccessKeyId` on `init` and `plan`.

The fix is a strict partition, each credential under the name only its consumer reads:

| Secret | Now holds | Consumed by |
| --- | --- | --- |
| `AWS_ACCESS_KEY_ID` | real AWS key | aws provider |
| `AWS_SECRET_ACCESS_KEY` | real AWS secret | aws provider |
| `TF_VAR_R2_ACCESS_KEY_ID` | R2 key | s3 backend |
| `TF_VAR_R2_SECRET_ACCESS_KEY` | R2 secret | s3 backend |
| `TF_VAR_R2_ACCOUNT_ID` | R2 account id | endpoint building |
| `TF_VAR_R2_BUCKET` | `terraform-state` | s3 backend |
| `AWS_ENDPOINT_URL_S3` | `https://<acct>.r2.cloudflarestorage.com` | s3 endpoint |

But the rename alone was not enough, because `infisical run` is not a shell. `infisical run -- terraform ...` **execs** the command directly. That means a Makefile recipe that tries to inject a per-invocation override like `AWS_ACCESS_KEY_ID=$R2... terraform ...` fails first at exec:

```
exec: "AWS_ACCESS_KEY_ID=": executable file not found in $PATH
```

The program you meant to run is treated as the variable-assignment string. And a `-backend-config="bucket=$TF_VAR_R2_BUCKET"` handed to the exec'd binary is passed verbatim, so `$TF_VAR_R2_*` only expands if a shell actually runs. The Makefile solves it two ways: the backend keys ride in one variable written with make's escaped dollars, and every backend target execs terraform through `/bin/sh -c`:

```make
# R2 state-bucket creds are namespaced TF_VAR_R2_* so they never collide with the
# AWS provider's native AWS_ACCESS_KEY_ID.
backend_config = -backend-config="bucket=$$TF_VAR_R2_BUCKET" \
	-backend-config="key=terraform/$(MOD)/terraform.tfstate" \
	-backend-config="region=auto" \
	-backend-config="access_key=$$TF_VAR_R2_ACCESS_KEY_ID" \
	-backend-config="secret_key=$$TF_VAR_R2_SECRET_ACCESS_KEY"

init:
	infisical run --path $(SECRETS_PATH) --env $(ENV) -- /bin/sh -c \
		'terraform -chdir=infra/$(MOD) init $(backend_config)'

plan:
	infisical run --path $(SECRETS_PATH) --env $(ENV) -- \
		terraform -chdir=infra/$(MOD) plan
```

So the split is stateful by design: `init`, `upgradeinit`, `reconfigure`, and `migrate` all go through `/bin/sh -c` and load the `TF_VAR_R2_*` set, while `plan`, `apply`, `refresh`, and `destroy` stay un-wrapped and let the provider read the native `AWS_ACCESS_KEY_ID`, which now holds the real account. No R2 override leaks into a provisioning run, and no AWS credential pollutes the state walk.

Terraform 1.5 and later added a final wrinkle: the S3 backend's deprecated `endpoint` config key is rejected outright.

```
Error: Invalid Value
The value cannot be empty or all whitespace
```

The modern source is the `AWS_ENDPOINT_URL_S3` env var (backing the newer `endpoints.s3` block), which is where the R2 endpoint above is injected. Passing any bare `endpoint=` to `-backend-config` is dead code at best and the above error at worst.

The second-order collision was the more insidious echo. Because `AWS_ENDPOINT_URL_S3` is a native env var too, pinning it for the R2 backend silently rerouted the **real AWS provider's** `aws_s3_bucket` and `aws_s3_bucket_policy` calls at Cloudflare instead of at AWS:

```
InvalidArgument: access key has length 20, should be 32
```

That is R2 refusing an AWS `AKIA` key. The same endpoint env var makes R2 and the provider collide a second way unless I pin the provider's S3 endpoint back to real AWS in `provider.tf`:

```hcl
provider "aws" {
  region = "ap-southeast-1"
  endpoints {
    s3 = "https://s3.ap-southeast-1.amazonaws.com"
  }
}
```

One shared variable did two different things to two different clouds, and only naming each namespace explicitly and pinning the provider's S3 endpoint back to the region stopped both leaks.

## Afterplan

The collision taught a rule I keep restating in CI configs and runbooks: **provider and state backend are both S3-customers whenever state is S3-compatible, and any shared native env var is a single point of collision the moment a second S3-speaking service joins the repo.** The guardrails are now in the Makefile and enforced by target split, not by memory:

1. Never store R2 credentials under a bare `AWS_*` name. They belong under `TF_VAR_R2_*`.
2. Never put a `VAR=$other` prefix on an `infisical run --` command; it execs, not shells. Wrap in `/bin/sh -c` when expansion is required.
3. Use `AWS_ENDPOINT_URL_S3` for the backend endpoint, never the deprecated `endpoint` key. And if R2 shares the repo with a real AWS provider, pin that provider's S3 endpoint to its region so buckets land in AWS.

The HTTPS piece is a short manual dance worth one line: the ACM certificate is DNS-validated through a CNAME I add by hand in Cloudflare, since my DNS lives outside Route 53. `aws_acm_certificate_validation` plus a listener `depends_on` make the `:443` listener wait for `ISSUED`. When I had it up and verified, the behavior held:

| Endpoint | Verified behavior |
| --- | --- |
| `https://alb.seekeru.tech` | 200 (nginx) |
| `http://alb.seekeru.tech` | 301 redirect to HTTPS |
| `https://d14f3y8b1rk8te.cloudfront.net` | authenticates via OAC; returns 403 until the S3 bucket is seeded |
| RDS `main-db` (user `dbadmin`) | private, not publicly reachable |

I verified these endpoints once while the stack was up, and `destroy` has run since. The point of the destroy is that I only pay while I am actually working, so the endpoints are not guaranteed to resolve right now, and I am at peace with that.

Budget discipline is what made that reversibility safe. `make destroy MOD=aws` plus aws-nuke on the allowlist tears the stack down, aws-nuke sweeps whatever Terraform missed, and the two budgets confirm spend landed near zero. I rebuilt this stack from state more times than I can count during the build-out, and every rebuild came out identical, which is the only reason `terraform plan` can report `No changes` with confidence instead of guessing.

---

# Conclusion

The build mattering over any exam label was the honest part, and the collision is what made me feel how much it mattered. Naming the exact variable that broke two accounts beat keeping the architecture abstract. R2 as state storage saved me the cost of an S3 bucket and then taught me the cost of a shared name: whenever state is S3-compatible, the provider and the backend are both S3 customers, and one native env var becomes a single point of collision the moment a second cloud joins the repo. That is a namespace rule, and it is durable in a way that any one stuck command is not.

The audit is the real skill this project built. I can hand an AI a multi-service Terraform spec, but what actually lives in my head is the read-back, the gotchas I chased to ground, and the moment I trusted an error string less than my own reasoning. That, plus cost rails that let me destroy and re-apply a stack until it holds, is the AWS I came out with. The stack sleeps at zero spend under two alarms and a destroy target, because the point of building it was never to leave it running, it was to prove I could rebuild it from declared truth whenever I wanted to.
