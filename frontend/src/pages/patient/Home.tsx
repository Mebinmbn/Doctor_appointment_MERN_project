import { Link } from "react-router-dom";
import Navbar from "../../components/patient/Navbar";
import heroImage from "../../assets/hero_img_doctor.png";
import Footer from "../../components/patient/Footer";
import doctor_img from "../../assets/Are_u_a_dr.png";
import React from "react";

function Home() {
  return (
    <div>
      <Navbar />
      <div className="w-10/12 h-1/3  flex mx-auto py-5 my-5 align-middle">
        <div className="my-5   w-3/5">
          <p className="ml-4 text-5xl">
            Providing Quality <span className="text-[#007E85]">Healthcare</span>
            for a <span className="text-[#6EAB36]">Brighter</span> and
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

      <div className="bg-[#007E85] text-white px-10 pt-5 text-center my-5">
        <p className="text-3xl  font-extrabold">Are You A Doctor?</p>
        <div className="flex justify-between text-center flex-wrap ">
          <img src={doctor_img} alt="" className="w-72" />
          <div className="w-3/5  mx-auto text-left p-10 mt-10 flex justify-evenly">
            <p className="text-xl  font-bold">
              Would you like to work with us?
            </p>
            <Link to="/doctor/signup" className="text-blue-500">
              <button className="bg-blue-400 rounded-lg p-2  text-white w-[100%] h-10 font-bold hover:bg-green-700 transition duration-300">
                Register
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-blue-900 text-white py-10 px-5 my-5">
        <div className="container mx-auto grid gap-10 md:grid-cols-2 lg:grid-cols-4 text-center">
          <div className="flex flex-col items-center">
            <h3 className="text-2xl mb-2">Consult Top Doctors 24x7</h3>
            <p>
              Connect instantly with a 24x7 specialist or choose to video visit
              a particular doctor.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <h3 className="text-2xl mb-2">Convenient and Easy</h3>
            <p>Video consultation at the scheduled time.</p>
          </div>
          <div className="flex flex-col items-center">
            <h3 className="text-2xl mb-2">100% Safe Consultations</h3>
            <p>
              Be assured that your online consultation will be fully private and
              secured.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <h3 className="text-2xl mb-2">Free Follow-up</h3>
            <p>
              Get a valid digital prescription and a 7-day, free follow-up for
              further clarifications.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default React.memo(Home);
