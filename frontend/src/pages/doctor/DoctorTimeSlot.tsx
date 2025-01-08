import { useCallback, useEffect, useState } from "react";
import DoctorNav from "../../components/doctor/DoctorNav";
import { toast } from "react-toastify";
import { TimeSlots } from "../../types/timeSlots";
import { RootState } from "../../app/store";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import DoctorTopBar from "../../components/doctor/DoctorTopBar";
import api from "../../api/api";

interface Times {
  time: string;
  isBooked: boolean;
}

function DoctorTimeSlot() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlots[]>([]);
  const [dates, setDates] = useState<Date[]>([]);
  const [times, setTimes] = useState<Times[]>([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const doctor = useSelector((state: RootState) => state.doctor.doctor);

  useEffect(() => {
    const toastId = "loginToContinue";
    if (!doctor) {
      navigate("/doctor/login");
      if (!toast.isActive(toastId)) {
        toast.warn("Login to continue", { toastId });
      }
    }
  }, [doctor, navigate]);

  const fetchDateAndTime = useCallback(async () => {
    const id = doctor?.id;
    try {
      const response = await api.get(`/doctor/timeSlots/${id}`, {
        headers: {
          "User-Type": "doctor",
        },
      });
      if (response.data.success) {
        const fetchedDateTime = response.data.timeSlots;
        setTimeSlots(fetchedDateTime);
        const newDates: Date[] = fetchedDateTime.map((data: TimeSlots) => {
          const date = new Date(data.date);

          return date;
        });
        setDates(newDates);
      }
    } catch (error) {
      console.error("Error fetching time slots:", error);
    }
  }, [doctor]);

  useEffect(() => {
    if (doctor) {
      fetchDateAndTime();
    }
  }, [doctor, fetchDateAndTime]);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime([]);
    if (date) {
      const dateData = timeSlots.find(
        (data) => new Date(data.date).getTime() === date.getTime()
      );
      if (dateData) {
        const availableTimes = dateData.timeSlots.filter(
          (time) => !time.isBooked
        );
        setTimes(availableTimes);
      }
    }
  };

  const handleNextStep = async () => {
    if (!selectedDate || selectedTime.length === 0) {
      setError("Date and Time are required");
      return;
    }
    try {
      const response = await api.put(
        "/doctor/TimeSlots",
        { doctorId: doctor?.id, date: selectedDate, time: selectedTime },
        {
          headers: {
            "User-content": "doctor",
          },
        }
      );
      if (response.data.success) {
        toast.success("Time Slots updated Sucessfully");
        setSelectedTime([]);
        setSelectedDate(null);
        fetchDateAndTime();
      }
    } catch (error) {
      console.error("Error locking time slot:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#007E85]">
      <DoctorNav />
      <div className="bg-white h-fit min-h-[98vh] w-[88vw] text-center p-2 rounded-l-[4rem] drop-shadow-xl border-[1px] border-[#007E85] ml-auto me-2">
        <DoctorTopBar />
        <div className="">
          <form className="text-center">
            <select
              className="border-[2px] border-[#007E85] w-2/5 rounded-lg pt-1 pX-5"
              onChange={(e) => handleDateChange(new Date(e.target.value))}
            >
              <option value="">Select Date</option>
              {dates.map((date) => (
                <option key={date.toString()} value={date.toISOString()}>
                  {date.toString().slice(0, 10)}
                </option>
              ))}
            </select>

            <div className="border-[2px] border-[#007E85] w-2/5 h-fit mt-5 rounded-lg  mx-auto">
              <p className="text-[#007E85] text-lg font-bold">
                Select time to remove
              </p>
              <div className="flex px-10 gap-10">
                <div>
                  {times.map((time) => (
                    <div key={time.time} className="w-fit">
                      <input
                        type="checkbox"
                        value={time.time}
                        className="m-2"
                        onChange={(e) => {
                          const { checked, value } = e.target;
                          setSelectedTime((prev) =>
                            checked
                              ? [...prev, value]
                              : prev.filter((t) => t !== value)
                          );
                        }}
                      />
                      <label>{time.time}</label>
                    </div>
                  ))}
                </div>
                <div className="ml-auto text-gray-500">
                  {selectedTime?.map((sTime) => (
                    <p>{sTime}</p>
                  ))}
                </div>
              </div>
            </div>
            {error && <div className="text-red-500 mt-2">{error}</div>}
            <button
              type="button"
              className="mt-4 bg-[#007E85] text-white p-2 rounded"
              onClick={handleNextStep}
            >
              Remove Time Slots
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default DoctorTimeSlot;
