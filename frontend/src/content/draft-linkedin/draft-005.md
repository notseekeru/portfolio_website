I threw out my working AWS stack.

I had that in August with a proper 3-tier stack, an ALB in front of an ASG with EC2, RDS, S3 + CloudFront, and it worked on Terraform.

The problem wasn't that it wasn't working, but that I wasn't proud of it.

Most of it came out of AI prose and I hated that feeling when you feel like you didn't design something and you just copied it.

Now don't get me wrong, that architecture was quite usable, but I never really felt ownership of it.

So I threw it out and designed another version myself, because the previous one used an EC2 auto-scaling architecture that stayed 24/7.

So I just told myself, "Hey, why not serverless with an event-driven architecture?"

And so I did it, copied pieces of the pattern and adapted it to my own design for my specific needs, and implemented until it was complete.

So in the stack:
• EC2 running the network stack
• Lambda workers to handle work
• RDS for database work
• ECR images for the Lambdas
• Event-Driven SQS, SNS and DLQ
• CloudWatch alarms on Lambda errors
• AWS Budgets with a zero-spend and a credit cap alerting
• The stack in Terraform

The work itself is event-driven.

The cost is why the shape looks like this.

An ALB in Singapore is $18.40 a month before a single request arrives.

The NAT gateway is $43.07 and it does one job, and the instance that does three of them is $7.74.

There is a tradeoff with this architecture, of course. The edge lives in one zone.

So an AZ event or one bad reboot takes ingress and egress down together.

But I would rather pay once during an incident than every month for nothing ever getting used.

Besides, if I wanted I could just flip a few buttons, turn on multi-AZ and failover, and write "Architected multi-AZ failover" on my resume like that is a thing I manage.

Kidding aside I'm very happy with how this turned out because I made tradeoffs and didn't blindly follow what the majority did, and I suited it for my scale.
