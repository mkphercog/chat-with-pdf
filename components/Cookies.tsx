"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";

function Cookies() {
  const { userId } = useAuth();

  useEffect(() => {
    const cookiesList = document.cookie.split(";");
    const hasSessionCookie = cookiesList.find((cookie) =>
      cookie.includes("session")
    );

    if (!userId && hasSessionCookie) {
      const newCookies = cookiesList
        .map((cookie) => {
          if (cookie.includes("session")) {
            console.log("No userId, session cookies detected.");
            console.log("Deleting session cookies.");
            return `${cookie}; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
          } else {
            return cookie;
          }
        })
        .join(";");

      document.cookie = newCookies;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
export default Cookies;
