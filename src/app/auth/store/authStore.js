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
      isYtJoined: false,
      isStreaming: false,
      ytCredential: {
        access_token: null,
        broadcastId: null,
      },

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

      storeYtToken: async () => {
        const userInfo = await account.get();
        const { access_token, refresh_token } = Cookies.get();
        try {
          if (!access_token || !refresh_token) {
            console.log("Token not found!");
            return;
          }

          console.log("TOKENS:", access_token, "+", refresh_token);

          await databases
            .createDocument(
              env.APPWRITE_DATABASE_ID,
              env.APPWRITE_YTCREDENTIALS_COLLECTION_ID,
              ID.unique(),
              {
                userid: userInfo.$id,
                access_token,
                refresh_token,
              }
            )
            .then(() => {
              console.log("Tokens saved!");
            })
            .catch(() => {
              console.log("Error saving token!");
            });

          set({
            isYtJoined: true,
            ytCredential: {
              access_token: access_token,
              broadcastId: null,
            },
          });
        } catch (err) {
          console.log(err);
        }
      },

      refreshYtToken: async () => {
        try {
          const userInfo = await account.get();
          const userDoc = await databases.listDocuments(
            env.APPWRITE_DATABASE_ID,
            env.APPWRITE_YTCREDENTIALS_COLLECTION_ID,
            [Query.equal("userid", userInfo.$id)]
          );

          if (!userDoc) {
            console.log("User not found");
            return;
          }

          if (userDoc.documents.length > 0) {
            //refreshing token through api
            const { refresh_token } = userDoc.documents[0];
            const req = await axios.post("/api/refresh-token", {
              refresh_token,
            });

            const { access_token } = req.data;
            

            //updating in db
            await databases.updateDocument(
              env.APPWRITE_DATABASE_ID,
              env.APPWRITE_YTCREDENTIALS_COLLECTION_ID,
              userDoc.documents[0].$id,
              {
                access_token: access_token,
              }
            );
            console.log("Access token updated in the database!");
            console.log("New Access Token:", access_token);

            set({
              isYtJoined: true,
              ytCredential: {
                access_token: access_token,
                broadcastId: null,
              },
            });
          } else {
            console.log("No user document found for the given userId.");
          }
        } catch (error) {
          console.log(error);
        }
      },

      startStream: async (access_token, broadcastId) => {
        try {
          set({
            isStreaming: true,
            ytCredential: {
              access_token: access_token,
              broadcastId: broadcastId,
            },
          });
        } catch (error) {}
      },

      endStream: async (access_token) => {
        try {
          set({
            isStreaming: false,
            ytCredential: {
              access_token: access_token,
              broadcastId: null,
            },
          });
        } catch (error) {}
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
