import React, { useState, useEffect } from 'react';

const FlashMessage = ({ message, type, setFlashMessage, duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setFlashMessage(null);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  if (!isVisible) return null;

  const backgroundColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';

  return (
    <div className={`fixed bottom-4 left-[50%] translate-x-[-50%] ${backgroundColor} text-white px-4 py-2 rounded shadow-lg z-50`}>
      {message}
    </div>
  );
};

export default FlashMessage;