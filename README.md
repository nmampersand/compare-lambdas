# Compare Lambdas

This is a simple utility to compare lambdas within an account side by side.
Currently, this contains one comparison - analyzing the percentage at which lambdas experience cold starts over a given time frame.
With a side by side comparison, the goal is to aid in analyzing the impacts that traffic patterns, configuration,
and size can have on lambda cold starts and by consequence, a user. This can help to identify which lambdas might
be a good candidate for Provisioned Concurrency and identify potential bottlenecks within your infrastructure.

Future plans:
- profiling the costs incurred by lambda cold starts
- analysis of the business impact of these cold starts
- further analysis, comparing the business impact of cold starts to the cost of keeping a lambda warm,
and potentially comparing this to the cost of conversion to an EC2
- using this data to provide recommendations on which lambdas should be kept warm, and which are okay to let cool 

## Getting started
[Build applications on New Relic One](https://docs.newrelic.com/docs/new-relic-one/use-new-relic-one/build-new-relic-one)

- Login to or create an account on New Relic.
- Navigate to Apps -> Build your own app.
- Follow the quickstart instructions to get setup (note: you do not have to do steps 5 or 6).
- Follow the [guide](https://docs.newrelic.com/docs/serverless-function-monitoring/aws-lambda-monitoring/get-started/enable-new-relic-monitoring-aws-lambda)
  to setup monitoring for lambdas within your AWS account.
- Navigate to the project directory and run the following scripts:

```
npm install
npm start
```

Visit https://one.newrelic.com/?nerdpacks=local and :sparkles:

## Testing
Coming soon!

## Creating new artifacts

If you want to create new artifacts run the following command:

```
nr1 create
```

> Example: `nr1 create --type nerdlet --name my-nerdlet`.

## Contributions
Built with help from the [guide](https://developer.newrelic.com/build-apps/add-nerdgraphquery-guide).
