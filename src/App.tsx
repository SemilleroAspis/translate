import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import './App.css';

const App: React.FC = () => {
  const [language, setLanguage] = useState<string>('es');
  const [translateLanguage, setTranslateLanguage] = useState<string>('en');
  const [paragraphs, setParagraphs] = useState<string[]>([]);
  const [translatedParagraphs, setTranslatedParagraphs] = useState<string[]>([]);
  const [currentParagraph, setCurrentParagraph] = useState<string>('');
  const [currentTranslation, setCurrentTranslation] = useState<string>('');
  const [selectedFont, setSelectedFont] = useState<string>('Roboto');
  const [fontSize, setFontSize] = useState<number>(18);
  const [fontColor, setFontColor] = useState<string>('#000000');
  const [borderColor, setBorderColor] = useState<string>('#000000');
  const [fontWeight, setFontWeight] = useState<number>(400);
  const [apiKey, setApiKey] = useState<string>('');

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

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
      setParagraphs(prevParagraphs => [...prevParagraphs, transcript]);
      resetTranscript();
      setCurrentParagraph('');
    } else {
      setCurrentParagraph(transcript);
    }
    translateText(transcript); // Translate the transcript as it updates
  }, [transcript, resetTranscript]);

  const translateText = async (text: string) => {
    if (!apiKey) {
      console.error('API key is missing');
      return;
    }

    try {
      const response = await fetch(`https://script.google.com/macros/s/AKfycbxpU8VukSB2VetQDMA4BqoWFAulezTNkevklI0EAKMiHT9Sr6aU-0a2rKkuk237HXTT/exec?text=${encodeURIComponent(text)}&source=${language}&target=${translateLanguage}&key=${apiKey}`, {
        mode: 'cors'
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const translatedText = await response.text();
      setCurrentTranslation(translatedText);
    } catch (error) {
      console.error('Error translating text: ', error);
    }
  };

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  const startRecognition = () => {
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true, language: 'es-ES' });
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

  const handleFontWeightChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFontWeight(parseInt(event.target.value));
  };

  const handleApiKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(event.target.value);
  };

  return (
    <div className="App">
      <h1>Real-Time Voice Translation with Chrome</h1>
      <div className="settings">
        <div className="column">
          <div>
            <label htmlFor="api-key">API Key: </label>
            <input 
              type="text" 
              id="api-key" 
              value={apiKey} 
              onChange={handleApiKeyChange} 
            />
          </div>
          <div>
            <label htmlFor="language-select">Choose a language: </label>
            <select id="language-select" value={language} onChange={handleLanguageChange}>
              <option value="en-US">English</option>
              <option value="es-ES">Spanish</option>
              <option value="fr-FR">French</option>
              <option value="ja-JP">Japanese</option>
            </select>
          </div>
          <div>
            <label htmlFor="translate-language-select">Translate to: </label>
            <select id="translate-language-select" value={translateLanguage} onChange={handleTranslateLanguageChange}>
              <option value="es">Spanish</option>
              <option value="en-US">English</option>
              <option value="fr">French</option>
              <option value="ja">Japanese</option>
              <option value="de">German</option>
            </select>
          </div>
        </div>
        <div className="column">
          <div>
            <label htmlFor="font-select">Choose a font: </label>
            <select id="font-select" value={selectedFont} onChange={handleFontChange}>
              <option value="Roboto">Roboto</option>
              <option value="Open Sans">Open Sans</option>
              <option value="Lato">Lato</option>
              <option value="Montserrat">Montserrat</option>
              <option value="Oswald">Oswald</option>
              <option value="Source Sans Pro">Source Sans Pro</option>
            </select>
          </div>
          <div>
            <label htmlFor="font-weight">Font Weight: </label>
            <select id="font-weight" value={fontWeight.toString()} onChange={handleFontWeightChange}>
              <option value="300">Light</option>
              <option value="400">Normal</option>
              <option value="700">Bold</option>
              <option value="900">Extra Bold</option>
            </select>
          </div>
        </div>
        <div className="column">
          <div>
            <label htmlFor="font-size">Font Size: </label>
            <input 
              type="range" 
              id="font-size" 
              min="10" 
              max="40" 
              value={fontSize} 
              onChange={handleFontSizeChange} 
            />
            <span>{fontSize}px</span>
          </div>
          <div>
            <label htmlFor="font-color">Font Color: </label>
            <input 
              type="color" 
              id="font-color" 
              value={fontColor} 
              onChange={handleFontColorChange} 
            />
          </div>
          <div>
            <label htmlFor="border-color">Border Color: </label>
            <input 
              type="color" 
              id="border-color" 
              value={borderColor} 
              onChange={handleBorderColorChange} 
            />
          </div>
        </div>
      </div>
      <button onClick={startRecognition} disabled={listening}>Start Recognition</button>
      <button onClick={stopRecognition} disabled={!listening}>Stop Recognition</button>
      {listening && <p>Recording...</p>}
      <div className="transcript-container">
        <h2>Original Text</h2>
        <div 
          className="transcript-box bordered-box" 
          style={{ 
            fontFamily: selectedFont, 
            fontSize: `${fontSize}px`, 
            color: fontColor, 
            textShadow: `-1px -1px 0 ${borderColor}, 1px -1px 0 ${borderColor}, -1px 1px 0 ${borderColor}, 1px 1px 0 ${borderColor}`,
            fontWeight: fontWeight
          }}
        >
          {paragraphs.slice(-1).map((paragraph, index) => (
            <p key={index}>{paragraph.split(' ').map((word, i) => (
              <span key={i} className="highlight">{word}</span>
            ))}</p>
          ))}
          {currentParagraph && (
            <p>{currentParagraph.split(' ').map((word, i) => (
              <span key={i} className="highlight">{word}</span>
            ))}</p>
          )}
        </div>
        <h2>Translated Text</h2>
        <div 
          className="transcript-box bordered-box" 
          style={{ 
            fontFamily: selectedFont, 
            fontSize: `${fontSize}px`, 
            color: fontColor, 
            textShadow: `-1px -1px 0 ${borderColor}, 1px -1px 0 ${borderColor}, -1px 1px 0 ${borderColor}, 1px 1px 0 ${borderColor}`,
            fontWeight: fontWeight
          }}
        >
          {translatedParagraphs.slice(-2).map((paragraph, index) => (
            <p key={index}>{paragraph.split(' ').map((word, i) => (
              <span key={i} className="highlight">{word}</span>
            ))}</p>
          ))}
          {currentTranslation && (
            <p>{currentTranslation.split(' ').map((word, i) => (
              <span key={i} className="highlight">{word}</span>
            ))}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
