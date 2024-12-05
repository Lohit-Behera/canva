import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "@/lib/proxy";

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

const formSlice = createSlice({
  name: "form",
  initialState: {
    createForm: null,

    getForm: null,
    getFormStatus: "idle",
    getFormError: {},
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
      });
  },
});

export default formSlice.reducer;
