const { Stack, RemovalPolicy } = require("aws-cdk-lib");
const lambda = require("aws-cdk-lib/aws-lambda");
const { execSync } = require("node:child_process");
const fs = require("fs");
const archiver = require("archiver");

class CdkStack extends Stack {
  /**
   *
   * @param {Construct} scope
   * @param {string} id
   * @param {StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    // create a Lambda Layer using the new zip file
    const layer = new lambda.LayerVersion(this, "LaunchDarklyLayer", {
      code: lambda.Code.fromAsset("resources/layers/layer.zip"),
      description: "Common helper utility",
      compatibleRuntimes: [
        lambda.Runtime.NODEJS_16_X,
        lambda.Runtime.NODEJS_18_X,
      ],
      removalPolicy: RemovalPolicy.DESTROY,
    });
  }
}

module.exports = { CdkStack };
