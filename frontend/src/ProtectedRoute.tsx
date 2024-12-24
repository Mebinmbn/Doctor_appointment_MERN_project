import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { RootState } from "./app/store";
import { toast } from "react-toastify";

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: "user" | "doctor" | "admin";
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
  const user = useSelector((state: RootState) => state.user.user);
  const doctor = useSelector((state: RootState) => state.doctor.doctor);
  const admin = useSelector((state: RootState) => state.admin.admin);
  const location = useLocation();

  useEffect(() => {
    const toastId = "loginToContinue";
    if (role === "admin" && !admin) {
      toast.error("Login to continue!", { autoClose: 3000 });
    } else if (role === "doctor" && !doctor) {
      toast.error("Doctor login required!", { autoClose: 3000 });
    } else if (role === "user" && !user) {
      if (!toast.isActive(toastId)) {
        toast.warn("Login to continue", { toastId });
      }
    }
  }, [role, admin, doctor, user]);

  const roleCheck = {
    user: user,
    doctor: doctor,
    admin: admin,
  };

  if (role && !roleCheck[role]) {
    const redirectPath =
      role === "admin"
        ? "/admin/login"
        : role === "doctor"
        ? "/doctor/login"
        : "/";

    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
