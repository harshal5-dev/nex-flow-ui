import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";
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
  Profile,
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
