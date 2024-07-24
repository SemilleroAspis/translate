import React from 'react';
import { FaMicrophone, FaStop } from 'react-icons/fa';
import '../styles/components/RecordButton.scss';

interface RecordButtonProps {
  isRecording: boolean;
  onClick: () => void;
}

const RecordButton: React.FC<RecordButtonProps> = ({ isRecording, onClick }) => {
  return (
    <button 
      className={`record-button ${isRecording ? 'recording' : ''}`} 
      onClick={onClick}
    >
      {isRecording ? <FaStop className="icon" /> : <FaMicrophone className="icon" />}
    </button>
  );
};

export default RecordButton;
