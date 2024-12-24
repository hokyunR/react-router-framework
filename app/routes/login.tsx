import { redirect, type LoaderFunctionArgs } from "react-router";
import { generateCognitoAuthUrl } from "~/lib/cognito.server";
import { authCookieSessionStorage } from "~/utils/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const { url, state } = generateCognitoAuthUrl();

  const cookieHeader = request.headers.get("cookie");
  const session = await authCookieSessionStorage.getSession(cookieHeader);

  session.flash("oauth_state", state);

  return redirect(url.href, {
    headers: {
      "Set-Cookie": await authCookieSessionStorage.commitSession(session),
    },
  });
}
