import React, { useState } from 'react';
import Modal from 'react-modal';
import { SketchPicker } from 'react-color';
import Button from './Button';
import '../styles/components/StyleSelector.scss';

interface StyleSelectorProps {
  onStyleChange: (style: any) => void;
  initialStyle: any;
}

const StyleSelector: React.FC<StyleSelectorProps> = ({ onStyleChange, initialStyle }) => {
  const [fontSize, setFontSize] = useState<number>(parseInt(initialStyle.fontSize) || 16);
  const [fontWeight, setFontWeight] = useState<string>(initialStyle.fontWeight || '400');
  const [fontColor, setFontColor] = useState<string>(initialStyle.fontColor || '#000000');
  const [borderColor, setBorderColor] = useState<string>(initialStyle.borderColor || '#000000');

  const [fontColorModalIsOpen, setFontColorModalIsOpen] = useState<boolean>(false);
  const [borderColorModalIsOpen, setBorderColorModalIsOpen] = useState<boolean>(false);

  const handleFontSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = parseInt(event.target.value);
    setFontSize(newSize);
    onStyleChange({ fontSize: newSize, fontWeight, fontColor, borderColor });
  };

  const handleFontWeightChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newWeight = event.target.value;
    setFontWeight(newWeight);
    onStyleChange({ fontSize, fontWeight: newWeight, fontColor, borderColor });
  };

  const handleFontColorChange = (color: any) => {
    const newColor = color.hex;
    setFontColor(newColor);
    onStyleChange({ fontSize, fontWeight, fontColor: newColor, borderColor });
  };

  const handleBorderColorChange = (color: any) => {
    const newColor = color.hex;
    setBorderColor(newColor);
    onStyleChange({ fontSize, fontWeight, fontColor, borderColor: newColor });
  };

  return (
    <div className="style-selector">
      <div className="style-item">
        <label htmlFor="font-size">Font Size:</label>
        <div className="range-container">
          <input
            type="range"
            id="font-size"
            min="10"
            max="30"
            value={fontSize}
            onChange={handleFontSizeChange}
          />
          <span>{fontSize}px</span>
        </div>
      </div>
      <div className="style-item">
        <label htmlFor="font-weight">Font Weight:</label>
        <select id="font-weight" value={fontWeight} onChange={handleFontWeightChange}>
          <option value="300">Light</option>
          <option value="400">Normal</option>
          <option value="500">Medium</option>
          <option value="600">Semi Bold</option>
          <option value="700">Bold</option>
        </select>
      </div>
      <div className="style-item">
        <label htmlFor="font-color">Font Color:</label>
        <div
          className="color-sample"
          style={{ backgroundColor: fontColor }}
          onClick={() => setFontColorModalIsOpen(true)}
        />
        <Modal
          isOpen={fontColorModalIsOpen}
          onRequestClose={() => setFontColorModalIsOpen(false)}
          contentLabel="Select Font Color"
          className="modal"
          overlayClassName="overlay"
        >
          <SketchPicker
            color={fontColor}
            onChangeComplete={handleFontColorChange}
          />
          <Button text="Close" onClick={() => setFontColorModalIsOpen(false)} className="modal-close-button" />
        </Modal>
      </div>
      <div className="style-item">
        <label htmlFor="border-color">Border Color:</label>
        <div
          className="color-sample"
          style={{ backgroundColor: borderColor }}
          onClick={() => setBorderColorModalIsOpen(true)}
        />
        <Modal
          isOpen={borderColorModalIsOpen}
          onRequestClose={() => setBorderColorModalIsOpen(false)}
          contentLabel="Select Border Color"
          className="modal"
          overlayClassName="overlay"
        >
          <SketchPicker
            color={borderColor}
            onChangeComplete={handleBorderColorChange}
          />
          <Button text="Close" onClick={() => setBorderColorModalIsOpen(false)} className="modal-close-button" />
        </Modal>
      </div>
    </div>
  );
};

export default StyleSelector;
