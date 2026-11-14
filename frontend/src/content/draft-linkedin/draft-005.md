I threw out my working AWS stack.

I had that in August with a proper 3-tier stack, an ALB in front of an ASG with EC2, RDS, S3 + CloudFront, and it worked on Terraform.

The problem wasn't that it wasn't working, but that I wasn't proud of it.

Most of it came out of AI prose and I hated that feeling when you feel like you didn't design something and you just copied it.

Now don't get me wrong, the architecture was quite understandable and actually quite usable, but I never really felt ownership of it.

So I threw it out and designed another version myself, because the previous one used an EC2 auto-scaling architecture so it stays 24/7, and I just told myself, hey why not serverless with an event driven architecture.

And so I did it, copied pieces of the pattern and adapted it to my own design for my specific needs, and implemented until it was complete.

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

The work itself is event driven. The request finishes before the work does. The queue handles its own retries, the dead letter queue is where the failed work sits so I can look at it later, and a schedule is one line of Terraform.

The cost is why the shape looks like this. An ALB in Singapore is $18.40 a month before a single request arrives, the NAT gateway is $43.07 and it does one job, and the instance that does three of them is $7.74. So the comparison stopped being close.

And there is a tradeoff, ofcourse. The edge lives in one availability zone, the database is multi_az = false, and both private subnets share the route table pointed at that same box.

So an AZ event or one bad reboot takes ingress and egress down together.

But I would rather pay once during an incident than every month for nothing ever getting used.

And beside, if I wanted I could just flip some few buttons, turn on multi AZ and failover, and write "Architected multi-AZ failover" on my resume like that is a thing I manage.

Kidding aside I'm very happy on how this turned out because I made tradeoffs and didn't blindly follow what the majority did, and I suited it for what I wanted for my scale.

Image (whole stack): https://portfolio.seekeru.tech/aws-serverless-flow.png
Image (cost comparison): https://portfolio.seekeru.tech/aws-cost-comparison.png
Image (August 3-tier): https://portfolio.seekeru.tech/aws-three-tier-legacy.png
