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
  const { selectedDate, selectedTime, formData, doctor } =
    location.state || null;
  const { user } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const toastId = "loginToContinue";
    if (!user) {
      navigate("/login");
      if (!toast.isActive(toastId)) {
        toast.warn("Login to continue", { toastId });
      }
    }
  }, [user, navigate]);

  // Load Razorpay Script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Razorpay Payment Handler
  const handleRazorpayPayment = async () => {
    const isScriptLoaded = await loadRazorpayScript();

    if (!isScriptLoaded) {
      toast.error("Failed to load Razorpay script. Please try again.");
      return;
    }

    try {
      // Step 1: Create Razorpay order
      const totalAmount =
        Math.ceil((doctor.fees * 10) / 100) + parseInt(doctor.fees); // Total Amount
      const { data } = await api.post(
        "/patients/create-order",
        {
          amount: totalAmount,
          currency: "INR",
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
        key: razorpayKey, // Accessing Razorpay key from env
        amount: data.data.amount,
        currency: data.data.currency,
        name: "Health Care",
        description: "Consultation Fees",
        order_id: data.data.id,
        handler: async function (response: any) {
          // Step 2: Verify payment
          // const verifyResponse = await api.post("/payments/verify", {
          //   razorpayPaymentId: response.razorpay_payment_id,
          //   razorpayOrderId: response.razorpay_order_id,
          //   razorpaySignature: response.razorpay_signature,
          // });

          // if (verifyResponse.data.success) {
          console.log(response);
          toast.success("Payment Successful!");

          // Step 3: Book the Appointment
          const appointmentData = {
            doctorId: doctor._id,
            patientId: formData.userId,
            date: selectedDate,
            time: selectedTime.time,
          };

          const bookingResponse = await api.post(
            "/patients/appointments/book",
            appointmentData,
            {
              headers: { "User-Type": "patient" },
            }
          );

          if (bookingResponse.data.success) {
            toast.success(
              "Appointment booked successfully. Wait for confirmation!"
            );
            navigate("/appointments"); // Navigate to appointments page
          } else {
            toast.error(bookingResponse.data.message);
          }
          // } else {
          //   toast.error("Payment verification failed.");
          // }
        },
        prefill: {
          name: user?.name,
        },
        theme: {
          color: "#007E85",
        },
      };

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
