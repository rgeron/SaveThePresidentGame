import React from "react";

interface NumberExchangeRuleProps {
  numberOfPlayers: number;
}

const NumberExchangeRule: React.FC<NumberExchangeRuleProps> = ({
  numberOfPlayers,
}) => {
  const arrowIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 22 22"
      strokeWidth="1.5"
      stroke="currentColor"
      className="inline w-6 h-6 mx-2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
      />
    </svg>
  );

  let rules: JSX.Element[] = [];

  if (numberOfPlayers >= 2 && numberOfPlayers <= 10) {
    rules = [
      <div key="3min" className="mb-2">
        3 minutes {arrowIcon} trade 1 hostage/room
      </div>,
      <div key="2min" className="mb-2">
        2 minutes {arrowIcon} trade 1 hostage/room
      </div>,
      <div key="1min" className="mb-2">
        1 minute {arrowIcon} trade 1 hostage/room
      </div>,
    ];
  } else if (numberOfPlayers >= 11 && numberOfPlayers <= 21) {
    rules = [
      <div key="3min" className="mb-2">
        3 minutes {arrowIcon} trade 2 hostages/room
      </div>,
      <div key="2min" className="mb-2">
        2 minutes {arrowIcon} trade 1 hostage/room
      </div>,
      <div key="1min" className="mb-2">
        1 minute {arrowIcon} trade 1 hostage/room
      </div>,
    ];
  } else if (numberOfPlayers > 22) {
    rules = [
      <div key="3min" className="mb-2">
        3 minutes {arrowIcon} trade 3 hostages/room
      </div>,
      <div key="2min" className="mb-2">
        2 minutes {arrowIcon} trade 2 hostages/room
      </div>,
      <div key="1min" className="mb-2">
        1 minute {arrowIcon} trade 1 hostage/room
      </div>,
    ];
  }

  return (
    <div className="text-center p-2">
      <div className="text-1xl font-semibold text-white">{rules}</div>
    </div>
  );
};

export default NumberExchangeRule;
