import { useSelector } from "react-redux";
import AdminNav from "../../components/admin/AdminNav";
import { RootState } from "../../app/store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const admin = useSelector((state: RootState) => state.admin.admin);
  const navigate = useNavigate();
  useEffect(() => {
    if (!admin) {
      navigate("/admin/login");
    }
  });
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#007E85]">
      <AdminNav />
      <div className="bg-gray-200 h-[98vh] w-[88vw] text-center p-4 rounded-l-[4rem] drop-shadow-xl border-[1px] border-[#007E85] ml-auto me-2">
        <h1>Dashboard</h1>
      </div>
    </div>
  );
}

export default AdminDashboard;
