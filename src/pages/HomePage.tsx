import React, { useEffect, useState } from 'react';
import { Parallax, ParallaxLayer } from '@react-spring/parallax';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../styles/pages/HomePage.scss';
import background1 from '../assets/images/1.svg';
import background2 from '../assets/images/2.svg';
import background3 from '../assets/images/3.svg';
import background4 from '../assets/images/4.svg';
import background5 from '../assets/images/5.svg';
import background6 from '../assets/images/6.svg';
import background7 from '../assets/images/7.svg';
import background8 from '../assets/images/8.svg';
import welcomeImage from '../assets/images/welcome.png';
import earnImage from '../assets/images/earn.png';
import devImage from '../assets/images/dev.png';
import tradingImage from '../assets/images/trading.png';
import streamsImage from '../assets/images/streams.png';
import investmentsImage from '../assets/images/investments.png';
import twitchImage from '../assets/images/twitch.png';
import projectImage from '../assets/images/project.png';
import translations from '../i18n/Translations';

const lang = 'es';

const HomePage: React.FC = () => {
  useEffect(() => {
    AOS.init({
      duration: 1500,
      once: true,
    });
  }, []);

  const texts = [
    { title: translations[lang].welcome, content: translations[lang].welcomeContent, image: welcomeImage },
    { title: translations[lang].earn, content: translations[lang].earnContent, image: earnImage },
    { title: translations[lang].dev, content: translations[lang].devContent, image: devImage },
    { title: translations[lang].trading, content: translations[lang].tradingContent, image: tradingImage },
    { title: translations[lang].streams, content: translations[lang].streamsContent, image: streamsImage },
    { title: translations[lang].investments, content: translations[lang].investmentsContent, image: investmentsImage },
    { title: translations[lang].twitch, content: translations[lang].twitchContent, image: twitchImage },
    { title: translations[lang].project, content: translations[lang].projectContent, image: projectImage },
  ];

  const backgrounds = [
    background1,
    background2,
    background3,
    background4,
    background5,
    background6,
    background7,
    background8,
  ];

  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const handleScroll = (event: WheelEvent) => {
      const delta = event.deltaY;
      if (delta > 0 && currentTextIndex < texts.length - 1 && !fade) {
        setFade(true);
        setTimeout(() => {
          setCurrentTextIndex((prevIndex) => prevIndex + 1);
          setFade(false);
        }, 1000); // Adjust the timeout to match your desired fade duration
      } else if (delta < 0 && currentTextIndex > 0 && !fade) {
        setFade(true);
        setTimeout(() => {
          setCurrentTextIndex((prevIndex) => prevIndex - 1);
          setFade(false);
        }, 1000); // Adjust the timeout to match your desired fade duration
      }
    };

    window.addEventListener('wheel', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('wheel', handleScroll);
    };
  }, [currentTextIndex, fade, texts.length]);

  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const { clientX, clientY } = event;
      setOffsetX((clientX / window.innerWidth - 0.5) * 30);
      setOffsetY((clientY / window.innerHeight - 0.5) * 30);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="HomePage">
      <Parallax pages={1}>
        <ParallaxLayer offset={0} speed={0.5}>
          <div
            className={`background-layer ${fade ? 'fade-out' : 'fade-in'}`}
            style={{
              backgroundImage: `url(${backgrounds[currentTextIndex]})`,
              backgroundSize: 'cover',
              height: '100vh',
              width: '100%',
            }}
          ></div>
        </ParallaxLayer>
        <ParallaxLayer offset={0} speed={0.5}>
          <div className="text-container" style={{ transform: `translate(${offsetX}px, ${offsetY}px)` }}>
            <img src={texts[currentTextIndex].image} alt={texts[currentTextIndex].title} className={`emoji emoji-${currentTextIndex} ${fade ? 'fade-out' : 'fade-in'}`} />
            <div className="text-content">
              <h1 className={`title title-${currentTextIndex} ${fade ? 'fade-out' : 'fade-in'}`}>{texts[currentTextIndex].title}</h1>
              <p className={`content content-${currentTextIndex} ${fade ? 'fade-out' : 'fade-in'}`}>{texts[currentTextIndex].content}</p>
            </div>
          </div>
        </ParallaxLayer>
      </Parallax>
    </div>
  );
};

export default HomePage;
