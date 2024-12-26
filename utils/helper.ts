import axios from 'axios'

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