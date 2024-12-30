import React, { useState } from "react";
interface ModalProps {
  showModal: boolean;
  message: string;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

const CancelModal: React.FC<ModalProps> = ({
  showModal,
  message,
  onClose,
  onConfirm,
}) => {
  const [reason, setReason] = useState("");

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4 text-[#007E85]">Confirmation</h2>
        <p className="mb-4">{message}</p>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Reason
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Reason for Leave"
            required
          ></textarea>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400"
          >
            No
          </button>

          <button
            onClick={() => onConfirm(reason)}
            className="bg-[#007E85] text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelModal;
