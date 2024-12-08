import { RootState } from "../../app/store";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { User } from "../../types/user";
import { useEffect } from "react";
import { toast } from "react-toastify";

function Home() {
  const user = useSelector(
    (state: RootState) => state.auth.user
  ) as User | null;
  console.log(user?.name);
  const navigate = useNavigate();
  useEffect(() => {
    if (user?.role !== "patient") {
      navigate("/adminSigin");
      toast.error("Access denied");
    }
  }, [user?.role, navigate]);

  return (
    <div>
      <Navbar />
      <h1>Home</h1>
      {/* <h1>{user}</h1> */}

      <button
        onClick={() => {
          navigate("/login");
        }}
      >
        Login
      </button>
    </div>
  );
}

export default Home;
