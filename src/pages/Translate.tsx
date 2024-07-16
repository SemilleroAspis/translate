import React, { useState, useEffect, useCallback } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import '../styles/pages/Translate.scss';
import backgroundImage from '../assets/images/7.svg';

const Translate: React.FC = () => {
  const [language, setLanguage] = useState<string>(() => localStorage.getItem('language') || 'es');
  const [translateLanguage, setTranslateLanguage] = useState<string>(() => localStorage.getItem('translateLanguage') || 'en');
  const [paragraphs, setParagraphs] = useState<string[]>([]);
  const [translatedParagraphs, setTranslatedParagraphs] = useState<string[]>([]);
  const [currentParagraph, setCurrentParagraph] = useState<string>('');
  const [currentTranslation, setCurrentTranslation] = useState<string>('');
  const [selectedFont, setSelectedFont] = useState<string>(() => localStorage.getItem('selectedFont') || 'Roboto');
  const [fontSize, setFontSize] = useState<number>(() => Number(localStorage.getItem('fontSize')) || 18);
  const [fontColor, setFontColor] = useState<string>(() => localStorage.getItem('fontColor') || '#ffffff');
  const [borderColor, setBorderColor] = useState<string>(() => localStorage.getItem('borderColor') || '#000000');
  const [highlightColor, setHighlightColor] = useState<string>(() => localStorage.getItem('highlightColor') || '#808080');
  const [highlightOpacity, setHighlightOpacity] = useState<number>(() => Number(localStorage.getItem('highlightOpacity')) || 100);
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem('apiKey') || '');
  const [fontWeight, setFontWeight] = useState<string>(() => localStorage.getItem('fontWeight') || '400');

  const {
    transcript,
    listening,
    resetTranscript,
  } = useSpeechRecognition();

  const translateText = useCallback(async (text: string) => {
    if (!apiKey) {
      console.error('API key is missing');
      return;
    }

    try {
      const response = await fetch(`https://script.google.com/macros/s/${apiKey}/exec?text=${encodeURIComponent(text)}&source=${language}&target=${translateLanguage}`, {
        mode: 'cors'
      });
      const responseBody = await response.text();

      console.log('Response Status Code:', response.status);
      console.log('Response Body:', responseBody);

      if (!response.ok || responseBody === "Missing required parameters.") {
        throw new Error(`Network response was not ok: ${response.status} - ${responseBody}`);
      }

      setCurrentTranslation(responseBody);
    } catch (error) {
      console.error('Error translating text: ', error);
    }
  }, [apiKey, language, translateLanguage]);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Tu navegador no soporta el reconocimiento de voz.');
    }
  }, []);

  useEffect(() => {
    const requestMicrophonePermission = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        console.log('Microphone access granted.');
      } catch (error) {
        console.error('Error accessing microphone:', error);
        if (error instanceof Error) {
          if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
            alert('Microphone access was not allowed. Please check your browser settings.');
          }
        }
      }
    };

    requestMicrophonePermission();
  }, []);

  useEffect(() => {
    if (listening) {
      console.log('Recognition started');
    } else {
      console.log('Recognition stopped');
    }
  }, [listening]);

  useEffect(() => {
    console.log('Transcript updated: ', transcript);
    const words = transcript.split(' ');

    if (words.length >= 20) {
      setParagraphs([transcript]); // Limpiar la línea anterior y mostrar solo la nueva
      resetTranscript();
      setCurrentParagraph('');
    } else {
      setCurrentParagraph(transcript);
    }
    translateText(transcript); // Translate the transcript as it updates
  }, [transcript, resetTranscript, translateText]);

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  const startRecognition = () => {
    if (!apiKey) {
      alert('Please enter your API key before starting the recognition.');
      return;
    }
    localStorage.setItem('apiKey', apiKey);
    localStorage.setItem('language', language);
    localStorage.setItem('translateLanguage', translateLanguage);
    localStorage.setItem('selectedFont', selectedFont);
    localStorage.setItem('fontSize', fontSize.toString());
    localStorage.setItem('fontColor', fontColor);
    localStorage.setItem('borderColor', borderColor);
    localStorage.setItem('highlightColor', highlightColor);
    localStorage.setItem('highlightOpacity', highlightOpacity.toString());
    localStorage.setItem('fontWeight', fontWeight);
    
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true, language: language })
      .catch(error => {
        console.error('Error starting recognition:', error);
        if (error instanceof Error) {
          if (error.name === 'not-allowed') {
            alert('Microphone access was not allowed. Please check your browser settings.');
          }
        }
      });
    console.log('Started listening with language: ', language);
  };

  const stopRecognition = () => {
    SpeechRecognition.stopListening();
    console.log('Stopped listening');
  };

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(event.target.value);
    console.log('Language changed to: ', event.target.value);
  };

  const handleTranslateLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTranslateLanguage(event.target.value);
    console.log('Translate language changed to: ', event.target.value);
  };

  const handleFontChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFont(event.target.value);
    console.log('Font changed to: ', event.target.value);
  };

  const handleFontSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFontSize(parseInt(event.target.value));
  };

  const handleFontColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFontColor(event.target.value);
  };

  const handleBorderColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBorderColor(event.target.value);
  };

  const handleHighlightColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHighlightColor(event.target.value);
    localStorage.setItem('highlightColor', event.target.value);
  };

  const handleHighlightOpacityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const opacity = parseInt(event.target.value);
    setHighlightOpacity(opacity);
    localStorage.setItem('highlightOpacity', opacity.toString());
  };

  const handleApiKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(event.target.value);
    console.log('API Key set:', event.target.value);
  };

  const handleFontWeightChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFontWeight(event.target.value);
    localStorage.setItem('fontWeight', event.target.value);
  };

  const applyFontStyle = () => {
    return {
      fontFamily: selectedFont,
      fontSize: `${fontSize}px`,
      color: fontColor,
      textShadow: `-1px -1px 0 ${borderColor}, 1px -1px 0 ${borderColor}, -1px 1px 0 ${borderColor}, 1px 1px 0 ${borderColor}`,
      fontWeight: fontWeight,
    };
  };

  const applyHighlightStyle = () => {
    return {
      backgroundColor: `${highlightColor}${Math.round(highlightOpacity / 100 * 255).toString(16).padStart(2, '0')}`,
      padding: '2px',
      borderRadius: '4px',
      lineHeight: '1.5'
    };
  };

  return (
    <div className="Title" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <h1>Real-Time Voice Translation for OBS</h1>
      <div className="settings">
        <div className="column">
          <div>
            <label className="Subtitle" htmlFor="api-key">API Key: </label>
            <input 
              className='inputKey'
              type="text" 
              id="api-key" 
              value={apiKey} 
              onChange={handleApiKeyChange} 
            />
          </div>
          <div>
            <label className='Subtitle' htmlFor="language-select">Choose a language: </label>
            <select className='inputKey' id="language-select" value={language} onChange={handleLanguageChange}>
              <option value="en-US">English</option>
              <option value="es-ES">Spanish</option>
              <option value="fr-FR">French</option>
              <option value="ja-JP">Japanese</option>
            </select>
          </div>
          <div>
            <label className='Subtitle' htmlFor="translate-language-select">Translate to: </label>
            <select className='inputKey' id="translate-language-select" value={translateLanguage} onChange={handleTranslateLanguageChange}>
              <option value="es">Spanish</option>
              <option value="en-US">English</option>
              <option value="fr">French</option>
              <option value="ja">Japanese</option>
              <option value="de">German</option>
            </select>
          </div>
        </div>
        <div className="column center">
          <div>
            <label className='Subtitle' htmlFor="font-select">Choose a font: </label>
            <select className='inputKey' id="font-select" value={selectedFont} onChange={handleFontChange}>
              <option value="Roboto">Roboto</option>
              <option value="Open Sans">Open Sans</option>
              <option value="Lato">Lato</option>
              <option value="Montserrat">Montserrat</option>
              <option value="Oswald">Oswald</option>
              <option value="Source Sans Pro">Source Sans Pro</option>
            </select>
          </div>
          <div>
            <label className='Subtitle' htmlFor="font-size">Font Size: </label>
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
          <div>
            <label className='Subtitle' htmlFor="font-weight">Font Weight: </label>
            <select className='inputKey' id="font-weight" value={fontWeight} onChange={handleFontWeightChange}>
              <option value="400">Normal</option>
              
              <option value="600">Bold</option>
              
            </select>
          </div>
        </div>
        <div className="column right">
          <div>
            <label className='Subtitle' htmlFor="font-color">Font Color: </label>
            <input 
              type="color" 
              id="font-color" 
              value={fontColor} 
              onChange={handleFontColorChange} 
            />
          </div>
          <div>
            <label className='Subtitle' htmlFor="border-color">Border Color: </label>
            <input 
              type="color" 
              id="border-color" 
              value={borderColor} 
              onChange={handleBorderColorChange} 
            />
          </div>
          <div>
            <label className='Subtitle' htmlFor="highlight-color">Highlight Color: </label>
            <input 
              type="color" 
              id="highlight-color" 
              value={highlightColor} 
              onChange={handleHighlightColorChange} 
            />
          </div>
          <div>
            <label className='Subtitle' htmlFor="highlight-opacity">Highlight Opacity: </label>
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
      <button onClick={startRecognition} disabled={listening}>Start Recognition</button>
      <button onClick={stopRecognition} disabled={!listening}>Stop Recognition</button>
      {listening && <p className='Subtitle'>Recording...</p>}
      <div className="transcript-container">
        <h2>Original Text</h2>
        <div 
          className="transcript-box bordered-box" 
          style={applyFontStyle()}
        >
          {paragraphs.length > 0 && (
            <p>{paragraphs[paragraphs.length - 1].split(' ').map((word, i) => (
              <span key={i} style={applyHighlightStyle()}>{word}</span>
            ))}</p>
          )}
          {currentParagraph && (
            <p>{currentParagraph.split(' ').map((word, i) => (
              <span key={i} style={applyHighlightStyle()}>{word}</span>
            ))}</p>
          )}
        </div>
        <h2>Translated Text</h2>
        <div 
          className="transcript-box bordered-box" 
          style={applyFontStyle()}
        >
          {translatedParagraphs.length > 0 && (
            <p>{translatedParagraphs[translatedParagraphs.length - 1].split(' ').map((word, i) => (
              <span key={i} style={applyHighlightStyle()}>{word}</span>
            ))}</p>
          )}
          {currentTranslation && (
            <p>{currentTranslation.split(' ').map((word, i) => (
              <span key={i} style={applyHighlightStyle()}>{word}</span>
            ))}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Translate;
