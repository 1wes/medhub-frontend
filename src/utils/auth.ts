import axiosInstance from "./axios";

export const checkToken = async (): Promise<boolean> => {
  try {
    const response = await axiosInstance.get("/api/user/check-token");
    return response.status === 200;
  } catch {
    return false;
  }
};

export const logout = async () => {
  await axiosInstance.get("/api/user/logout");
  window.location.href = "/login";
};
