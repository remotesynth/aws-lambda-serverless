// The LaunchDarkly Node Server SDK
// This needs to be npm installed or added via the Lambda Layer
const LaunchDarkly = require("launchdarkly-node-server-sdk");

exports.handler = async (event) => {
  // Initialize the client with your LaunchDarkly SDK key
  // This needs to be added to the environment variables of your Lambda function
  const client = LaunchDarkly.init(process.env.LAUNCHDARKLY_SDK_KEY);

  // wait for the SDK client to be ready
  // note that you can wait for the ready event instead
  // see the docs at https://docs.launchdarkly.com/sdk/server-side/node-js
  await client.waitForInitialization();

  // we're just using an anonymous user context for this example
  const context = {
    type: "user",
    key: "anonymous",
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

  return new Response(JSON.stringify(myflag), {
    status: 200,
  });
};
