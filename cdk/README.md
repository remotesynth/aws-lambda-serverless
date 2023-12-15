# Using LaunchDarkly in AWS Lambdas

The goal of this project is to help you get started using LaunchDarkly feature flags within a serverless application using AWS Lambda. The project includes everything you'll need to get started integrating feature flags into your Lambdas using the Node.js runtime.

## The LaunchDarkly SDKs

Adding LaunchDarkly feature flags to any Lambda always begins with installing the appropriate SDK for the Lambda runtime you are using. You can find a [full list of server-side SDKs here](https://docs.launchdarkly.com/sdk). For the Node.js runtime, that would mean using NPM.

```bash
npm install launchdarkly-node-server-sdk
```

If you would like to use [DynamoDB as a persistent feature store](https://docs.launchdarkly.com/sdk/features/storing-data/dynamodb/?q=dynamo), you'll need to also install those dependencies.

```bash
npm install launchdarkly-node-server-sdk-dynamodb
```

This works well for a single Lambda, but if you are using feature flags across a number of Lambdas, the easiest method to maintain the depencies across all of them is using a Lambda Layer. The code provided here will assist you in creating the Layer.

### Creating/Updating the Lambda Layer

The necessary dependencies are already included in this project under `/cdk/resources/layers`. It contains both the Node.js SDK and the DynamoDB extension. In order to ensure that this asset has the latest versions of these SDKs, we've included a script that will download the latest versions and archive them into the proper folder. It is recommended that you run this before deploying any of the assets using the provided CDK scripts. All you need to do is:

```bash
cd  create-layer
npm run build
```

## Provided Lambdas

We've provided three example Lambdas to demonstrates the basics of deploying LaunchDarkly within AWS serverless.

1. **getFlagsStarter** – This example uses the LaunchDarkly Node.js server SDK to demonstrate how to initialize the SDK client, get a flag value and, as a base use case, establish separate code paths within your Lambda.
2. **getFlagsWithDynamo** – This example uses DynamoDB as a persistent feature store for LaunchDarkly feature flags enabling the SDK client to evaluate flag results based upon the data stored in DynamoDB. It is configured to enable daemon mode, which means that it will not call out to LaunchDarkly for these initial values, which can decrease initialization cost and reduce external requests. To disable daemon mode, remove the `useLdd` flag from the configuration.
3. **syncFlagsToDynamo** – This is a simple Lambda designed to force cache flag values into DynamoDB enabling the use of daemon mode. While this solution works, it requires the function to be called (manually or programmatically) to start the initialization. The ideal solution for this problem is to use LauchDarkly's [Relay Proxy](https://docs.launchdarkly.com/home/relay-proxy/?q=relay).

For a complete guide to using LaunchDarkly in AWS serverless, including how to set up the Relay Proxy within your AWS environment and how to ensure that all events are captured by the SDKs within an ephemeral Lambda, visit [this guide](https://launchdarkly.com/blog/using-launchdarkly-in-aws-serverless/).

## Deploying via the AWS CDK

You'll need to install the CDK. For more details about the AWS CDK and options for installing it, please visit the [AWS docs](https://aws.amazon.com/cdk/). Once the CDK is installed, follow these commands to bootstrap the deployment and then deploy it to your configured AWS account.

```bash
cd cdk
cdk bootstrap
cdk deploy
```

This will deploy all of the assets discussed above including the Lambda Layer with the LaunchDarkly SDKs and the three example Lambdas, with the Layer as a dependency.