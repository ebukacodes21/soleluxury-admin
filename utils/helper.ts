import axios from "axios";

export const apiCall = async (url: string, method: string, data?: object) => {
  try {
    const isGetRequest = method.toUpperCase() === 'GET';
    const config: any = { url, method };
    isGetRequest ? config.params = data : config.data = data
    
    const res = await axios(config);
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

  if (errorMessage.includes("no user found sql")) {
    return "Admin not found";
  }

  if (err.status === 500) {
    return "Request failed. please try again.";
  }
};

export const formatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN"
})