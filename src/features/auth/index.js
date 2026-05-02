import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicOnlyRoute from "./components/PublicOnlyRoute";
import authReducer, { clearCredentials } from "./reducer/authSlice";
import {
  authApi,
  useIsAuthenticatedQuery,
  useSignoutMutation,
} from "./api/authApi";

export {
  Signin,
  Signup,
  ForgotPassword,
  ProtectedRoute,
  PublicOnlyRoute,
  authReducer,
  authApi,
  useIsAuthenticatedQuery,
  useSignoutMutation,
  clearCredentials,
};
