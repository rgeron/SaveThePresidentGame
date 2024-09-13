import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import {db} from '../../firebaseConfig';

interface Player {
  name: string;
  team: 'red' | 'blue';
  role: string;
  Room: number[];
}

interface GameData {
  players: Record<string, Player>;
  gameStatus: string;
}

const Results: React.FC = () => {
  const { pin } = useParams<{ pin: string }>();
  const location = useLocation<{ playerKey: string }>();
  const { playerKey } = location.state;
  const navigate = useNavigate();

  const [gameData, setGameData] = useState<GameData | null>(null);

  useEffect(() => {
    const gameRef = doc(db, 'games', pin as string);
    
    const unsubscribe = onSnapshot(gameRef, (snapshot) => {
      const data = snapshot.data();
      if (data) {
        setGameData(data as GameData);

        if (data.gameStatus === 'finished') {
          navigate(`/`);
        }
      }
    });

    return () => unsubscribe();
  }, [navigate, pin]);

  const handleEndGame = async () => {
    await updateDoc(doc(db, 'games', pin as string), { gameStatus: 'finished' });
    navigate(`/`);
  };

  const getRoomAssignments = (players: Record<string, Player>) => {
    const rounds = [0, 1, 2, 3];
    
    return rounds.reduce((acc, round) => {
      acc[round] = { Room1: [], Room2: [] };
      
      Object.values(players).forEach(player => {
        if (player.Room[round] === 1) {
          acc[round].Room1.push(player);
        } else if (player.Room[round] === 2) {
          acc[round].Room2.push(player);
        }
      });
      
      return acc;
    }, {} as Record<number, { Room1: Player[]; Room2: Player[] }>);
  };

  const determineWinner = (players: Record<string, Player>) => {
    const bomber = Object.values(players).find(player => player.role === 'bomber');
    const president = Object.values(players).find(player => player.role === 'president');

    if (bomber && president) {
      return bomber.Room[3] === president.Room[3] ? 'Team Red' : 'Team Blue';
    }
    return 'Unable to determine winner';
  };

  if (!gameData) {
    return <div>Loading...</div>;
  }

  const roomAssignments = getRoomAssignments(gameData.players);
  const winner = determineWinner(gameData.players);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-center text-2xl font-bold mb-6">Game Results</h1>
      
      <div className="text-center bg-gray-200 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold text-gray-800">{winner} won the game!</h2>
      </div>

      <div className="space-y-6">
        {[0, 1, 2, 3].map(round => (
          <div key={round} className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              {round === 0 ? 'Initial Room Assignment' : `After Round ${round}`}
            </h2>
            {[1, 2].map(roomNumber => (
              <div key={roomNumber} className="mb-4">
                <h3 className="text-md font-semibold text-gray-600">Room {roomNumber}</h3>
                <ul className="list-none p-0">
                  {roomAssignments[round][`Room${roomNumber}`].map((player, index) => (
                    <li key={index} className="mt-2">
                      <span className={`inline-block py-1 px-3 rounded-full text-white font-medium ${player.team === 'red' ? 'bg-red-500' : 'bg-blue-500'}`}>
                        {player.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}
      </div>

      {playerKey === 'creator' && (
        <button
          onClick={handleEndGame}
          className="mt-6 bg-blue-500 text-white py-3 px-6 rounded-lg text-lg font-medium hover:bg-blue-600 transition-colors"
        >
          End the Game
        </button>
      )}
    </div>
  );
};

export default Results;
