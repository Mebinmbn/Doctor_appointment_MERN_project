import { useNavigate } from "react-router-dom";

function ErrorPage() {
  const navigte = useNavigate();
  const handleGoHome = () => {
    navigte("/");
  };

  return (
    <div className="flex items-center justify-center h-screen bg-[#007E85]">
      {" "}
      <div className="bg-white p-10 rounded-lg shadow-lg text-center">
        {" "}
        <h1 className="text-3xl font-bold text-red-500 mb-4">
          Oops! Something went wrong
        </h1>{" "}
        <p className="text-lg mb-6">
          We're sorry, but the page you requested could not be found or an error
          occurred.
        </p>{" "}
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          onClick={handleGoHome}
        >
          {" "}
          Go to Home Page{" "}
        </button>{" "}
      </div>{" "}
    </div>
  );
}

export default ErrorPage;
