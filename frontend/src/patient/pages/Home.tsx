import { RootState } from "../../app/store";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { User } from "../../types/user";

function Home() {
  const user = useSelector(
    (state: RootState) => state.auth.user
  ) as User | null;
  console.log(user?.name);
  const navigate = useNavigate();

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
