import Razorpay from "razorpay";
import { config } from "dotenv";
import { createHmac } from "crypto";

config();

console.log("Razorpay Key ID:", process.env.RAZORPAY_KEY_ID);
console.log("Razorpay Key Secret:", process.env.RAZORPAY_KEY_SECRET);

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createOrder = async (amount: number, currency: string) => {
  console.log("payment service");
  try {
    const options = {
      amount: amount * 100,
      currency,
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpayInstance.orders.create(options);
    console.log("order", order);
    return order;
  } catch (error) {
    throw new Error("Error in creating order");
  }
};

const verify = async (
  razorpayPaymentId: string,
  razorpayOrderId: string,
  razorpaySignature: string
) => {
  try {
    const generatedSignature = createHmac(
      "sha256",
      process.env.RAZORPAY_KEY_SECRET as string
    )
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    if (generatedSignature === razorpaySignature) {
      console.log("verified");
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    throw new Error("Error in payment verification");
  }
};

export default { createOrder, verify };
