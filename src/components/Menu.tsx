import React, { useState, useRef, useEffect } from 'react';
import { FaLanguage, FaFont, FaPalette, FaPaperPlane, FaHighlighter } from 'react-icons/fa';
import keyIcon from '../assets/images/key.svg'; // Asegúrate de que la ruta sea correcta
import Button from './Button';
import '../styles/components/menu.scss';
import FontSelector from './FontSelector';
import StyleSelector from './StyleSelector';
import RecordButton from './RecordButton';
import HighlightSelector from './HighligthSelector';


const menuItems = [
  { icon: <img src={keyIcon} alt="key icon" className="icon" />, text: 'API Key' },
  { icon: <FaLanguage className="icon" />, text: 'Choose Language' },
  { icon: <FaLanguage className="icon" />, text: 'Translate To' },
  { icon: <FaFont className="icon" />, text: 'Choose Font' },
  { icon: <FaPalette className="icon" />, text: 'Style' },
  { icon: <FaHighlighter className="icon" />, text: 'Highlight' },
];

interface MenuProps {
  onStartRecording: () => void;
  onStopRecording: () => void;
  isRecording: boolean;
  onStyleChange: (style: any) => void;
  onHighlightChange: (highlight: any) => void;
  onApiKeyChange: (apiKey: string) => void;
  onLanguageChange: (language: string) => void;
  onTranslateLanguageChange: (translateLanguage: string) => void;
  onFontChange: (fontFamily: string) => void;
}

const Menu: React.FC<MenuProps> = ({ 
  onStartRecording, 
  onStopRecording, 
  isRecording, 
  onStyleChange, 
  onHighlightChange, 
  onApiKeyChange, 
  onLanguageChange, 
  onTranslateLanguageChange,
  onFontChange 
}) => {
  const [selectedMenuItem, setSelectedMenuItem] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string>(localStorage.getItem('apiKey') || '');
  const [preferredLanguage, setPreferredLanguage] = useState<string>(localStorage.getItem('preferredLanguage') || '');
  const [alternateLanguage, setAlternateLanguage] = useState<string>(localStorage.getItem('alternateLanguage') || '');
  const [preferredTranslate, setPreferredTranslate] = useState<string>(localStorage.getItem('preferredTranslate') || '');
  const [alternateTranslate, setAlternateTranslate] = useState<string>(localStorage.getItem('alternateTranslate') || '');
  const [selectedFont, setSelectedFont] = useState<string>(localStorage.getItem('selectedFont') || '');
  const [style, setStyle] = useState<any>({
    fontSize: localStorage.getItem('fontSize') || '16',
    fontWeight: localStorage.getItem('fontWeight') || '400',
    fontColor: localStorage.getItem('fontColor') || '#000000',
    borderColor: localStorage.getItem('borderColor') || '#000000'
  });

  const [highlight, setHighlight] = useState<any>({
    highlightColor: localStorage.getItem('highlightColor') || '#808080',
    highlightOpacity: localStorage.getItem('highlightOpacity') || 100
  });

  const menuItemsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    menuItemsRef.current.forEach((item, index) => {
      if (item) {
        const icon = item.querySelector('.icon') as HTMLElement;
        const text = item.querySelector('.menu-text') as HTMLElement;
        const iconWidth = icon.getBoundingClientRect().width;
        const textWidth = text.scrollWidth;
        const totalWidth = iconWidth + textWidth + 30;

        item.addEventListener('mouseenter', () => {
          item.style.width = `${totalWidth}px`;
        });

        item.addEventListener('mouseleave', () => {
          if (selectedMenuItem !== menuItems[index].text) {
            item.style.width = '50px';
          }
        });

        if (selectedMenuItem === menuItems[index].text) {
          item.style.width = `${totalWidth}px`;
        }
      }
    });
  }, [selectedMenuItem]);

  const handleMenuClick = (text: string) => {
    setSelectedMenuItem(selectedMenuItem === text ? null : text);
  };

  const handleAcceptClick = (inputValue: string) => {
    if (selectedMenuItem === 'API Key') {
      localStorage.setItem('apiKey', inputValue);
      setApiKey(inputValue);
      onApiKeyChange(inputValue);
    } else if (selectedMenuItem === 'Choose Language') {
      localStorage.setItem('preferredLanguage', preferredLanguage);
      localStorage.setItem('alternateLanguage', alternateLanguage);
      onLanguageChange(preferredLanguage);
    } else if (selectedMenuItem === 'Translate To') {
      localStorage.setItem('preferredTranslate', preferredTranslate);
      localStorage.setItem('alternateTranslate', alternateTranslate);
      onTranslateLanguageChange(preferredTranslate);
    } else if (selectedMenuItem === 'Choose Font') {
      localStorage.setItem('selectedFont', selectedFont);
      onFontChange(selectedFont);
    }
    setSelectedMenuItem(null);
  };

  const handleFontChange = (fontFamily: string) => {
    setSelectedFont(fontFamily);
    localStorage.setItem('selectedFont', fontFamily);
    console.log('Font changed to:', fontFamily);
    onFontChange(fontFamily);
  };

  const handleStyleChange = (newStyle: any) => {
    setStyle(newStyle);
    localStorage.setItem('fontSize', newStyle.fontSize);
    localStorage.setItem('fontWeight', newStyle.fontWeight);
    localStorage.setItem('fontColor', newStyle.fontColor);
    localStorage.setItem('borderColor', newStyle.borderColor);
    onStyleChange(newStyle);
  };

  const handleHighlightChange = (newHighlight: any) => {
    setHighlight(newHighlight);
    localStorage.setItem('highlightColor', newHighlight.highlightColor);
    localStorage.setItem('highlightOpacity', newHighlight.highlightOpacity);
    onHighlightChange(newHighlight);
  };

  const handleRecordButtonClick = () => {
    if (isRecording) {
      onStopRecording();
    } else {
      onStartRecording();
    }
  };

  return (
    <div className="menu-container">
      <div className="menu">
        {menuItems.map((item, index) => (
          <div
            key={index}
            className={`menu-item ${selectedMenuItem === item.text ? 'selected' : ''}`}
            ref={el => menuItemsRef.current[index] = el!}
            onClick={() => handleMenuClick(item.text)}
          >
            {item.icon}
            <span className="menu-text">{item.text}</span>
          </div>
        ))}
        <div className="record-button-container">
          <RecordButton isRecording={isRecording} onClick={handleRecordButtonClick} />
        </div>

        {selectedMenuItem && (
          <div className={`menu-content ${selectedMenuItem.replace(/\s/g, '').toLowerCase()}`}>
            <h2>{selectedMenuItem}</h2>
            {selectedMenuItem === 'API Key' && (
              <div>
                <h3 className='prefered'>Enter your API Key:</h3>
                <input type="text" id="apikey-input" defaultValue={apiKey} />
                <Button
                  icon={<FaPaperPlane />}
                  text="Aceptar"
                  onClick={() => handleAcceptClick((document.getElementById('apikey-input') as HTMLInputElement).value)}
                  className="accept-button"
                />
              </div>
            )}
            {selectedMenuItem === 'Choose Language' && (
              <div className="language-selection">
                <div className="dropdown-container">
                  <div className='dropdown-columnr'>
                    <h3 className='prefered'>Preferred Language:</h3>
                    <select value={preferredLanguage} onChange={(e) => setPreferredLanguage(e.target.value)}>
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      {/* Agrega más opciones de idioma según sea necesario */}
                    </select>
                  </div>
                  <div className='dropdown-columnl'>
                    <h3 className='prefered'>Alternate Language:</h3>
                    <select value={alternateLanguage} onChange={(e) => setAlternateLanguage(e.target.value)}>
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      {/* Agrega más opciones de idioma según sea necesario */}
                    </select>
                  </div>
                </div>
                <div className="button-container">
                  <Button
                    text="Aceptar"
                    onClick={() => handleAcceptClick('')}
                    className="accept-button"
                  />
                </div>
              </div>
            )}
            {selectedMenuItem === 'Translate To' && (
              <div className="language-selection">
                <div className="dropdown-container">
                  <div className='dropdown-columnr'>
                    <h3 className='prefered'>Preferred Translate:</h3>
                    <select value={preferredTranslate} onChange={(e) => setPreferredTranslate(e.target.value)}>
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="it">Italian</option>
                      {/* Agrega más opciones de idioma según sea necesario */}
                    </select>
                  </div>
                  <div className='dropdown-columnl'>
                    <h3 className='prefered'>Alternate Translate:</h3>
                    <select value={alternateTranslate} onChange={(e) => setAlternateTranslate(e.target.value)}>
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="it">Italian</option>
                      {/* Agrega más opciones de idioma según sea necesario */}
                    </select>
                  </div>
                </div>
                <div className="button-container">
                  <Button
                    text="Aceptar"
                    onClick={() => handleAcceptClick('')}
                    className="accept-button"
                  />
                </div>
              </div>
            )}
            {selectedMenuItem === 'Choose Font' && (
              <FontSelector onFontChange={handleFontChange} />
            )}
            {selectedMenuItem === 'Style' && (
              <StyleSelector onStyleChange={handleStyleChange} initialStyle={style} />
            )}
            {selectedMenuItem === 'Highlight' && (
              <HighlightSelector onStyleChange={handleHighlightChange} initialStyle={highlight} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Menu;
