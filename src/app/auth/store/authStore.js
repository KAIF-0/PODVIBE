'use client'
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";
import { AppwriteException, ID, Models } from "appwrite";
import { account, databases } from "@/config/client/appwrite";
import env from "@/env";

export const useAuthStore = create(
  persist(
    immer((set) => ({
      isLoading: false,
      isError: null,
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

          //saving in user db
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
          console.log("Error logging out!");
          return {
            success: false,
          };
        }
      },

      //   setLoading:  (state) => {
      //     if (state == "true") {
      //       set({
      //         isLoading: true,
      //       });
      //     } else {
      //       set({
      //         isLoading: false,
      //       });
      //     }
      //   },

      //   setError:  (errorMessage, state)=>{
      //     if (state == "true") {
      //         set({
      //           isError: errorMessage,
      //         });
      //       } else {
      //         set({
      //             isError: null,
      //         });
      //       }
      //   },

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
