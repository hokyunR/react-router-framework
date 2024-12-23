import {
  redirect,
  useActionData,
  type ActionFunctionArgs,
  data,
  type LoaderFunctionArgs,
} from "react-router";
import { LoginForm } from "~/components/login-form";
import { z } from "zod";
import { authCookieSessionStorage } from "~/utils/auth-session.server";

const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function loader({ request }: LoaderFunctionArgs) {
  const cookieHeader = request.headers.get("cookie");

  const authSession = await authCookieSessionStorage.getSession(cookieHeader);

  const user = authSession.get("user");

  if (user) {
    return redirect("/");
  }
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = Object.fromEntries(await request.formData());
  const user = loginFormSchema.safeParse(formData);

  if (user.error) {
    return data({ error: user.error.format() }, { status: 400 });
  }

  const cookieHeader = request.headers.get("cookie");

  const authSession = await authCookieSessionStorage.getSession(cookieHeader);

  authSession.set("user", { email: user.data.email });

  const setCookieHeader =
    await authCookieSessionStorage.commitSession(authSession);

  return redirect("/", {
    headers: {
      "set-cookie": setCookieHeader,
    },
  });
}

export default function LoginPage() {
  const actionData = useActionData<typeof action>();

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm error={actionData?.error} />
      </div>
    </div>
  );
}
