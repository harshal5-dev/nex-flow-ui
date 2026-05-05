import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicOnlyRoute from "./components/PublicOnlyRoute";
import authReducer, {
  clearCredentials,
  selectCurrentUser,
  selectIsAuthLoading,
  selectAuthError,
} from "./reducer/authSlice";
import {
  authApi,
  useSignoutMutation,
  useGetUserProfileQuery,
} from "./api/authApi";

export {
  Signin,
  Signup,
  ForgotPassword,
  ProtectedRoute,
  PublicOnlyRoute,
  authReducer,
  authApi,
  useSignoutMutation,
  useGetUserProfileQuery,
  clearCredentials,
  selectCurrentUser,
  selectIsAuthLoading,
  selectAuthError,
};
