import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "@/lib/proxy";
import { getCookie } from "@/lib/getCookie";

type UserDetails = {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  createdAt: Date;
  updatedAt: Date;
};

type UserInfoProfile = {
  _id: string;
  name: string;
  email: string;
};

export const fetchRegister = createAsyncThunk(
  "user/register",
  async (
    user: {
      name: string;
      email: string;
      password: string;
      confirmPassword: string;
      avatar: File;
    },
    { rejectWithValue }
  ) => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      const { data } = await axios.post(
        `${baseUrl}/api/v1/users/register`,
        user,
        config
      );
      return data;
    } catch (error: any) {
      const errorMessage =
        error.response && error.response.data
          ? error.response.data.message
          : error.message;
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchLogin = createAsyncThunk(
  "user/login",
  async (user: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      const { data } = await axios.post(
        `${baseUrl}/api/v1/users/login`,
        user,
        config
      );

      document.cookie = `userInfoCanva=${encodeURIComponent(
        JSON.stringify(data.data)
      )}; path=/; max-age=${30 * 24 * 60 * 60}; secure; sameSite=None;`;
      return data.data;
    } catch (error: any) {
      const errorMessage =
        error.response && error.response.data
          ? error.response.data.message
          : error.message;
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchLogout = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      const { data } = await axios.get(
        `${baseUrl}/api/v1/users/logout`,
        config
      );
      document.cookie =
        "userInfoCanva=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      return data;
    } catch (error: any) {
      const errorMessage =
        error.response && error.response.data
          ? error.response.data.message
          : error.message;
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchUserDetails = createAsyncThunk(
  "user/userDetails",
  async (_, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      const { data } = await axios.get(
        `${baseUrl}/api/v1/users/details`,
        config
      );

      return data;
    } catch (error: any) {
      const errorMessage =
        error.response && error.response.data
          ? error.response.data.message
          : error.message;
      return rejectWithValue(errorMessage);
    }
  }
);

const userInfoCookie = getCookie("userInfoCanva");

const userSlice = createSlice({
  name: "user",
  initialState: {
    userInfo: userInfoCookie ? JSON.parse(userInfoCookie) : null,
    userInfoStatus: "idle",
    userInfoError: {},

    logout: {},
    logoutStatus: "idle",
    logoutError: {},

    userDetails: { data: {} as UserDetails },
    userDetailsStatus: "idle",
    userDetailsError: {},

    userInfoProfile: { data: {} as UserInfoProfile },
    userInfoProfileStatus: "idle",
    userInfoProfileError: {},

    makeAdmin: {},
    makeAdminStatus: "idle",
    makeAdminError: {},
  },
  reducers: {
    resetUserDetails: (state) => {
      state.userDetails = { data: {} as UserDetails };
      state.userDetailsStatus = "idle";
      state.userDetailsError = {};
    },
    reSignIn: (state) => {
      state.userInfo = null;
      document.cookie =
        "userInfoCanva=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(fetchLogin.pending, (state) => {
        state.userInfoStatus = "loading";
      })
      .addCase(fetchLogin.fulfilled, (state, action) => {
        state.userInfoStatus = "succeeded";
        state.userInfo = action.payload;
      })
      .addCase(fetchLogin.rejected, (state, action) => {
        state.userInfoStatus = "failed";
        state.userInfoError = action.payload || "Login failed";
      })

      // Logout
      .addCase(fetchLogout.pending, (state) => {
        state.logoutStatus = "loading";
      })
      .addCase(fetchLogout.fulfilled, (state, action) => {
        state.logoutStatus = "succeeded";
        state.logout = action.payload;
        state.userInfo = null;
      })
      .addCase(fetchLogout.rejected, (state, action) => {
        state.logoutStatus = "failed";
        state.logoutError = action.payload || "Logout failed";
      })

      // User Details
      .addCase(fetchUserDetails.pending, (state) => {
        state.userDetailsStatus = "loading";
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.userDetailsStatus = "succeeded";
        state.userDetails = action.payload;
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.userDetailsStatus = "failed";
        state.userDetailsError = action.payload || "User Details failed";
      });
  },
});

export const { reSignIn, resetUserDetails } = userSlice.actions;

export default userSlice.reducer;
