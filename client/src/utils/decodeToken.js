import { jwtDecode } from "jwt-decode";

export const decodeToken = (token) => {
  try {
    if (!token) {
      throw new Error("Token bulunamadı");
    }
    return jwtDecode(token);
  } catch (error) {
    console.error("Token decode edilirken bir hata oluştu:", error.message);
    return null;
  }
};
