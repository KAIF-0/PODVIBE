"use client";
import { client, account } from "@/config/appwrite-config/appwrite.js";
import env from "@/env";
import { OAuthProvider } from "appwrite";

export const loginWithOAuth = async (provider) => {
  try {
    const redirectURI = `${env.BASE_URL}/join-in/username?provider=${provider}`;
    const redirectURI2 = `${env.BASE_URL}`;
    const customGoogleOAuthURL = `${redirectURI}&prompt=select_account`;

    // OAuth session creation
    switch (provider) {
      case "google":
        await account.createOAuth2Session(
          OAuthProvider.Google,
          customGoogleOAuthURL,
          redirectURI2
        );
        break;
      case "github":
        await account.createOAuth2Session(
          OAuthProvider.Github,
          customGoogleOAuthURL,
          redirectURI2
        );
        break;
      default:
        throw new Error("Unsupported provider");
    }
  } catch (error) {
    console.error("Login failed:", error);
    console.log("Login error: ", error.message); 
  }
};
