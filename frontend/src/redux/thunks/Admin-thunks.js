import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { server } from "../../constants/config";
const adminLogin = createAsyncThunk("admin/login", async (secretKey) => {
  try {
    const Config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    };
    const { data } = await axios.post(`${server}/api/v1/admin/verify`, {
      secretKey,
    });
    return data.message;
  } catch (error) {
    throw error.response.data.message;
  }
});

const getAdmin = createAsyncThunk("admin/getAdmin", async () => {
  try {
    const { data } = await axios.get(`${server}/api/v1/admin/`, {
      withCredentials: true,
    });
    return data.admin;
  } catch (error) {
    throw error.response.data.message;
  }
});

const adminLogout = createAsyncThunk("admin/getAdmin", async () => {
  try {
    const { data } = await axios.get(`${server}/api/v1/admin/logout`, {
      withCredentials: true,
    });
    return data.message;
  } catch (error) {
    throw error.response.data.message;
  }
});

export { adminLogin, getAdmin, adminLogout };
