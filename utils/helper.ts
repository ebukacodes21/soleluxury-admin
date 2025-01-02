import axios from "axios";

export const apiCall = async (url: string, method: string, data: object) => {
  try {
    const res = await axios({
      url,
      method,
      data,
    });
    return res.data;
  } catch (error) {
    return error;
  }
};


export const formatError = (err: any) => {
  const errorMessage = err.response?.data?.error?.message || "";
  if (errorMessage.includes("failed to create session")) {
    return "User is already logged in on this device";
  }

  if (err.status === 500) {
    return "Request failed. please try again.";
  }
};