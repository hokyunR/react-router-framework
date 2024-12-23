import { createCookieSessionStorage } from "react-router";

export const authCookieSessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__auth_session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: ["s3cret1"],
    secure: process.env.NODE_ENV === "production",
  },
});
