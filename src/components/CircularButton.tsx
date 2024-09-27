import React from 'react';

const CircularButton = () => (
  <button
  className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 bg-red-600 flex items-center justify-center w-24 h-24 rounded-full font-sans font-bold text-white text-center z-10"
  onClick={() => alert("Display full rules")}
>
  <span>
    Full<br />rules
  </span>
</button>
);

export default CircularButton;