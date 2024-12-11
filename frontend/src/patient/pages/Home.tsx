import { RootState } from "../../app/store";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { User } from "../../types/user";
import React from "react";

function Home() {
  const user = useSelector(
    (state: RootState) => state.auth.user
  ) as User | null;
  console.log(user?.name);
  // const navigate = useNavigate();

  return (
    <div>
      <Navbar />
      <h1>Home</h1>
      <Link to="/doctorSignup" className="text-blue-500">
        Register as a Doctor
      </Link>
    </div>
  );
}

export default React.memo(Home);
