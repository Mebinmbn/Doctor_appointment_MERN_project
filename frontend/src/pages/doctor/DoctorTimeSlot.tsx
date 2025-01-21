/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useCallback } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import api from "../../api/api";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { toast } from "react-toastify";
import LeaveConfirmation from "../../components/doctor/LeaveConfirmation";

const localizer = momentLocalizer(moment);

interface TimeSlots {
  date: string;
  timeSlots: {
    time: string;
    isBooked: boolean;
  }[];
}

const DoctorCalendar = () => {
  const [events, setEvents] = useState<
    { title: string; start: Date; end: Date; allDay: boolean }[]
  >([]);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [reason, setReason] = useState("");

  const doctor = useSelector((state: RootState) => state.doctor.doctor);
  const id = doctor?.id;

  const fetchDateAndTime = useCallback(async () => {
    try {
      const response = await api.get(`/doctor/timeSlots/${id}`, {
        headers: {
          "User-Type": "doctor",
        },
      });

      if (response.data.success) {
        const fetchedTimeSlots: TimeSlots[] = response.data.timeSlots;
        const calendarEvents: {
          title: string;
          start: Date;
          end: Date;
          allDay: boolean;
        }[] = [];

        const leaveResponse = await api.get(`/doctor/leaves/${id}`, {
          headers: {
            "User-Type": "doctor",
          },
        });

        const leaveApplications = leaveResponse.data.leaveApplications;

        const approvedLeaveDates = leaveApplications
          .filter((leave: any) => leave.status === "Approved")
          .map((leave: any) => ({
            start: new Date(leave.startDate),
            end: new Date(leave.endDate),
          }));

        fetchedTimeSlots.forEach((slot) => {
          const allottedDate = new Date(slot.date);

          const isLeaveApproved = approvedLeaveDates.some((leave: any) =>
            moment(allottedDate).isBetween(leave.start, leave.end, "day", "[]")
          );

          if (!isLeaveApproved) {
            calendarEvents.push({
              title: "Allotted",
              start: allottedDate,
              end: allottedDate,
              allDay: true,
            });
          }

          slot.timeSlots.forEach((timeSlot) => {
            if (timeSlot.isBooked) {
              const formattedDate = moment(slot.date).format("YYYY-MM-DD");
              const dateTimeString = `${formattedDate} ${timeSlot.time}`;
              const start = moment(
                dateTimeString,
                "YYYY-MM-DD h:mm A"
              ).toDate();

              if (!isNaN(start.getTime())) {
                const end = new Date(start.getTime() + 30 * 60 * 1000);
                calendarEvents.push({
                  title: "Booked",
                  start,
                  end,
                  allDay: false,
                });
              }
            }
          });
        });

        leaveApplications.forEach((leave: any) => {
          calendarEvents.push({
            title: `Applied for Leave - ${leave.status}`,
            start: new Date(leave.startDate),
            end: new Date(leave.endDate),
            allDay: true,
          });
        });

        setEvents(calendarEvents);
      }
    } catch (error) {
      console.error("Error fetching time slots and leave applications:", error);
    }
  }, [id]);

  useEffect(() => {
    fetchDateAndTime();
  }, [fetchDateAndTime]);

  useEffect(() => {
    console.log(events);
  }, [events]);

  const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
    const selectedStartDate = slotInfo.start;
    const selectedEndDate = slotInfo.end;

    const isAnyDayBooked = checkBookedSlots(selectedStartDate, selectedEndDate);

    if (isAnyDayBooked) {
      toast.error("You cannot apply for leave on days with booked slots.");
      return;
    }

    setStartDate(selectedStartDate);
    setEndDate(null);
    setIsLeaveModalOpen(true);
  };

  const checkBookedSlots = (startDate: Date, endDate: Date) => {
    const start = moment(startDate).startOf("day");
    const end = moment(endDate).endOf("day");

    for (let day = moment(start); day.isBefore(end); day.add(1, "days")) {
      const date = day.format("YYYY-MM-DD");

      const isBooked = events.some(
        (event) =>
          moment(event.start).format("YYYY-MM-DD") === date &&
          event.title === "Booked"
      );

      if (isBooked) {
        return true;
      }
    }

    return false;
  };

  const checkAlreadyAppliedLeave = (startDate: Date, endDate: Date) => {
    const start = moment(startDate).startOf("day");
    const end = moment(endDate).endOf("day");

    console.log(
      "Checking leave for dates:",
      start.format(),
      "to",
      end.format()
    );

    for (
      let day = moment(start);
      day.isBefore(end) || day.isSame(end, "day");
      day.add(1, "days")
    ) {
      const date = day.format("YYYY-MM-DD");
      console.log("Checking date:", date);

      const isLeaveAlreadyApplied = events.some((event) => {
        console.log("Event Title:", event.title);

        return (
          moment(event.start).format("YYYY-MM-DD") === date &&
          event.title.includes("Applied for Leave")
        );
      });

      if (isLeaveAlreadyApplied) {
        console.log("Leave already applied for date:", date);
        return true;
      }
    }

    console.log("No leave applied for the selected range");
    return false;
  };

  const applyLeave = async () => {
    if (!startDate || !endDate) {
      toast.error("Please select both start and end dates.");
      return;
    }

    if (endDate < startDate) {
      toast.error("End date cannot be earlier than start date.");
      return;
    }

    const isAnyDayBooked = checkBookedSlots(startDate, endDate);

    if (isAnyDayBooked) {
      toast.error("You cannot apply for leave on days with booked slots.");
      return;
    }

    const isLeaveAlreadyApplied = checkAlreadyAppliedLeave(startDate, endDate);

    if (isLeaveAlreadyApplied) {
      toast.error("Leave has already been applied for the selected dates.");
      return;
    }

    const formattedStartDate = moment(startDate).toISOString();
    const formattedEndDate = moment(endDate).toISOString();

    try {
      const response = await api.post(
        "doctor/leave/apply",
        {
          startDate: formattedStartDate,
          endDate: formattedEndDate,
          reason,
        },
        {
          headers: { "User-Type": "doctor" },
        }
      );

      toast.success(response.data.message);

      setEvents((prevEvents) => [
        ...prevEvents,
        {
          title: "Applied for leave",
          start: startDate,
          end: endDate,
          allDay: true,
        },
      ]);

      setIsLeaveModalOpen(false);
      setStartDate(null);
      setEndDate(null);
      setReason("");
    } catch (error) {
      console.log(error);
      toast.error("Failed to apply leave. Please try again.");
    }
  };

  return (
    <div style={{ height: "700px" }}>
      <h2>Doctor's Calendar</h2>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        selectable
        onSelectSlot={handleSelectSlot}
        eventPropGetter={(event) => ({
          className: event.title.includes("Pending")
            ? "bg-yellow-500"
            : "bg-green-500",
          style: { color: "white" },
        })}
      />
      <LeaveConfirmation
        showModal={isLeaveModalOpen}
        startDate={startDate}
        endDate={endDate}
        setEndDate={setEndDate}
        reason={reason}
        setReason={setReason}
        onClose={() => setIsLeaveModalOpen(false)}
        onConfirm={applyLeave}
      />
    </div>
  );
};

export default DoctorCalendar;
