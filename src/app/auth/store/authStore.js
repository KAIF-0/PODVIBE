"use client";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";
import { AppwriteException, ID, Models, Query } from "appwrite";
import { account, databases } from "@/config/appwrite-config/appwrite";
import env from "@/env";
import axios from "axios";
import Cookies from "js-cookie";

export const useAuthStore = create(
  persist(
    immer((set) => ({
      email: null,
      isLoggedIn: false,
      user: null,
      userId: null,
      username: null,

      hydrated: false,
      login: async (username) => {
        try {
          const sessionInfo = await account.getSession("current");
          console.log("SESSION:  ", sessionInfo);

          const userInfo = await account.get();
          console.log("USERINFO:  ", userInfo);

          const existingUser = await databases.listDocuments(
            env.APPWRITE_DATABASE_ID,
            env.APPWRITE_USER_COLLECTION_ID,
            [Query.equal("email", userInfo.email)]
          );

          if (existingUser.documents.length > 0) {
            // Update existing username
            await databases.updateDocument(
              env.APPWRITE_DATABASE_ID,
              env.APPWRITE_USER_COLLECTION_ID,
              existingUser.documents[0].$id,
              { username }
            );
          } else {
            // Create new document
            await databases.createDocument(
              env.APPWRITE_DATABASE_ID,
              env.APPWRITE_USER_COLLECTION_ID,
              ID.unique(),
              {
                username,
                email: userInfo.email,
                provider: sessionInfo.provider,
                userId: userInfo.$id,
              }
            );
          }

          //just for middleware setup
          Cookies.set("sessionToken", sessionInfo.$id, {
            secure: true,
            expires: 10,
          });

          set({
            email: userInfo.email,
            isLoggedIn: true,
            user: userInfo,
            userId: userInfo.$id,
            username: username,
          });

          return {
            success: true,
          };
        } catch (error) {
          console.log(error);
          return {
            success: false,
          };
        }
      },
      checkSession: async () => {
        try {
          const sessionInfo = await account.getSession("current");
          console.log("SESSION:  ", sessionInfo);

          const userInfo = await account.get();
          console.log("USERINFO:  ", userInfo);



          //just for middleware setup
          // const token = await Cookies.get("sessionToken");
          // if (!token) {
          //   throw new Error("Session token not found");
          // }

          return {
            success: true,
          };
        } catch (error) {
          console.log("Error checking session:", error);
          return {
            success: false,
          };
        }
      },

      logout: async () => {
        try {

          Cookies.remove("sessionToken");
          Cookies.remove("isYtAuthenticated");
          Cookies.remove("access_token");
          Cookies.remove("refresh_token");

          set({
            isLoading: false,
            isError: null,
            email: null,
            isLoggedIn: false,
            user: null,
            userId: null,
            username: null,
          });


          const result = await account.deleteSession("current");
          console.log(result);
          return {
            success: true,
          };
        } catch (error) {
          console.log("Error logging out!", error);
          return {
            success: false,
          };
        }
      },

      setHydrated() {
        set({ hydrated: true });
      },
    })),
    {
      name: "AuthSession",
      onRehydrateStorage() {
        return async (state, error) => {
          if (!error) {
            await state.checkSession().then(async (result) => {
              if (result.success) {
                console.log(result);
              } else {
                console.log("Session check failed, logging out.");
                await state.logout();
              }
            });
          }
          state?.setHydrated();

        };
      },
    }
  )
);
