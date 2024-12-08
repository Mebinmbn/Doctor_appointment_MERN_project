import AdminNav from "../components/AdminNav";

function AdminDashboard() {
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
