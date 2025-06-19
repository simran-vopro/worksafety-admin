import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../../hooks/useAuth";
import { logout } from "../../features/auth/authSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../app/hooks";

interface DecodedToken {
  type: string;
  exp: number;
  [key: string]: any;
}


const PrivateRoute = () => {
  const { token } = useAuth();

  const dispatch = useDispatch<AppDispatch>();

  if (!token) return <Navigate to="/signin" />;

  try {
    const decoded: DecodedToken = jwtDecode(token);

    // Optionally, check token expiry
    if (decoded.exp * 1000 < Date.now()) {
      // ✅ Update Redux state
      dispatch(logout());
      console.log("i am here , logout");
      return <Navigate to="/signin" />;
    }

    if (decoded?.type !== "admin") {
      return <Navigate to="/signin" />;
    }

    return <Outlet />;
  } catch (error) {
    return <Navigate to="/signin" />;
  }
};

export default PrivateRoute;
