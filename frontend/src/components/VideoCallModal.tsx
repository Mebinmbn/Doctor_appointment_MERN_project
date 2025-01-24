import React from "react";

interface ModalProps {
  showModal: boolean;

  onClose: () => void;
  onConfirm: () => void;
}

const VideoCallModal: React.FC<ModalProps> = ({
  showModal,

  onClose,
  onConfirm,
}) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4 text-[#007E85]">Calling...</h2>
        <p className="mb-4">Doctor Started the Call.</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400"
          >
            Reject
          </button>
          <button
            onClick={onConfirm}
            className="bg-[#007E85] text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Join
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCallModal;
