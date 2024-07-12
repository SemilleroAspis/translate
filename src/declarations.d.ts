declare global {
    interface Window {
      SpeechRecognition: typeof SpeechRecognition;
      webkitSpeechRecognition: typeof SpeechRecognition;
    }
  
    const SpeechRecognition: {
      new (): ISpeechRecognition;
    };
  
    const webkitSpeechRecognition: {
      new (): ISpeechRecognition;
    };
  
    interface ISpeechRecognition {
      lang: string;
      interimResults: boolean;
      onstart: (() => void) | null;
      onresult: ((event: SpeechRecognitionEvent) => void) | null;
      onend: (() => void) | null;
      onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
      start(): void;
      stop(): void;
    }
  
    interface SpeechRecognitionEvent {
      results: SpeechRecognitionResultList;
    }
  
    interface SpeechRecognitionResultList {
      length: number;
      item(index: number): SpeechRecognitionResult;
      [index: number]: SpeechRecognitionResult;
    }
  
    interface SpeechRecognitionResult {
      length: number;
      isFinal: boolean;
      item(index: number): SpeechRecognitionAlternative;
      [index: number]: SpeechRecognitionAlternative;
    }
  
    interface SpeechRecognitionAlternative {
      transcript: string;
      confidence: number;
    }
  
    interface SpeechRecognitionErrorEvent {
      error: string;
      message: string;
    }
  }
  
  export {};
  