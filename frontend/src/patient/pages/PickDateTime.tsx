import React, { useState } from "react";
import Navbar from "../components/Navbar";
import doctor_img from "../../assets/icon/doctor.png";

function PickDateTime() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const dates = [
    { date: new Date().toString().slice(0, 10), day: "Wednesday" },
    { date: "November 28", day: "Thursday" },
    { date: "November 29", day: "Friday" },
    { date: "November 30", day: "Saturday" },
    { date: "November 2", day: "Monday" },
    { date: "November 3", day: "Tuesday" },
  ];
  const times = {
    morning: [
      "9:00 AM",
      "9:30 AM",
      "10:00 AM",
      "10:30 AM",
      "11:00 AM",
      "11:30 AM",
    ],
    afternoon: [
      "1:00 PM",
      "1:30 PM",
      "2:00 PM",
      "2:30 PM",
      "3:00 PM",
      "3:30 PM",
      "4:00 PM",
      "4:30 PM",
    ],
  };
  const handleDateClick = (date) => {
    setSelectedDate(date);
  };
  const handleTimeClick = (time) => {
    setSelectedTime(time);
  };
  const handleNextStep = () => {
    console.log("Selected Date:", selectedDate);
    console.log("Selected Time:", selectedTime);
  };
  return (
    <div>
      <Navbar />
      <div className="border-2 h-fit w-9/12 mx-auto border-[#007E85] rounded-lg my-10">
        <div className="border-b-2 h-60 w-full p-5 mx-auto  border-[#007E85]   ">
          <img
            src={doctor_img}
            alt=""
            className="border-1 rounded-full w-48 h-48"
          />
        </div>
        <div className="  py-10 px-5 ">
          <div className="container mx-auto">
            <h2 className="text-2xl mb-4 font-extrabold">Choose Date</h2>
            <div className="flex flex-wrap justify-center mb-6">
              {dates.map(({ date, day }) => (
                <div
                  key={date}
                  className={`date px-4 py-2 border-4 text-[#6EAB36] border-[#6EAB36] m-2 cursor-pointer rounded-lg ${
                    selectedDate === date ? "bg-[#6EAB36] text-white" : ""
                  }`}
                  onClick={() => handleDateClick(date)}
                >
                  {date} <br /> {day}
                </div>
              ))}
            </div>
            <h2 className="text-2xl mb-4 font-extrabold">Pick Time</h2>
            <div>
              <h3 className="text-lg mb-2 font-bold">
                Morning Time (9 AM to 12 PM)
              </h3>
              <div className="flex flex-wrap justify-center mb-4">
                {times.morning.map((time) => (
                  <div
                    key={time}
                    className={`time px-4 py-2 border-2 rounded-lg m-2 cursor-pointer ${
                      selectedTime === time ? "bg-gray-200" : ""
                    }`}
                    onClick={() => handleTimeClick(time)}
                  >
                    {time}
                  </div>
                ))}
              </div>
              <h3 className="text-lg mb-2 font-bold">
                Afternoon Time (1 PM to 5 PM)
              </h3>
              <div className="flex flex-wrap justify-center">
                {times.afternoon.map((time) => (
                  <div
                    key={time}
                    className={`time px-4 py-2 border-2 rounded-lg m-2 cursor-pointer ${
                      selectedTime === time ? "bg-gray-200" : ""
                    }`}
                    onClick={() => handleTimeClick(time)}
                  >
                    {time}
                  </div>
                ))}
              </div>
            </div>
            <button
              className="next-button mt-6 px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white  rounded"
              onClick={handleNextStep}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PickDateTime;
