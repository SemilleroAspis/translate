import React, { useState, useEffect } from 'react';
import '../styles/components/FontSelector.scss';

const GOOGLE_FONTS_API = 'https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyD8cuJrKzxeVBjErAFKJRlpQiSHJr4kMLU';

interface FontSelectorProps {
  onFontChange: (fontFamily: string) => void;
}

const FontSelector: React.FC<FontSelectorProps> = ({ onFontChange }) => {
  const [fonts, setFonts] = useState<string[]>([]);
  const [filteredFonts, setFilteredFonts] = useState<string[]>([]);
  const [selectedFont, setSelectedFont] = useState<string>(localStorage.getItem('selectedFont') || 'Roboto');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const recommendedFonts = [
    'Roboto',
    'Open Sans',
    'Lato',
    'Montserrat',
    'Oswald',
    'Source Sans Pro'
  ];

  useEffect(() => {
    fetch(GOOGLE_FONTS_API)
      .then(response => response.json())
      .then(data => {
        const fontList = data.items.map((item: any) => item.family);
        setFonts(fontList);
        setFilteredFonts(fontList);
      })
      .catch(error => console.error('Error fetching Google Fonts:', error));

    const storedFont = localStorage.getItem('selectedFont');
    if (storedFont) {
      setSelectedFont(storedFont);
      onFontChange(storedFont);

      // Importar la fuente almacenada
      const link = document.createElement('link');
      link.href = `https://fonts.googleapis.com/css2?family=${storedFont.replace(/ /g, '+')}&display=swap`;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
  }, [onFontChange]);

  const handleFontChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newFont = event.target.value;
    setSelectedFont(newFont);

    // Importar la nueva fuente seleccionada
    const link = document.createElement('link');
    link.href = `https://fonts.googleapis.com/css2?family=${newFont.replace(/ /g, '+')}&display=swap`;
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // Almacenar la nueva fuente en el local storage
    localStorage.setItem('selectedFont', newFont);
    onFontChange(newFont);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredFonts(fonts.filter(font => font.toLowerCase().includes(query)));
  };

  return (
    <div className="font-selector">
      <div className="font-select-container">
        {/* <label htmlFor="font-search">Search for a font:</label>
        <input
          type="text"
          id="font-search"
          value={searchQuery}
          onChange={handleSearchChange}
        /> */}
        
        <select
          id="font-select"
          value={selectedFont}
          onChange={handleFontChange}
        >
          {recommendedFonts.map(font => (
            <option key={font} value={font}>{font}</option>
          ))}
          <option disabled>──────────</option>
          {filteredFonts.map(font => (
            <option key={font} value={font}>{font}</option>
          ))}
        </select>
        <div className="font-sample" style={{ fontFamily: selectedFont }}>
          Sample Text
        </div>
      </div>
      
      {/* <div className="button-container">
        <Button
          text="Aceptar"
          onClick={() => handleFontChange({ target: { value: selectedFont } } as React.ChangeEvent<HTMLSelectElement>)}
          className="accept-button"
        />
      </div> */}
    </div>
  );
};

export default FontSelector;
