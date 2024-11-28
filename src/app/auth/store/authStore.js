"use client";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";
import { AppwriteException, ID, Models, Query } from "appwrite";
import { account, databases } from "@/config/client/appwrite";
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

      logout: async () => {
        try {
          const result = await account.deleteSession("current");
          console.log(result);

          set({
            isLoading: false,
            isError: null,
            email: null,
            isLoggedIn: false,
            user: null,
            userId: null,
            username: null,
          });
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
        return (state, error) => {
          if (!error) state?.setHydrated();
        };
      },
    }
  )
);
