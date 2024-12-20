import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { RRule, RRuleSet } from "rrule";
import DoctorNav from "../../components/doctor/DoctorNav";
import DoctorTopBar from "../../components/doctor/DoctorTopBar";
import api from "../../api/api";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { toast } from "react-toastify";

interface IFormInput {
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  interval: number;
}

const generateTimeSlots = (
  startDate: Date,
  endDate: Date,
  startTime: string,
  endTime: string,
  interval: number
) => {
  const slots = [];
  const days = [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR, RRule.SA];

  days.forEach((day) => {
    const rule = new RRule({
      freq: RRule.WEEKLY,
      interval: 1,
      byweekday: day,
      dtstart: startDate,
      until: endDate,
    });

    const ruleSet = new RRuleSet();
    ruleSet.rrule(rule);

    const times = ruleSet.all().map((date) => {
      const daySlots = [];
      const currentDate = new Date(date);
      const [startHour, startMinute] = startTime.split(":");
      const [endHour, endMinute] = endTime.split(":");

      currentDate.setHours(parseInt(startHour), parseInt(startMinute), 0, 0);
      const endOfDay = new Date(currentDate);
      endOfDay.setHours(parseInt(endHour), parseInt(endMinute), 0, 0);

      while (currentDate < endOfDay) {
        daySlots.push(new Date(currentDate));
        currentDate.setMinutes(currentDate.getMinutes() + interval);
      }

      return daySlots;
    });

    slots.push(...times.flat());
  });

  return slots;
};

const TimeSlotForm: React.FC = () => {
  const { register, handleSubmit } = useForm<IFormInput>();
  const [timeSlots, setTimeSlots] = useState<Date[]>([]);
  const doctor = useSelector((state: RootState) => state.doctor.doctor);

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    const slots = generateTimeSlots(
      startDate,
      endDate,
      data.startTime,
      data.endTime,
      data.interval
    );
    const payload = {
      doctorId: doctor?.id,
      slots: slots.map((slot) => ({
        date: slot.toISOString(),
        timeSlots: [
          {
            time: slot.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            isBooked: false,
          },
        ],
      })),
    };
    console.log("Payload:", payload);
    if (timeSlots) {
      try {
        const id = doctor?.id;
        const response = await api.post(`/doctor/timeSlots/${id}`, payload, {
          headers: { "User-Type": "doctor" },
        });

        if (response.data.success) {
          toast.success("Time slots created successfully");
        }
      } catch (error) {
        console.log(error);
        toast.error("Error in time slot creation");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#007E85]">
      <DoctorNav />
      <div className="bg-white h-[98vh] w-[88vw] text-center p-2 rounded-l-[4rem] drop-shadow-xl border-[1px] border-[#007E85] ml-auto me-2">
        <DoctorTopBar />
        <div className="p-6 bg-gray-200 rounded-lg shadow-md max-w-lg mx-auto mt-10">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Create Doctor Time Slots
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <input
                type="date"
                {...register("startDate", { required: true })}
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                End Date
              </label>
              <input
                type="date"
                {...register("endDate", { required: true })}
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Start Time
              </label>
              <input
                type="time"
                {...register("startTime", { required: true })}
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                End Time
              </label>
              <input
                type="time"
                {...register("endTime", { required: true })}
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Interval (minutes)
              </label>
              <input
                type="number"
                {...register("interval", {
                  required: true,
                  valueAsNumber: true,
                })}
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#007E85] text-white py-2 px-4 rounded-md font-semibold shadow-md hover:bg-blue-700"
            >
              Generate Time Slots
            </button>
          </form>
          {/* {timeSlots.length > 0 && (
            <div className="mt-6">
              <h3 className="text-xl font-bold mb-4">Generated Time Slots</h3>
              <ul className="space-y-2">
                {timeSlots.map((slot, index) => (
                  <li
                    key={index}
                    className="p-2 border border-gray-300 rounded-md shadow-sm"
                  >
                    {slot.toLocaleString()}
                  </li>
                ))}
              </ul>
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default TimeSlotForm;
