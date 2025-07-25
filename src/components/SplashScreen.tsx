import * as React from "react";
import JCNeonAnimation from './ui/JCNeonAnimationIntr';

interface SplashScreenProps {
  onComplete: () => void;
  duration?: number;
}

const SplashScreen = ({ onComplete, duration = 6000 }: SplashScreenProps) => {
  const [isVisible, setIsVisible] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500); // Allow time for fade-out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  return (
    <div 
      className={`fixed inset-0 z-50 bg-black transition-opacity duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <JCNeonAnimation />
    </div>
  );
};

export default SplashScreen;