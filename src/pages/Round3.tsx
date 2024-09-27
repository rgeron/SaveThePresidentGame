import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { db } from "../../firebaseConfig";

import Button from "../components/Button";
import Card from "../components/Card";
import Countdown from "../components/Countdown";

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

const Round3: React.FC = () => {
  const { pin } = useParams<{ pin: string }>();
  const location = useLocation();
  const {
    playerKey,
    playerData,
    data: gameData,
  } = location.state as LocationState;
  const navigate = useNavigate();

  const [questionVisible, setQuestionVisible] = useState(true);
  const [pause, setPause] = useState(false);

  useEffect(() => {
    const gameRef = doc(db, "games", pin!);

    const unsubscribe = onSnapshot(gameRef, (snapshot) => {
      const data = snapshot.data();
      if (data && data.gameStatus === "results") {
        navigate(`/results/${pin}`, {
          state: {
            playerKey,
            playerData: gameData.players[playerKey],
            data: gameData,
          },
        });
      }
    });

    return () => unsubscribe();
  }, [gameData, pin, playerKey, navigate]);

  const handleCountdownComplete = () => {
    setPause(true);
  };

  const handleExchange = async (exchanged: boolean) => {
    setQuestionVisible(false);
    if (exchanged && playerData) {
      const newRoom = playerData.Room[3] === 1 ? 2 : 1;
      const gameRef = doc(db, "games", pin!);
      const updatedPlayerData = {
        ...playerData,
        Room: [
          playerData.Room[0],
          playerData.Room[1],
          playerData.Room[2],
          newRoom,
        ],
      };
      await updateDoc(gameRef, {
        [`players.${playerKey}`]: updatedPlayerData,
      });
    }
  };

  const seeResults = async () => {
    await updateDoc(doc(db, "games", pin!), {
      gameStatus: "results",
    });
    navigate(`/results/${pin}`, {
      state: {
        playerKey,
        playerData: gameData.players[playerKey],
        data: gameData,
      },
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      {pause ? (
        <div className="bg-blue-50 flex flex-col justify-evenly items-center w-full h-screen relative">
          {/* Absolute Elements Container */}
          <div className="flex justify-center items-center">
            {/* Circles */}
            <div className="absolute left-7 top-24 w-20 h-20 bg-blue-500 rounded-full"></div>
            <div className="absolute -right-14 top-12 w-32 h-32 bg-red-700 rounded-full"></div>
            <div className="absolute left-1/3 top-14 w-14 h-14 bg-blue-300 rounded-full"></div>
          </div>

          <div className="flex-col items-center justify-center flex-grow w-full">
            {questionVisible ? (
              <div className="text-center w-full">
                {/* Vertical Bar */}
                <div className="absolute bottom-0 left-1/2 bg-gray-400 h-1/2 w-5"></div>

                {/* Question */}
                <div className="mt-60">
                  <p className="text-5xl mb-4 font-semibold">Are you being</p>
                  <p className="text-5xl mb-4 font-semibold">exchanged?</p>
                </div>

                {/* Buttons */}
                <div className="flex w-full mt-72">
                  <div className="flex-grow">
                    <button
                      onClick={() => handleExchange(true)}
                      className="flex-grow text-black py-4 text-4xl font-bold"
                    >
                      YES
                    </button>
                  </div>

                  <div className="flex-grow flex justify-center">
                    <button
                      onClick={() => handleExchange(false)}
                      className="flex-grow text-black py-4 text-4xl font-bold"
                    >
                      NO
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center mt-72">
                <p className="text-6xl font-zcool">NO</p>
                <p className="text-6xl font-zcool">MORE</p>
                <p className="text-6xl font-zcool mb-24">TALK</p>
                {playerKey === "creator" && (
                  <Button
                    onClick={seeResults}
                    text="See results"
                    color="green"
                  />
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center w-full h-screen">
          {/* Round 1 Circle */}
          <div className="relative -top-10 w-60 h-60 bg-red-600 rounded-full flex items-center justify-center">
            <h1 className="font-sans font-semibold text-white text-5xl">
              Round 3
            </h1>
          </div>

          {/* Countdown Timer */}
          <Countdown onComplete={handleCountdownComplete} duration={3} />

          {/* Player Card */}
          <div className="mb-10">
            <Card team={playerData?.team} role={playerData?.role} />
          </div>

          {/* Spacer to push content above room number */}
          <div className="flex-grow"></div>

          {/* Room Number at Bottom */}
          <div className="bg-blue-200 rounded-t-3xl w-full h-1/4 flex items-center justify-center">
            <h1 className="text-black text-7xl font-sans font-semibold">
              ROOM {playerData?.Room[2]}
            </h1>
          </div>
        </div>
      )}
    </div>
  );
};

export default Round3;
