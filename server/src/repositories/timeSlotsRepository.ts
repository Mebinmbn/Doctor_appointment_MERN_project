import TimeSlotsModel, { ITimeSlots } from "../models/timeSlotsModel";

const createNewTimeSlotRecord = async (doctorId: string, slots: any) => {
  try {
    const timeSlots = slots.map((slot: any) => ({
      doctor: doctorId,
      date: new Date(slot.date),
      timeSlots: slot.timeSlots.map((timeSlot: any) => ({
        time: timeSlot.time,
        isBooked: false,
      })),
    }));
    console.log("time slots", timeSlots);
    const timeSlotsRecord = await TimeSlotsModel.insertMany(timeSlots);

    return timeSlotsRecord;
  } catch (error) {
    throw new Error("Error in creating time slots");
  }
};

export default { createNewTimeSlotRecord };
