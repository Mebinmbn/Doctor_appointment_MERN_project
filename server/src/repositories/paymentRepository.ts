import PaymentModel, { IPayment } from "../models/paymentModel";

const savePayment = async (paymentData: any) => {
  try {
    const payment = new PaymentModel(paymentData);
    await payment.save();
    return payment;
  } catch (error) {
    throw new Error("Error in saving payment");
  }
};

export default { savePayment };
