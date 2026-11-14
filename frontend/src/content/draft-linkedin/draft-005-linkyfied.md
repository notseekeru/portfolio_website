In August I deleted a stack that cost $61.47 a month.

There is a specific kind of peace in knowing every piece of your own infrastructure.

Not the peace of a clean plan.

In August I had a proper 3-tier stack.

It was clean every single time I destroyed and re-applied it.

The problem was that I wasn't proud of it, because most of it came out of AI prose.

Now don't get me wrong, it was usable, but I never really felt ownership of it.

So I threw it out and designed another version myself.

The previous one used an EC2 auto-scaling architecture so it stays 24/7, and I told myself, hey why not serverless with an event driven architecture.

So in the stack:

- S3 static build, synced to the box and served from there, no CDN
- SSM Parameter Store with the nine SecureString parameters, read at cold start
- ECR images for the Lambdas, pulled at cold start
- Migrate Lambda, so schema changes happen on terraform apply
- EventBridge schedule firing the probe every five minutes
- Uptime probe outside the VPC, because the edge is the thing it is supposed to notice
- CloudWatch alarms on Lambda errors, DLQ depth and the edge status check, with SNS sending the email
- AWS Budgets with a zero-spend and a credit cap, alerting into that same SNS topic
- The whole stack in Terraform, so recovery is a re-apply

The work itself is event driven.

The request finishes before the work does.

The queue handles its own retries, the dead letter queue is where the failed work sits so I can look at it later, and a schedule is one line of Terraform.

The cost is why the shape looks like this.

An ALB in Singapore is $18.40 a month before a single request arrives, the NAT gateway is $43.07 and it does one job, and the instance that does three of them is $7.74.

And there is a tradeoff, ofcourse.

The edge lives in one availability zone, the database is multi_az = false, and both private subnets share the route table pointed at that box.

One bad reboot takes ingress and egress down together.

Nothing fails over, because nothing can.

A Lambda only runs when something calls it, so it cannot hold a tunnel open, cannot listen on a port, cannot be the next hop in a route table, and the way into this stack needs a process that stays alive.

Rebuild is my failover.

I would rather pay once during an incident than every month for standby I never touch.

And beside, if I wanted I could just flip some few buttons, turn on multi AZ and failover, and write "Architected multi-AZ failover" on my resume like that is a thing I manage.

But kidding aside I'm very happy on how this turned out.

Image (whole stack): https://portfolio.seekeru.tech/aws-serverless-flow.png
Image (cost comparison): https://portfolio.seekeru.tech/aws-cost-comparison.png
Image (August 3-tier): https://portfolio.seekeru.tech/aws-three-tier-legacy.png
