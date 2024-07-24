import React, { useState } from 'react';
import Modal from 'react-modal';
import { SketchPicker } from 'react-color';
import Button from './Button';
import '../styles/components/StyleSelector.scss'; // Corrige la ruta aquí

interface HighlightSelectorProps {
  onStyleChange: (style: any) => void;
  initialStyle: any;
}

const HighlightSelector: React.FC<HighlightSelectorProps> = ({ onStyleChange, initialStyle }) => {
  const [highlightColor, setHighlightColor] = useState<string>(initialStyle.highlightColor || '#808080');
  const [highlightOpacity, setHighlightOpacity] = useState<number>(initialStyle.highlightOpacity || 100);

  const [highlightColorModalIsOpen, setHighlightColorModalIsOpen] = useState<boolean>(false);

  const handleHighlightColorChange = (color: any) => {
    const newColor = color.hex;
    setHighlightColor(newColor);
    onStyleChange({ highlightColor: newColor, highlightOpacity });
  };

  const handleHighlightOpacityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newOpacity = parseInt(event.target.value);
    setHighlightOpacity(newOpacity);
    onStyleChange({ highlightColor, highlightOpacity: newOpacity });
  };

  return (
    <div className="style-selector">
      <div className="style-item">
        <label htmlFor="highlight-color">Highlight Color:</label>
        <div
          className="color-sample"
          style={{ backgroundColor: highlightColor }}
          onClick={() => setHighlightColorModalIsOpen(true)}
        />
        <Modal
          isOpen={highlightColorModalIsOpen}
          onRequestClose={() => setHighlightColorModalIsOpen(false)}
          contentLabel="Select Highlight Color"
          className="modal"
          overlayClassName="overlay"
        >
          <SketchPicker
            color={highlightColor}
            onChangeComplete={handleHighlightColorChange}
          />
          <Button text="Close" onClick={() => setHighlightColorModalIsOpen(false)} className="modal-close-button" />
        </Modal>
      </div>
      <div className="style-item">
        <label htmlFor="highlight-opacity">Highlight Opacity:</label>
        <div className="range-container">
        <input
          type="range"
          id="highlight-opacity"
          min="60"
          max="100"
          value={highlightOpacity}
          onChange={handleHighlightOpacityChange}
        />
        <span>{highlightOpacity}%</span>
        </div>
      </div>
    </div>
  );
};

export default HighlightSelector;
