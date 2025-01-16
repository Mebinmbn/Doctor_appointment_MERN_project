import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { RRule, RRuleSet } from "rrule";
import DoctorNav from "../../components/doctor/DoctorNav";
import DoctorTopBar from "../../components/doctor/DoctorTopBar";
import api from "../../api/api";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { toast } from "react-toastify";
import ConfirmationModal from "../../components/ConfirmationModal";

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
): Date[] => {
  const slots: Date[] = [];
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
  const { register, handleSubmit, reset } = useForm<IFormInput>();
  const doctor = useSelector((state: RootState) => state.doctor.doctor);
  const [date, setDate] = useState<string>("");
  const [timeSlotsToRemove, setTimeSlotsToRemove] = useState<string[]>([]);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [confirmationCallback, setConfirmationCallback] = useState<() => void>(
    () => () => {}
  );
  const handleRemoveTimeSlots = async () => {
    showConfirmationModal(
      "Do you want to remove the selected time slots?",
      async () => {
        try {
          const response = await api.put(
            `/doctor/timeSlots/${doctor?.id}/${date}`,
            { timeSlotsToRemove },
            { headers: { "User-Type": "doctor" } }
          );
          if (response.data.success) {
            toast.success("Time slots removed successfully");
          }
        } catch (error) {
          console.error("Error removing time slots:", error);
          toast.error("Error in removing time slots");
        }
        setIsConfirmModalOpen(false);
      }
    );
  };

  const showConfirmationModal = (message: string, onConfirm: () => void) => {
    setMessage(message);
    setIsConfirmModalOpen(true);
    setConfirmationCallback(() => onConfirm);
  };

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

    const groupedSlots = slots.reduce((acc, slot) => {
      const date = slot.toISOString().split("T")[0];
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push({
        time: slot.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isBooked: false,
      });
      return acc;
    }, {} as Record<string, { time: string; isBooked: boolean }[]>);

    const payload = {
      doctorId: doctor?.id,
      slots: Object.entries(groupedSlots).map(([date, timeSlots]) => ({
        date,
        timeSlots,
      })),
    };

    try {
      const id = doctor?.id;
      const response = await api.post(`/doctor/timeSlots/${id}`, payload, {
        headers: { "User-Type": "doctor" },
      });

      if (response.data.success) {
        toast.success("Time slots created successfully");

        reset();
      }
    } catch (error) {
      console.error(error);
      toast.error("Error in time slot creation");
    }
  };

  return (
    <div className="md:flex items-center justify-center min-h-screen bg-[#007E85] gap-5">
      <DoctorNav />
      <div className="bg-white h-fit min-h-[98vh] w-full md:w-[88vw] text-center p-2 md:rounded-l-[4rem] drop-shadow-xl border-[1px] border-[#007E85] ml-auto md:me-2">
        <DoctorTopBar /> <div className="tab-bar bg-gray-100 h-5 w-full "></div>
        <div className="flex justify-center gap-10 w-full flex-wrap">
          <div className="py-6 px-10 w-96 bg-gray-200 rounded-lg shadow-md max-w-lg mt-5">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Create Time Slots
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
          </div>
          <div className="p-6 w-96 bg-gray-200 rounded-lg shadow-md max-w-lg mt-5">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Remove Time Slots
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Select Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Enter time slots, comma separated (e.g., 09:00 AM, 10:00 AM)"
                onChange={(e) =>
                  setTimeSlotsToRemove(
                    e.target.value.split(",").map((s) => s.trim())
                  )
                }
                className="mt-5 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <br />
            <button
              onClick={handleRemoveTimeSlots}
              className="w-full bg-[#007E85] text-white py-2 px-4 rounded-md font-semibold shadow-md hover:bg-blue-700"
            >
              Remove Time Slots
            </button>
          </div>
        </div>
      </div>
      <ConfirmationModal
        showModal={isConfirmModalOpen}
        message={message}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={() => {
          if (confirmationCallback) confirmationCallback();
          setIsConfirmModalOpen(false);
        }}
      />
    </div>
  );
};
export default TimeSlotForm;
