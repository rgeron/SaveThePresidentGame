import React, { useState, useEffect, FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { db } from '../../firebaseConfig';
import { doc, updateDoc, onSnapshot, getDoc } from 'firebase/firestore';

interface Player {
  name: string;
  team?: string;
  role?: string;
  Room?: number[];
}

interface LocationState {
  mode: string;
  pin: string;
  playerKey: string;
}

const WaitingArea: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { mode, pin, playerKey } = location.state as LocationState;

  const [playerName, setPlayerName] = useState<string>('');
  const [players, setPlayers] = useState<Record<string, Player>>({});
  const [isReadyButtonVisible, setIsReadyButtonVisible] = useState<boolean>(true);
  const isCreator = mode === 'create';

  useEffect(() => {
    const gameRef = doc(db, 'games', pin);

    const unsubscribe = onSnapshot(gameRef, (snapshot) => {
      const data = snapshot.data();
      if (data) {
        setPlayers(data.players || {});

        if (data.gameStatus === 'preparation') {
          navigate(`/preparation/${pin}`, { state: { playerKey } });
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [navigate, pin, playerKey]);

  const handleNameSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsReadyButtonVisible(false);

    try {
      const gameRef = doc(db, 'games', pin);

      // Update the player's name using the playerKey
      await updateDoc(gameRef, {
        [`players.${playerKey}.name`]: playerName,
      });
    } catch (error) {
      console.error('Error updating player name:', error);
    }
  };

  const handleStartGame = async () => {
    try {
      const gameRef = doc(db, 'games', pin);
      const gameSnap = await getDoc(gameRef);
      const gameData = gameSnap.data();

      if (!gameData) {
        throw new Error('Game data not found');
      }

      const playersObject = Object.entries(gameData.players);
      const numPlayers = playersObject.length;

      if (numPlayers < 2) {
        alert('Not enough players to start the game.');
        return;
      }

      const half = Math.ceil(numPlayers / 2);

      const shuffledPlayersforRoles = shuffleArray(playersObject);
      const blueTeam = shuffledPlayersforRoles.slice(0, half);
      const redTeam = shuffledPlayersforRoles.slice(half);

      const shuffledPlayersforRoom = shuffleArray(playersObject);
      const Room1 = shuffledPlayersforRoom.slice(0, half);
      const Room2 = shuffledPlayersforRoom.slice(half);

      const updatedPlayers = { ...gameData.players };

      blueTeam.forEach(([key, player], index) => {
        updatedPlayers[key] = {
          ...player,
          team: 'Blue',
          role: index === 0 ? 'President' : 'Team Member',
        };
      });

      redTeam.forEach(([key, player], index) => {
        updatedPlayers[key] = {
          ...player,
          team: 'Red',
          role: index === 0 ? 'Bomber' : 'Team Member',
        };
      });

      Room1.forEach(([key, player]) => {
        updatedPlayers[key] = {
          ...updatedPlayers[key],
          Room: [1, 1, 1, 1],
        };
      });

      Room2.forEach(([key, player]) => {
        updatedPlayers[key] = {
          ...updatedPlayers[key],
          Room: [2, 2, 2, 2],
        };
      });

      await updateDoc(gameRef, {
        players: updatedPlayers,
        gameStatus: 'preparation',
      });
    } catch (error) {
      console.error('Error starting the game:', error);
      alert('Failed to start the game. Please try again.');
    }
  };

  const shuffleArray = <T,>(array: T[]): T[] => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-100 min-h-screen text-center">
      <h1 className="text-4xl text-gray-800 mb-6">Waiting Room</h1>
      <h2 className="text-2xl text-gray-600 mb-8">#{pin}</h2>

      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-3/5 mb-8">
        <h2 className="text-xl text-blue-600 mb-4">Special Roles: President, Bomber, Leader</h2>
        <p className="text-gray-600 mb-4">
          The character deck consists of the Red Bomber card, the Blue President card, and an equal number of Red Team
          and Blue Team cards.
        </p>
        <p className="text-gray-600 mb-4">
          If the Red Team’s Bomber is in the same room as the President at the end of the game, the Red Team wins.
        </p>
        <p className="text-gray-600">
          Each room has a leader selected by the players in that room. The leader chooses “hostages” to send to the other
          room.
        </p>
      </div>

      {isReadyButtonVisible && (
        <form onSubmit={handleNameSubmit} className="w-full md:w-2/5">
          <input
            type="text"
            placeholder="Enter your name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded mb-4"
          />
          <button type="submit" className="w-full bg-green-500 text-white py-3 rounded hover:bg-green-600">
            I am Ready
          </button>
        </form>
      )}

      <div className="w-full md:w-3/5 mt-8">
        <h2 className="text-2xl text-gray-800 mb-4">Players:</h2>
        <ul className="list-none">
          {Object.entries(players).map(([key, player]) => (
            <li key={key} className="p-4 bg-white rounded shadow mb-2">
              {player.name} {player.team && <span className="text-gray-600">({player.team})</span>}
            </li>
          ))}
        </ul>
      </div>

      {isCreator && (
        <button
          onClick={handleStartGame}
          className="mt-10 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Start the Game
        </button>
      )}
    </div>
  );
};

export default WaitingArea;
