import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import Navbar from "../../components/patient/Navbar";
import api from "../../api/api";
import razorpay from "../../assets/razorpay.png";

function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedDate, selectedTime, formData, doctor, patientId } =
    location.state || null;
  const { user } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (
      location.state === null ||
      selectedDate === null ||
      selectedTime === null ||
      doctor === null
    ) {
      navigate("/doctors", { replace: true });
      toast.warn("Invalid access to payment page");
    }
  }, [location.state, selectedDate, selectedTime, doctor, navigate]);

  const unlockTimSlot = async () => {
    const response = await api.put(
      "/patients/appointments/lockTimeSlot",
      {
        doctorId: doctor?._id,
        date: selectedDate,
        time: selectedTime.time,
        status: "false",
      },
      {
        headers: {
          "User-Type": "patient",
        },
      }
    );
    console.log(response.data);
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve, reject) => {
      if (
        document.querySelector(
          'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
        )
      ) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () =>
        reject(new Error("Failed to load Razorpay script"));
      document.body.appendChild(script);
    });
  };

  const handleRazorpayPayment = async () => {
    const isScriptLoaded = await loadRazorpayScript();

    if (!isScriptLoaded) {
      toast.error("Failed to load Razorpay script. Please try again.");
      return;
    }
    const timeSlot = {
      doctorId: doctor.id,
      date: selectedDate,
      time: selectedTime,
    };
    try {
      const totalAmount =
        Math.ceil((doctor.fees * 10) / 100) + parseInt(doctor.fees);
      const { data } = await api.post(
        "/patients/payments/create-order",
        {
          amount: totalAmount,
          currency: "INR",
          timeSlot,
        },
        {
          headers: { "User-Type": "patient" },
        }
      );

      console.log(data.data);

      const razorpayKey = "rzp_test_xnsJNuDLxrH6xO";

      if (!razorpayKey) {
        throw new Error("Razorpay Key is missing in environment variables");
      }

      const options = {
        key: razorpayKey,
        amount: data.data.amount,
        currency: data.data.currency,
        name: "Health Care",
        description: "Consultation Fees",
        order_id: data.data.id,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        handler: async function (response: any) {
          const verifyResponse = await api.post(
            "patients/payments/verify",
            {
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
            },
            {
              headers: { "User-Type": "patient" },
            }
          );

          if (verifyResponse.data.success) {
            console.log(response);
            toast.success("Payment Successful!");

            const appointmentData = {
              doctorId: doctor._id,
              userId: formData.userId,
              patientId: patientId,
              date: selectedDate,
              time: selectedTime.time,
              payment: "paid",
              paymentId: response.razorpay_payment_id,
              amount: totalAmount,
            };

            const bookingResponse = await api.post(
              "/patients/appointments/book",
              appointmentData,
              {
                headers: { "User-Type": "patient" },
              }
            );

            if (bookingResponse.data.success) {
              navigate("/aknowledgement", {
                state: { paymentStatus: "success" },
                replace: true,
              });
            } else {
              toast.error(bookingResponse.data.message);
            }
          } else {
            unlockTimSlot();
            toast.error("Your payment failed. Please try again");
            navigate("/doctors");
          }
        },
        prefill: {
          name: user?.name,
        },
        theme: {
          color: "#007E85",
        },
        modal: {
          ondismiss: function () {
            unlockTimSlot();
            toast.error("Payment process was canceled.");

            navigate("/doctors", { replace: true });
          },
        },
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.log(error);
      toast.error("An error occurred during payment. Please try again.");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="payment_page_continer w-[80vw] bg-gray-200 p-5 mt-5 h-screen mx-auto">
        <p className="font-extrabold text-3xl text-[#007E85] ">Payment</p>
        <div className="flex mt-5 w-full ">
          <div className="w-full mr-5 border-2 p-3 rounded-lg border-[#007E85] text-right">
            <div className="flex gap-10 items-center mt-10 border-2 border-green-800 rounded-lg p-5">
              <div>
                <input
                  type="radio"
                  name="paymentMethod"
                  id="payment-method-3"
                  value="Online"
                />
                <label className="ms-3">
                  <strong className="">Pay with Razorpay</strong>
                </label>
              </div>
              <img src={razorpay} alt="Razorpay image" className="w-32" />
            </div>
            <button
              onClick={handleRazorpayPayment}
              className="bg-[#007E85] rounded-lg px-10 py-3 text-white w-fit font-bold mt-20 hover:bg-green-800"
            >
              Pay ₹{Math.ceil((doctor.fees * 10) / 100) + parseInt(doctor.fees)}
            </button>
          </div>

          <div className="payment_details p-3 border-2 h-72 w-96 rounded-lg ml-auto mr-8 border-[#007E85]">
            <p className="font-bold text-center mb-5">Payment Details</p>
            <table className="">
              <tr>
                <td className="w-23">Doctor</td>
                <td className="w-5">:</td>
                <td>
                  {doctor.firstName} {doctor.lastName}
                </td>
              </tr>
              <tr>
                <td>Consultation Date</td>
                <td>:</td>
                <td>{selectedDate.toString().slice(0, 10)}</td>
              </tr>
              <tr>
                <td>Consultation Time</td>
                <td>:</td>
                <td>{selectedTime.time}</td>
              </tr>
              <tr>
                <td>Consultation Fees</td>
                <td>:</td>
                <td>₹ {doctor.fees}</td>
              </tr>
              <tr>
                <td>Booking charge</td>
                <td>:</td>
                <td>₹ {Math.ceil((doctor.fees * 10) / 100)}</td>
              </tr>
              <tr>
                <td colSpan={3} className="text-gray-500">
                  ______________________________________________________
                </td>
              </tr>
              <tr className="font-bold ">
                <td>Total Amount to Pay</td>
                <td>:</td>
                <td>
                  ₹{Math.ceil((doctor.fees * 10) / 100) + parseInt(doctor.fees)}
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;
