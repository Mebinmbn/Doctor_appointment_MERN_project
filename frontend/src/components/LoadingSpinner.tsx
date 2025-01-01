function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <div className="animate-spin rounded-full h-48 w-48 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
}

export default LoadingSpinner;
