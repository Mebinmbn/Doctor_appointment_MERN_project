import DoctorModel, { IDoctor } from "../models/doctorModel";
import TimeSlotsModel from "../models/timeSlotsModel";
import cron from "node-cron";

const defaultTimeSlots = [
  { time: "9:00 AM", isBooked: false },
  { time: "9:30 AM", isBooked: false },
  { time: "10:00 AM", isBooked: false },
  { time: "10:30 AM", isBooked: false },
  { time: "11:00 AM", isBooked: false },
  { time: "11:30 AM", isBooked: false },
  { time: "1:00 PM", isBooked: false },
  { time: "1:30 PM", isBooked: false },
  { time: "2:00 PM", isBooked: false },
  { time: "2:30 PM", isBooked: false },
  { time: "3:00 PM", isBooked: false },
  { time: "3:30 PM", isBooked: false },
  { time: "4:00 PM", isBooked: false },
  { time: "4:30 PM", isBooked: false },
];

export const createNewTimeSlotRecord = async () => {
  try {
    // Get the date six days ahead
    const today = new Date();
    const sixDaysAhead = new Date(today);
    console.log(sixDaysAhead);
    sixDaysAhead.setDate(today.getDate() + 6);

    sixDaysAhead.setHours(0, 0, 0, 0);
    console.log(sixDaysAhead);

    if (sixDaysAhead.toString().slice(0, 3) !== "Sun") {
      // Fetch all doctors
      const doctors: IDoctor[] = await DoctorModel.find();

      for (const doctor of doctors) {
        // Check if the record already exists
        const existingRecord = await TimeSlotsModel.findOne({
          doctor: doctor._id,
          date: sixDaysAhead,
        });
        if (!existingRecord) {
          // Create a new record
          const newTimeSlot = new TimeSlotsModel({
            doctor: doctor._id,
            date: sixDaysAhead,
            timeSlots: defaultTimeSlots,
          });

          await newTimeSlot.save();
          console.log(
            `Time slots for Dr. ${
              doctor.firstName
            } on ${sixDaysAhead.toDateString()} created successfully.`
          );
        } else {
          console.log(
            `Time slots for Dr. ${
              doctor.firstName
            } on ${sixDaysAhead.toDateString()} already exist.`
          );
        }
      }
    } else {
      console.log("Times slot didn't create due to sunday");
    }
  } catch (error) {
    console.error("Error creating time slot record:", error);
  }
};

cron.schedule("0 0 * * *", async () => {
  console.log("Fetching doctors at midnight daily...");
  await createNewTimeSlotRecord();
});
