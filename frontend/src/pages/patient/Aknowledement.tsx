import { Link, useLocation } from "react-router-dom";
import AnimatedPaymentFailed from "../../components/Icons/AnimatedPaymentFailed";
import AnimatedPaymentSuccess from "../../components/Icons/AnimatedPaymentSuccess";
import Navbar from "../../components/patient/Navbar";

// type PaymentStatus = "success" | "failure" | null;
// interface AcknowledgmentProps {
//   paymentStatus: PaymentStatus;
// }

const Aknowledement = () => {
  const location = useLocation();
  const { paymentStatus } = location.state || null;
  return (
    <>
      {" "}
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-[#007E85]">
        <div className="bg-white text-center p-6 rounded-lg shadow-lg border-2 border-gray-300">
          {paymentStatus === "success" ? (
            <div>
              <AnimatedPaymentSuccess />
              <h2 className="text-2xl font-bold mb-4 text-green-600">
                Payment Successful
              </h2>
              <p className="text-lg">
                Thank you! Your payment has been processed successfully.
              </p>
              <p className="text-green-600 my-2">
                Your Appointment has been confirmed
              </p>
              <Link to="/appointments">
                <p className="text-blue-800">See detais</p>
              </Link>
            </div>
          ) : (
            <div>
              <AnimatedPaymentFailed />
              <h2 className="text-2xl font-bold mb-4 text-red-600">
                Payment Failed
              </h2>
              <p className="text-lg">
                We’re sorry, there was an issue with your payment. Please try
                again.
              </p>
              <Link to="/appointments">
                <p className="text-blue-800">See detais</p>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Aknowledement;
