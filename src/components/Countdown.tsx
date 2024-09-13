import React, { useEffect, useState } from "react";
import Countdown from "react-countdown";

interface CountdownComponentProps {
  onComplete: () => void;
  duration: number; // duration in seconds
}

const CountdownComponent: React.FC<CountdownComponentProps> = ({
  onComplete,
  duration,
}) => {
  const [endTime, setEndTime] = useState(Date.now() + duration * 1000);

  useEffect(() => {
    setEndTime(Date.now() + duration * 1000);
  }, [duration]);

  const renderer = ({
    minutes,
    seconds,
    completed,
  }: {
    minutes: number;
    seconds: number;
    completed: boolean;
  }) => {
    if (completed) {
      // Call onComplete prop when the countdown finishes
      onComplete();
      return <span className="text-red-600">STOP!</span>;
    } else {
      return (
        <span className="text-4xl font-bold">
          {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
        </span>
      );
    }
  };

  return (
    <div className="text-center text-gray-800">
      <Countdown date={endTime} renderer={renderer} />
    </div>
  );
};

export default CountdownComponent;
