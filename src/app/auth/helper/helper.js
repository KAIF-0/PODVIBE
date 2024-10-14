'use client'
//object of function to legin user through google and github by appwrite
import { client, account } from "@/config/client/appwrite.js";
import env from "@/env";

/**
 * Function to login using OAuth2
 * @param {string} provider - The OAuth provider (e.g., 'google' or 'github')
 * @returns {Promise<void>}
 */
export const loginWithOAuth = async (provider) => {

  try {
    const redirectURI = `${env.BASE_URL}/join-in/username?provider=${provider}`; // Redirect URI after login
    //if user exist
    const redirectURI2 = `${env.BASE_URL}`;
    await account.createOAuth2Session(provider, redirectURI, redirectURI2);
  } catch (error) {
    console.error("Login failed:", error);
    console.log("Login error: ", error.message); // Rethrow the error for handling in the calling function
  }
};
