import api from "./axios";
import type {
  GoogleLoginResponse,
  CurrentUserResponse,
} from "../types/auth";

export const authApi = {
  googleLogin: async (googleIdToken: string): Promise<GoogleLoginResponse> => {
    const { data } = await api.post<GoogleLoginResponse>(
      "/api/auth/google",
      { token: googleIdToken }
    );
    return data;
  },

  getCurrentUser: async (): Promise<CurrentUserResponse> => {
    const { data } = await api.get<CurrentUserResponse>("/api/auth/me");
    return data;
  },

  logout: async (): Promise<void> => {
    await api.post("/api/auth/logout");
  },
};
