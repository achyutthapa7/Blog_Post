import axios from "axios";
const API_URL =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_API_URL_PRODUCTION ||
      "https://blog-post-7dgh.onrender.com/"
    : process.env.NEXT_PUBLIC_API_URL_DEVELOPMENT;

export const registration = async ({
  firstName,
  lastName,
  email,
  password,
}: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) => {
  try {
    const res = await axios.post(
      `${API_URL}/auth/registration`,
      {
        firstName,
        lastName,
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
  } catch (error: any) {
    console.error("Error while registering:", error);
    throw error;
  }
};

export const verification = async (
  emailAddress: string,
  verificationCode: number
) => {
  try {
    console.log(emailAddress, verificationCode);
    const res = await axios.post(
      `${API_URL}/auth/verification/?emailAddress=${emailAddress}`,
      {
        verificationCode,
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
    console.error("Error while verifying email:", error);
  }
};

export const resendotp = async (emailAddress: string) => {
  try {
    const res = await axios.put(
      `${API_URL}/resendotp/${emailAddress}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    return res;
  } catch (error) {
    console.error("Error while resending OTP:", error);
  }
};

export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    const res = await axios.post(
      `${API_URL}/auth/login`,
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
    const res = await axios.get(`${API_URL}/auth/logout`, {
      withCredentials: true,
    });
    return res;
  } catch (error) {
    console.error("Error while logging out:", error);
  }
};

export const authStatus = async () => {
  try {
    const res = await axios.get(`${API_URL}/api/auth/status`, {
      withCredentials: true,
    });
    return res;
  } catch (error) {
    console.error("Error while getting authentication status:", error);
  }
};

export const handleAddBlog = async ({
  title,
  content,
}: {
  title: string;
  content: string;
}) => {
  try {
    const res = await axios.post(
      `${API_URL}/blogs/addBlog`,
      {
        title,
        content,
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
    console.error("Error while adding blog:", error);
  }
};

export const getBlogById = async (blogId: string) => {
  try {
    const res = await axios.get(`${API_URL}/blogs/getBlogById/${blogId}`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    console.error("Error while fetching blog:", error);
  }
};

export const getUserById = async (userId: string) => {
  try {
    const res = await axios.get(`${API_URL}/user/getUserById/${userId}`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    console.error("Error while fetching user:", error);
  }
};
