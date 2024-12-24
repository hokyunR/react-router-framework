import { env } from "../env";
import * as openidClient from "openid-client";

const configuration = await openidClient.discovery(
  new URL(
    `https://cognito-idp.${env.COGNITO_REGION}.amazonaws.com/${env.COGNITO_USER_POOL_ID}`
  ),
  env.COGNITO_CLIENT_ID,
  env.COGNITO_CLIENT_SECRET
);

console.log({ configuration });

export const generateCognitoAuthUrl = () => {
  const state = openidClient.randomState();

  const parameters = {
    redirect_uri: env.COGNITO_REDIRECT_URI,
    scope: "openid email profile",
    state,
  };

  const url = openidClient.buildAuthorizationUrl(configuration, parameters);

  return { url, state };
};

export const exchangeAuthCodeForTokens = async (
  currentUrl: URL,
  expected_state: string
) => {
  const tokens = await openidClient.authorizationCodeGrant(
    configuration,
    currentUrl,
    {
      expectedState: expected_state,
    }
  );

  return tokens;
};
