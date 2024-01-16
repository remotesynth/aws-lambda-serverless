// The LaunchDarkly Node SDKs
// These needs to be npm installed or added via the Lambda Layer
const LaunchDarkly = require("launchdarkly-node-server-sdk");
// The SDK add-on for DynamoDB support
const {
  DynamoDBFeatureStore,
} = require("launchdarkly-node-server-sdk-dynamodb");

exports.handler = async (event) => {
  // this establishes the settings for caching in Dynamo
  // for details, check the documentation at https://docs.launchdarkly.com/sdk/features/storing-data/dynamodb
  const store = DynamoDBFeatureStore(process.env.DYNAMODB_TABLE, {
    cacheTTL: 30,
  });
  // pass in the flag store as an option to the SDK client
  // useLdd puts the client in daemon mode, relying on DynamoDB as the source of truth for flags
  // leave useLdd off if you are not syncing all flags to a DynamoDB table
  // this will use the DyanmoDB table as a cache, but will still rely on the LaunchDarkly API for flag evaluations
  const options = {
    featureStore: store,
    useLdd: true,
  };
  const client = LaunchDarkly.init(process.env.LAUNCHDARKLY_SDK_KEY, options);
  await client.waitForInitialization();

  // we're just using an anonymous user for testing
  const context = {
    kind: "user",
    key: "anonymous-1",
    anonymous: true,
  };

  // in this example we're just getting a simple boolean flag with the key of "my-flag"
  // we are passing the anonymous user context and setting a default value of false
  const myFlag = await client.variation("my-flag", context, false);

  // you can implement different code paths based on the flag value
  if (myFlag) {
    // new code
  } else {
    // old code
  }

  return myFlag;
};
