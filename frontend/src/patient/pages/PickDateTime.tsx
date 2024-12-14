import React, { useCallback, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import doctor_img from "../../assets/icon/doctor.png";
import { RootState } from "../../app/store";
import { useSelector } from "react-redux";
import { Doctor } from "../../types/doctor";
import axios from "axios";
import { TimeSlots } from "../../types/timeSlots";
import { useNavigate } from "react-router-dom";

interface Times {
  time: string;
  isBooked: boolean;
}

function PickDateTime() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlots[]>([]);
  const [dates, setDates] = useState<Date[]>([]);
  const [times, setTimes] = useState<Times[]>([]);
  const navigate = useNavigate();
  const doctor: Doctor | null = useSelector(
    (state: RootState) => state.user.doctorToConsult
  );

  const fetchDateAndTime = useCallback(async () => {
    const id = doctor?._id;
    try {
      const response = await axios.get(
        `http://localhost:8080/api/patients/doctors/timeSlots/${id}`
      );
      if (response.data.success) {
        const fetchedDateTime = response.data.timeSlots;
        setTimeSlots(fetchedDateTime);
        console.log("starting", timeSlots);
        const newDates: Date[] = fetchedDateTime.map((data) => data.date);
        console.log("extraction", newDates);
        setDates(newDates);
      }
    } catch (error) {
      console.log(error);
    }
  }, [doctor]);

  useEffect(() => {
    if (doctor) {
      fetchDateAndTime();
    }
  }, [doctor]);

  console.log(dates);

  const handleDateClick = (date) => {
    setSelectedDate(date);
    if (date) {
      fetchDateAndTime();
      const dateData = timeSlots.filter((data) => {
        if (data.date === date) return data;
      });
      const avalableTimes = dateData[0].timeSlots.filter(
        (time) => time.isBooked === false
      );
      avalableTimes.forEach((data) => data.time);
      setTimes(avalableTimes);
      console.log("times", dateData[0].timeSlots);
    }
  };
  const handleTimeClick = (time) => {
    setSelectedTime(time);
  };
  const handleNextStep = () => {
    navigate("/patientDetails", { state: { selectedDate, selectedTime } });
  };

  const formatDateString = (dateString: Date) => {
    const date = new Date(dateString);
    date.setDate(date.getDate());
    const localDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    );
    const options = { month: "long", day: "numeric", weekday: "long" };
    return localDate.toLocaleDateString("en-US", options);
  };

  //
  return (
    <div>
      <Navbar />
      <div className="border-2 h-fit w-9/12 mx-auto border-[#007E85] rounded-lg my-10">
        <div className="border-b-2 h-60 w-full p-5 mx-auto  border-[#007E85] flex gap-4  ">
          <img
            src={doctor_img}
            alt=""
            className="border-1 rounded-full w-48 h-48"
          />
          <div className=" h-auto w-full mt-5">
            <p className="text-xl font-extrabold text-[#007E85]">
              DR. {doctor?.firstName.toUpperCase()}
              <span> {doctor?.lastName.toUpperCase()}</span>{" "}
            </p>
            <p className="mt-5 font-bold">
              {doctor?.specialization.toUpperCase()}{" "}
            </p>
            <p>{doctor?.experience} years of experience</p>
            <p>{doctor?.location} </p>
            <p>Fee: ₹ {doctor?.fees}</p>
          </div>
        </div>
        <div className="  py-10 px-5 ">
          <div className="container mx-auto">
            <h2 className="text-2xl mb-4 font-extrabold">Choose Date</h2>
            <div className="flex flex-wrap justify-center mb-6">
              {dates.map((date, index) => (
                <div
                  key={index}
                  className={`date w-32 text-center font-extrabold px-4 py-2 border-4 text-[#6EAB36] border-[#6EAB36] m-2 cursor-pointer rounded-lg ${
                    selectedDate === date ? "bg-[#6EAB36] text-white" : ""
                  }`}
                  onClick={() => handleDateClick(date)}
                >
                  {formatDateString(date).replace(",", " ")}
                </div>
              ))}
            </div>
            <h2 className="text-2xl mb-4 font-extrabold">Pick Time</h2>
            <div>
              <h3 className="text-lg mb-2 font-bold">Avalable Time Slots</h3>
              <div className="flex flex-wrap  mb-4">
                {times?.map((time) => (
                  <div
                    key={time.time}
                    className={`time w-32 px-4 py-2 border-2 rounded-lg m-2 cursor-pointer ${
                      selectedTime === time ? "bg-gray-200" : ""
                    }`}
                    onClick={() => handleTimeClick(time)}
                  >
                    {time.time}
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full text-right p-5">
              <button
                className="next-button px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded"
                onClick={handleNextStep}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(PickDateTime);
