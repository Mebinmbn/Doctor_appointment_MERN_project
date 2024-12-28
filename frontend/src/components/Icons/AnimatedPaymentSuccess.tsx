import Lottie from "react-lottie";
import PaymentSuccess from "../../assets/icon/PaymentSuccess.json";
function AnimatedPaymentSuccess() {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: PaymentSuccess,
    rendererSettings: { preserveAspectRatio: "xMidYMid slice" },
  };
  return <Lottie options={defaultOptions} height={100} width={100} />;
}

export default AnimatedPaymentSuccess;
