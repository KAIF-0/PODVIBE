import env from "@/env";
import { Client, Databases, Account } from "appwrite";

export const client = new Client();
// console.log(env.APPWRITE_URL, env.APPWRITE_PROJECT_ID)

client
  .setEndpoint(env.APPWRITE_URL)
  .setProject(env.APPWRITE_PROJECT_ID);

export const account = new Account(client);


export const databases = new Databases(client);
