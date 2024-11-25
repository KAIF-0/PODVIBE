import { useAuthStore } from "../store/authStore";

export default function SetYtAuthToken(access_token, refresh_token) {
  try {
    console.log("Access Token:", access_token);
    console.log("Refresh Token:", refresh_token);
    const { storeYtToken } = useAuthStore();
    storeYtToken(access_token, refresh_token);
    return null;
  } catch (error) {
    console.log("SETTOKEN ERROR", error);
  }
}
