"use client";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";
import { AppwriteException, ID, Models, Query } from "appwrite";
import { account, databases } from "@/config/appwrite-config/appwrite";
import env from "@/env";
import axios from "axios";
import Cookies from "js-cookie";

export const useStreamStore = create(
  persist(
    immer((set) => ({
      isStreaming: false,
      isCredentialStored: false,
      ytCredential: {
        access_token: null,
        broadcastId: null,
      },

      hydrated: false,

      storeYtToken: async () => {
        const userInfo = await account.get();
        if (!userInfo) {
          console.log("UserInfo not found!");
          return {
            success: false,
            message: "userSession expired!",
          };
        }

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
            isCredentialStored: true,
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
          if (!userInfo) {
            console.log("UserInfo not found!");
            return {
              success: false,
              message: "userSession expired!",
            };
          }

          const userDoc = await databases.listDocuments(
            env.APPWRITE_DATABASE_ID,
            env.APPWRITE_YTCREDENTIALS_COLLECTION_ID,
            [Query.equal("userid", userInfo.$id)]
          );

          if (!userDoc) {
            console.log("User not found!");
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
        } catch (error) {
          console.log("Start Stream Error:", error.message);
        }
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
        } catch (error) {
          console.log("End Stream Error:", error.message);
        }
      },

      setHydrated() {
        set({ hydrated: true });
      },
    })),
    {
      name: "StreamSession",
      onRehydrateStorage() {
        return (state, error) => {
          if (!error) state?.setHydrated();
        };
      },
    }
  )
);
