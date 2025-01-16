import React, { useCallback, useEffect, useState } from "react";
import Navbar from "../../components/patient/Navbar";
import doctor_img from "../../assets/icon/doctor.png";
import { RootState } from "../../app/store";
import { useSelector } from "react-redux";
import { Doctor } from "../../types/doctor";
import { TimeSlots } from "../../types/timeSlots";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api/api";

interface Times {
  time: string;
  isBooked: boolean;
}

function PickDateTime() {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<Times | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlots[]>([]);
  const [dates, setDates] = useState<Date[]>([]);
  const [times, setTimes] = useState<Times[]>([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const doctor: Doctor | null = useSelector(
    (state: RootState) => state.user.doctorToConsult
  );

  const { user } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const toastId = "loginToContinue";
    if (!user) {
      navigate("/login");
      if (!toast.isActive(toastId)) {
        toast.warn("Login to continue", { toastId });
      }
    }
  }, [user, navigate]);

  const fetchDateAndTime = useCallback(async () => {
    const id = doctor?._id;
    try {
      const response = await api.get(`/patients/doctors/timeSlots/${id}`, {
        headers: {
          "User-Type": "patient",
        },
      });
      if (response.data.success) {
        const fetchedDateTime = response.data.timeSlots;
        setTimeSlots(fetchedDateTime);
        console.log("starting", timeSlots);
        const newDates: Date[] = fetchedDateTime.map(
          (data: TimeSlots) => data.date
        );
        console.log("extraction", newDates);
        setDates(newDates);
      }
    } catch (error) {
      console.log(error);
    }
  }, [doctor?._id, timeSlots]);

  useEffect(() => {
    if (doctor) {
      fetchDateAndTime();
    }
  }, []);

  console.log(dates);

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    if (date) {
      fetchDateAndTime();
      const dateData = timeSlots.filter((data) => {
        if (data.date === date) return data;
      });
      const currentDate = new Date();
      const selectedDateObj = new Date(date);
      const avalableTimes = dateData[0].timeSlots.filter((time) => {
        if (time.isBooked === false) {
          if (selectedDateObj.toDateString() === currentDate.toDateString()) {
            const [hour, minute] = time.time.split(":");
            const meridian = time.time.split(" ")[1];
            const timeDate = new Date(date);
            timeDate.setHours(
              parseInt(hour) + (meridian === "PM" && hour !== "12" ? 12 : 0),
              parseInt(minute)
            );
            return timeDate > currentDate;
          }
          return true;
        }
        return false;
      });
      setTimes(avalableTimes);
      console.log("times", dateData[0].timeSlots);
    }
  };
  const handleTimeClick = (time: Times) => {
    setSelectedTime(time);
  };
  const handleNextStep = async () => {
    if (!selectedDate || !selectedTime) {
      setError("Date and Time  are required");
      return;
    }
    const response = await api.put(
      "/patients/appointments/lockTimeSlot",
      {
        doctorId: doctor?._id,
        date: selectedDate,
        time: selectedTime.time,
        status: "true",
      },
      {
        headers: {
          "User-Type": "patient",
        },
      }
    );
    if (response.data.success) {
      navigate("/patientDetails", {
        state: { selectedDate, selectedTime, doctor },
        replace: true,
      });
    } else {
      toast.error("Time slot is already booked, please select another time");
    }
  };

  const formatDateString = (dateString: Date) => {
    const date = new Date(dateString);
    date.setDate(date.getDate());
    const localDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    );
    const options: Intl.DateTimeFormatOptions = {
      month: "long",
      day: "numeric",
      weekday: "long",
    };
    return localDate.toLocaleDateString("en-US", options);
  };

  return (
    <div>
      <Navbar />
      <div className="border-2 h-fit w-9/12 mx-auto border-[#007E85] rounded-lg my-10">
        <div className="border-b-2 h-60 w-full p-5 mx-auto  border-[#007E85] flex gap-4 flex-wrap ">
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
            <p className="text-red-500 text-center">{error}</p>
            <h2 className="text-2xl mb-4 font-extrabold">Choose Date</h2>
            <div className="flex flex-wrap justify-center mb-6">
              {dates.map((date, index) => (
                <div
                  key={index}
                  className={`date w-24 md:w-32 text-center font-extrabold px-4 md:px-2 py-2 border-4 text-[#6EAB36] border-[#6EAB36] m-2 cursor-pointer rounded-lg ${
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
