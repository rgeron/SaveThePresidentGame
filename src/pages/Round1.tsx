import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

import Countdown from '../components/Countdown';
import Card from '../components/Card';

interface Player {
  Room: number[];
  team: string;
  role: string;
}

interface GameData {
  players: Record<string, Player>;
  gameStatus: string;
}

interface LocationState {
  playerKey: string;
  playerData: Player;
  data: GameData;
}

const Round1: React.FC = () => {
  const { pin } = useParams<{ pin: string }>();
  const location = useLocation();
  const { playerKey, playerData, data: gameData } = location.state as LocationState;
  const navigate = useNavigate();

  const [questionVisible, setQuestionVisible] = useState(true);
  const [showExchange, setShowExchange] = useState(false);

  useEffect(() => {
    const gameRef = doc(db, 'games', pin!);

    const unsubscribe = onSnapshot(gameRef, (snapshot) => {
      const data = snapshot.data();
      if (data && data.gameStatus === 'round2') {
        navigate(`/round2/${pin}`, { state: { playerKey } });
      }
    });

    return () => unsubscribe();
  }, [gameData, pin, playerKey, navigate]);

  const handleCountdownComplete = () => {
    setShowExchange(true);
  };

  const handleExchange = async (exchanged: boolean) => {
    setQuestionVisible(false);
    if (exchanged) {
      const newRoom = playerData.Room[1] === 1 ? 2 : 1;
      const gameRef = doc(db, 'games', pin!);
      const updatedPlayerData = {
        ...playerData,
        Room: [playerData.Room[0], newRoom, newRoom, newRoom],
      };
      await updateDoc(gameRef, {
        [`players.${playerKey}`]: updatedPlayerData,
      });
    }
  };

  const startRound2 = async () => {
    const gameRef = doc(db, 'games', pin!);
    await updateDoc(gameRef, {
      gameStatus: 'round2',
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-100 text-center">
      {showExchange ? (
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-4xl mb-6 text-gray-800">NO MORE TALK</h1>
          {questionVisible && (
            <div className="mb-4">
              <p className="text-xl mb-4">Are you traded?</p>
              <button
                onClick={() => handleExchange(true)}
                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700 mr-2"
              >
                YES
              </button>
              <button
                onClick={() => handleExchange(false)}
                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
              >
                NO
              </button>
            </div>
          )}
          {playerKey === 'creator' && (
            <button
              onClick={startRound2}
              className="mt-4 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700"
            >
              Start Round 2
            </button>
          )}
        </div>

      ) : (
        <div>
          <div className='bg-red-600 rounded-full justify-center'>
            <h1 className='font-sans font-semibold text-white'>Round 1</h1>
          </div>
          <Countdown onComplete={handleCountdownComplete} duration={10} />
          <Card team={playerData?.team} role={playerData?.role} />
          <div className='bg-blue-200 rounded-t-md'> 
            <h1 className='text-black text-xl font-sans'>ROOM 1</h1>

          </div>

        </div>
      )}
    </div>
  );
};

export default Round1;
