import { ThemeProvider } from "@/components/theme-provider";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { GoogleOAuthProvider } from "@react-oauth/google";

import Layout from "./Layout";
import HomePage from "@/pages/HomePage";
import SignUpPage from "@/pages/SignUpPage";
import LoginPage from "@/pages/LoginPage";
import CreatePage from "./pages/CreatePage";
import FormPage from "./pages/FormPage";
import ProtectedRoute from "./components/ProtectedRoute";
import PageNotFound from "./pages/Error/PageNotFound";
import ContactPage from "./pages/ContactPage";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const GoogleAuthWrapperSignUp = () => {
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <SignUpPage />
    </GoogleOAuthProvider>
  );
};

const GoogleAuthWrapperSignIn = () => {
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <LoginPage />
    </GoogleOAuthProvider>
  );
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path="*" element={<PageNotFound />} />
      <Route path="/signup" element={<GoogleAuthWrapperSignUp />} />
      <Route path="/login" element={<GoogleAuthWrapperSignIn />} />
      <Route path="/contact" element={<ContactPage />} />
      {/* Protected routes */}
      <Route
        index
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/create"
        element={
          <ProtectedRoute>
            <CreatePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/form/:formId"
        element={
          <ProtectedRoute>
            <FormPage />
          </ProtectedRoute>
        }
      />
    </Route>
  )
);

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router}></RouterProvider>
      <Toaster richColors />
    </ThemeProvider>
  );
}

export default App;
