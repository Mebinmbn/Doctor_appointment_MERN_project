import React from "react";
import Modal from "react-modal";

interface ImageModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  imageUrl: string;
}

const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  onRequestClose,
  imageUrl,
}) => {
  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} ariaHideApp={false}>
      <div className="flex items-center  justify-center min-h-screen bg-black bg-opacity-75 ">
        <div className="relative bg-[#007E85] p-4 rounded-lg">
          <button
            className="absolute top-0 right-0 font-bold border-[2px] w-12 h-8 bg-red-500 right-2 text-white font-2xl"
            onClick={onRequestClose}
          >
            close
          </button>
          <img
            src={imageUrl}
            alt="License"
            className="max-w-full max-h-screen object-contain"
          />
        </div>
      </div>
    </Modal>
  );
};

export default ImageModal;
