import React, { useState, useEffect, useCallback } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import '../styles/pages/Translate.scss';
import backgroundImage from '../assets/images/7.svg';
import Menu from '../components/Menu';

const Translate: React.FC = () => {
  const [preferredLanguage, setPreferredLanguage] = useState<string>(() => localStorage.getItem('preferredLanguage') || 'es');
  const [preferredTranslate, setPreferredTranslate] = useState<string>(() => localStorage.getItem('preferredTranslate') || 'en');
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
      const response = await fetch(`https://script.google.com/macros/s/${apiKey}/exec?text=${encodeURIComponent(text)}&source=${preferredLanguage}&target=${preferredTranslate}`, {
        mode: 'cors'
      });
      const responseBody = await response.text();

      if (!response.ok || responseBody === "Missing required parameters.") {
        throw new Error(`Network response was not ok: ${response.status} - ${responseBody}`);
      }

      setCurrentTranslation(responseBody);
    } catch (error) {
      console.error('Error translating text: ', error);
    }
  }, [apiKey, preferredLanguage, preferredTranslate]);

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
    const detectAndTranslate = async () => {
      const words = transcript.split(' ');

      if (words.length >= 20) {
        setParagraphs([transcript]);
        resetTranscript();
        setCurrentParagraph('');
      } else {
        setCurrentParagraph(transcript);
      }

      translateText(transcript);
    };

    if (transcript) {
      detectAndTranslate();
    }
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
    localStorage.setItem('preferredLanguage', preferredLanguage);
    localStorage.setItem('preferredTranslate', preferredTranslate);
    localStorage.setItem('selectedFont', selectedFont);
    localStorage.setItem('fontSize', fontSize.toString());
    localStorage.setItem('fontColor', fontColor);
    localStorage.setItem('borderColor', borderColor);
    localStorage.setItem('highlightColor', highlightColor);
    localStorage.setItem('highlightOpacity', highlightOpacity.toString());
    localStorage.setItem('fontWeight', fontWeight);
    
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true, language: preferredLanguage })
      .catch(error => {
        console.error('Error starting recognition:', error);
        if (error instanceof Error) {
          if (error.name === 'not-allowed') {
            alert('Microphone access was not allowed. Please check your browser settings.');
          }
        }
      });
    console.log('Started listening with language: ', preferredLanguage);
  };

  const stopRecognition = () => {
    SpeechRecognition.stopListening();
    setParagraphs([]);
    setTranslatedParagraphs([]);
    setCurrentParagraph('');
    setCurrentTranslation('');
    console.log('Stopped listening and cleared text fields');
  };

  const handleStyleChange = (newStyle: any) => {
    setFontSize(newStyle.fontSize || fontSize);
    setFontWeight(newStyle.fontWeight || fontWeight);
    setFontColor(newStyle.fontColor || fontColor);
    setBorderColor(newStyle.borderColor || borderColor);
  };

  const handleHighlightChange = (newHighlight: any) => {
    setHighlightColor(newHighlight.highlightColor || highlightColor);
    setHighlightOpacity(newHighlight.highlightOpacity || highlightOpacity);
  };

  const handleApiKeyChange = (apiKey: string) => {
    setApiKey(apiKey);
  };

  const handleLanguageChange = (language: string) => {
    setPreferredLanguage(language);
  };

  const handleTranslateLanguageChange = (translateLanguage: string) => {
    setPreferredTranslate(translateLanguage);
  };

  const handleFontChange = (fontFamily: string) => {
    setSelectedFont(fontFamily);
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
      <Menu 
        onStartRecording={startRecognition}
        onStopRecording={stopRecognition}
        isRecording={listening}
        onStyleChange={handleStyleChange}
        onHighlightChange={handleHighlightChange} // Pasar el manejador de cambio de resaltado
        onApiKeyChange={handleApiKeyChange}
        onLanguageChange={handleLanguageChange}
        onTranslateLanguageChange={handleTranslateLanguageChange}
        onFontChange={handleFontChange}
      />
      
    </div>
  );
}

export default Translate;
