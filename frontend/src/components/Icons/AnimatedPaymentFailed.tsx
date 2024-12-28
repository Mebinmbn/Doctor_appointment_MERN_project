import Lottie from "react-lottie";
import PaymentFailed from "../../assets/icon/PaymentFailed.json";

function AnimatedPaymentFailed() {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: PaymentFailed,
    rendererSettings: { preserveAspectRatio: "xMidYMid slice" },
  };
  return <Lottie options={defaultOptions} height={100} width={100} />;
}

export default AnimatedPaymentFailed;
