import axios from 'axios';

export const detectLanguage = async (text: string): Promise<string> => {
  try {
    const response = await axios.post('https://libretranslate.de/detect', {
      q: text
    });

    if (response.data && response.data.length > 0) {
      return response.data[0].language;
    } else {
      throw new Error('No language detected');
    }
  } catch (error) {
    console.error('Error detecting language:', error);
    throw error;
  }
};
