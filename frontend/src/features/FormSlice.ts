import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "@/lib/proxy";

export type From = {
  _id: string;
  firstName: string;
  lastName: string;
  thumbnail: string;
  user: string;
  userName: string;
  userEmail: string;
  userAvatar: string;
  createdAt: string;
  updatedAt: string;
};

export const fetchCreateForm = createAsyncThunk(
  "form/create",
  async (
    form: { firstName: string; lastName: string; thumbnail: File },
    { rejectWithValue }
  ) => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      };
      const { data } = await axios.post(
        `${baseUrl}/api/v1/forms/create`,
        form,
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

export const fetchGetForm = createAsyncThunk(
  "form/get",
  async (id: string, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      const { data } = await axios.get(
        `${baseUrl}/api/v1/forms/get/${id}`,
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

export const fetchGetAllForms = createAsyncThunk(
  "form/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      const { data } = await axios.get(`${baseUrl}/api/v1/forms/all`, config);
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

export const fetchDeleteForm = createAsyncThunk(
  "form/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      const { data } = await axios.delete(
        `${baseUrl}/api/v1/forms/delete/${id}`,
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

const formSlice = createSlice({
  name: "form",
  initialState: {
    createForm: null,

    getForm: { data: {} as From },
    getFormStatus: "idle",
    getFormError: {},

    getAllForms: { data: [] as From[] },
    getAllFormsStatus: "idle",
    getAllFormsError: {},

    form: null,

    deleteForm: null,
    deleteFormStatus: "idle",
    deleteFormError: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create Form
      .addCase(fetchCreateForm.fulfilled, (state, action) => {
        state.createForm = action.payload;
      })
      // Get Form
      .addCase(fetchGetForm.pending, (state) => {
        state.getFormStatus = "loading";
      })
      .addCase(fetchGetForm.fulfilled, (state, action) => {
        state.getFormStatus = "succeeded";
        state.getForm = action.payload;
      })
      .addCase(fetchGetForm.rejected, (state, action) => {
        state.getFormStatus = "failed";
        state.getFormError = action.payload || "Getting form failed";
      })
      // Get All Forms
      .addCase(fetchGetAllForms.pending, (state) => {
        state.getAllFormsStatus = "loading";
      })
      .addCase(fetchGetAllForms.fulfilled, (state, action) => {
        state.getAllFormsStatus = "succeeded";
        state.getAllForms = action.payload;
      })
      .addCase(fetchGetAllForms.rejected, (state, action) => {
        state.getAllFormsStatus = "failed";
        state.getAllFormsError = action.payload || "Getting all forms failed";
      })
      // Delete Form
      .addCase(fetchDeleteForm.pending, (state) => {
        state.deleteFormStatus = "loading";
      })
      .addCase(fetchDeleteForm.fulfilled, (state, action) => {
        state.deleteFormStatus = "succeeded";
        state.deleteForm = action.payload;
      })
      .addCase(fetchDeleteForm.rejected, (state, action) => {
        state.deleteFormStatus = "failed";
        state.deleteFormError = action.payload || "Deleting form failed";
      });
  },
});

export default formSlice.reducer;
