import axios from "axios";

export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    const res = await axios.post(
      "http://localhost:3000/api/auth/login",
      {
        email,
        password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    return res;
  } catch (error) {
    console.error("Error while logging in:", error);
  }
};

export const logout = async () => {
  try {
    const res = await axios.get("http://localhost:3000/api/auth/logout", {
      withCredentials: true,
    });
    return res;
  } catch (error) {
    console.error("Error while logging out:", error);
  }
};

export const authStatus = async () => {
  try {
    const res = await axios.get("http://localhost:3000/api/auth/status", {
      withCredentials: true,
    });
    return res;
  } catch (error) {
    console.error("Error while getting authentication status:", error);
  }
};
