import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { db } from "../../firebaseConfig";

import Card from "../components/Card";
import NumberExchangeRule from "../components/NumberExchangeRule";
import RoomInfo from "../components/RoomInfo";

interface Player {
  name: string;
  team: string;
  role: string;
  Room: number[];
}

interface GameData {
  players: Record<string, Player>;
  gameStatus: string;
}

const Preparation: React.FC = () => {
  const { pin } = useParams<{ pin: string }>();
  const location = useLocation<{ playerKey: string }>();
  const { playerKey } = location.state;
  const navigate = useNavigate();

  const [gameData, setGameData] = useState<GameData | null>(null);

  useEffect(() => {
    const gameRef = doc(db, "games", pin as string);

    const unsubscribe = onSnapshot(gameRef, (snapshot) => {
      const data = snapshot.data();
      if (data) {
        setGameData(data as GameData);

        if (data.gameStatus === "round1") {
          navigate(`/round1/${pin}`, {
            state: { playerKey, playerData: data.players[playerKey], data },
          });
        }
      }
    });

    return () => unsubscribe();
  }, [gameData, navigate, pin, playerKey]);

  const handleStartRound = async () => {
    if (!gameData) {
      console.error("Game data is not available");
      return;
    }

    const gameRef = doc(db, "games", pin as string);
    await updateDoc(gameRef, { gameStatus: "round1" });

    navigate(`/round1/${pin}`, {
      state: {
        playerKey,
        playerData: gameData.players[playerKey],
        data: gameData,
      },
    });
  };

  if (!gameData) {
    return <div>Loading game data...</div>;
  }

  const currentPlayerData = gameData.players[playerKey];
  const { team, role, Room } = currentPlayerData;
  const currentRoom = Room[0]; // Room assignment for round 1

  const playersInSameRoom = Object.values(gameData.players).filter(
    (player) => player.Room[0] === currentRoom
  );

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gradient-bg min-h-screen">
      <RoomInfo roomNumber={currentRoom} players={playersInSameRoom} />

      <div className="w-full max-w-xl mb-8">
        <NumberExchangeRule
          numberOfPlayers={Object.keys(gameData.players).length}
        />

        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Rules in the room
        </h2>
        <ol className="list-decimal text-gray-700 text-lg ml-5">
          <li>You have to stay in your room.</li>
          <li>There is absolutely no communicating allowed between rooms.</li>
          <li>
            You can do pretty much anything you want with your character card.
            You can show it to someone, show it to everyone, or choose not to
            show it at all. However, you are not permitted to swap character
            cards with another player. That's your card—take care of it.
          </li>
        </ol>
      </div>

      <Card team={team} role={role} />

      {playerKey === "creator" && (
        <button
          onClick={handleStartRound}
          className="mt-6 bg-red-500 text-white py-3 px-6 rounded-lg text-lg font-medium hover:bg-red-600 transition-colors"
        >
          Start Round 1
        </button>
      )}
    </div>
  );
};

export default Preparation;
