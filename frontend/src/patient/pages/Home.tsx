import { RootState } from "../../app/store";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { User } from "../../types/user";
import React from "react";
import heroImage from "../../assets/hero_img_doctor.png";

function Home() {
  const user = useSelector(
    (state: RootState) => state.auth.user
  ) as User | null;
  console.log(user?.name);
  // const navigate = useNavigate();

  return (
    <div>
      <Navbar />
      <div className="w-10/12 h-1/3  flex mx-auto py-5 my-5 align-middle">
        <div className="my-5   w-3/5">
          <p className="ml-4 text-5xl">
            Providing Quality <span className="text-[#007E85]">Healthcare</span>{" "}
            for a <span className="text-[#6EAB36]">Brighter</span> and{" "}
            <span className="text-[#6EAB36]">Healthy</span> Future
          </p>
          <p className="ml-4 text-lg text-gray-500 mt-5">
            We are dedicated to providing exceptional medical care to our
            patients and their families. Our experienced team of medical
            professionals, cutting-edge technology, and compassionate approach
            make us a leader in the healthcare industry
          </p>
        </div>
        <div className="ml-auto ">
          <img src={heroImage} alt="img" />
        </div>
      </div>

      <div className="w-10/12 h-1/3 bg-gray-100 flex mx-auto py-5 my-5 align-middle ">
        <p>Find Doctor</p>
        <form action="" className="flex justify-center">
          <input
            type="text"
            className="bg-white m-2 px-3 py-2 border border-[#007E85] font-light rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full lg:w-auto"
            placeholder="Name"
          />
        </form>
      </div>

      <Link to="/doctorSignup" className="text-blue-500">
        Register as a Doctor
      </Link>
    </div>
  );
}

export default React.memo(Home);
