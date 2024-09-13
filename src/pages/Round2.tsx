import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

import Countdown from '../components/Countdown';
import Card from '../components/Card';
import RoomInfo from '../components/RoomInfo';

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
}

const Round2: React.FC = () => {
  const { pin } = useParams<{ pin: string }>();
  const location = useLocation();
  const { playerKey } = location.state as LocationState;
  const navigate = useNavigate();

  const [showExchange, setShowExchange] = useState(false);
  const [playerData, setPlayerData] = useState<Player | null>(null);
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [questionVisible, setQuestionVisible] = useState(true);

  useEffect(() => {
    const gameRef = doc(db, 'games', pin!);

    const unsubscribe = onSnapshot(gameRef, (snapshot) => {
      const data = snapshot.data() as GameData;
      if (data) {
        setGameData(data);
        if (data.players && data.players[playerKey]) {
          setPlayerData(data.players[playerKey]);
        }
        if (data.gameStatus === 'round3') {
          navigate(`/round3/${pin}`, { state: { playerKey } });
        }
      }
    });

    return () => unsubscribe();
  }, [pin, playerKey, navigate]);

  const handleCountdownComplete = () => {
    setShowExchange(true);
  };

  const handleExchange = async (exchanged: boolean) => {
    setQuestionVisible(false);
    if (exchanged && playerData) {
      const newRoom = playerData.Room[2] === 1 ? 2 : 1;
      const gameRef = doc(db, 'games', pin!);
      const updatedPlayerData = {
        ...playerData,
        Room: [playerData.Room[0], playerData.Room[1], newRoom, newRoom],
      };
      await updateDoc(gameRef, {
        [`players.${playerKey}`]: updatedPlayerData,
      });
    }
  };

  const startRound3 = async () => {
    await updateDoc(doc(db, 'games', pin!), {
      gameStatus: 'round3',
    });
    navigate(`/round3/${pin}`, { state: { playerKey } });
  };

  const playersInSameRoom = gameData?.players
    ? Object.values(gameData.players).filter(
        (player) => player.Room[1] === playerData?.Room[1]
      )
    : [];

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
              onClick={startRound3}
              className="mt-4 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700"
            >
              Start Round 3
            </button>
          )}
        </div>
      ) : (
        <div>
          <span className="text-2xl font-bold text-gray-800">ROUND 2</span>
          <Countdown onComplete={handleCountdownComplete} duration={10} />
          <RoomInfo
            roomNumber={playerData?.Room?.[1]}
            players={playersInSameRoom}
          />
          <Card team={playerData?.team} role={playerData?.role} />
        </div>
      )}
    </div>
  );
};

export default Round2;
