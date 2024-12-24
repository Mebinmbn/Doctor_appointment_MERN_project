import LeaveModel, { ILeave } from "../models/leaveModel";

const checkExistingLeaveApplication = async (leaveData: ILeave) => {
  return await LeaveModel.findOne({
    doctorId: leaveData.doctorId,
    startDate: leaveData.startDate,
    endDate: leaveData.endDate,
  });
};

const leaveApplication = async (leaveData: {}) => {
  try {
    const leave = new LeaveModel(leaveData);
    await leave.save();
    return leave;
  } catch (error) {
    throw new Error("Error in applying leave");
  }
};

const findAllRequests = async () => {
  const requests = await LeaveModel.find();
  console.log("requests", requests);
  return requests;
};

export default {
  leaveApplication,
  checkExistingLeaveApplication,
  findAllRequests,
};
