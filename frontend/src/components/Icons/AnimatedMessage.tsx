import Lottie from "react-lottie";
import animatedMessage from "../../assets/icon/message.json";
function AnimatedMessage() {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animatedMessage,
    rendererSettings: { preserveAspectRatio: "xMidYMid slice" },
  };
  return <Lottie options={defaultOptions} height={50} width={50} />;
}

export default AnimatedMessage;
