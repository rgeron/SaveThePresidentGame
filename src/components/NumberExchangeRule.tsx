import React from 'react';

interface NumberExchangeRuleProps {
  numberOfPlayers: number;
}

const NumberExchangeRule: React.FC<NumberExchangeRuleProps> = ({ numberOfPlayers }) => {
  let rules = '';

  if (numberOfPlayers >= 2 && numberOfPlayers <= 10) {
    rules = '1 - 1 - 1';
  } else if (numberOfPlayers >= 11 && numberOfPlayers <= 21) {
    rules = '2 - 1 - 1';
  } else if (numberOfPlayers > 22) {
    rules = '3 - 2 - 1';
  }

  return (
    <div className="border border-gray-300 rounded-lg bg-gray-50 p-6 my-4 text-center">
      <h2 className="text-xl font-semibold text-gray-700">
        Number of hostages per round for {numberOfPlayers} players: <span className="font-bold">{rules}</span>
      </h2>
    </div>
  );
};

export default NumberExchangeRule;
