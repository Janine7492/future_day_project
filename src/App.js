import { useState, useEffect } from "react";
import "./App.css"; // CSS für das Styling

export default function CarRace() {
  const [players, setPlayers] = useState([
    { x: 100, y: 350, width: 50, height: 100, imageSrc: "car1.png", score: 0, lives: 3, keyLeft: "ArrowLeft", keyRight: "ArrowRight", keyUp: "ArrowUp", keyDown: "ArrowDown" },
    { x: 200, y: 350, width: 50, height: 100, imageSrc: "car2.png", score: 0, lives: 3, keyLeft: "a", keyRight: "d", keyUp: "w", keyDown: "s" }
  ]);
  const [obstacles, setObstacles] = useState([]);
  const [coins, setCoins] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [goalReached, setGoalReached] = useState(false);
  const [playerOneScore, setPlayerOneScore] = useState(0);
  const [playerTwoScore, setPlayerTwoScore] = useState(0);
  const [playerOneLives, setPlayerOneLives] = useState(3);
  const [playerTwoLives, setPlayerTwoLives] = useState(3);

  


  function checkCoinCollisions(coins, setPlayers, setCoins) {
    setPlayers((prevPlayers) =>
      prevPlayers.map((player) => {
        const collectedCoins = coins.filter(
          (coin) =>
            player.x < coin.x + 20 &&
            player.x + player.width > coin.x &&
            player.y < coin.y + 20 &&
            player.y + player.height > coin.y
        );
  
        if (collectedCoins.length > 0) {
          setCoins((prevCoins) =>
            prevCoins.filter((coin) => !collectedCoins.includes(coin))
          );
          console.log(coins)
          return { ...player, score: player.score + collectedCoins.length * 10 };
        }
  
        // console.log(player)
        return player;
      })
    );
  }
  

  function checkObstacleCollisions(obstacles, setPlayers, setObstacles) {
        setPlayers((prevPlayers) =>
          prevPlayers.map((player) => {
            const collidedObstacles = obstacles.filter(
              (obstacle) =>
                player.x < obstacle.x + 20 &&
                player.x + player.width > obstacle.x &&
                player.y < obstacle.y + 20 &&
                player.y + player.height > obstacle.y
            );
      
            if (collidedObstacles.length > 0) {
              setObstacles((prevObstacles) =>
                prevObstacles.filter((obstacle) => !collidedObstacles.includes(obstacle))
              );

            //   console.log(obstacles)
      
              return { ...player, lives: player.lives - collidedObstacles.length * 1 };
            }
      
            // console.log(player)
            return player;
          })
        );
      
      
  }
  
//   useEffect(() => {
//     const runChecks = async () =>{
//         await checkCoinCollisions(coins, setPlayers, setCoins);
//         await checkObstacleCollisions(obstacles, setPlayers);

//         if (players.some((player) => player.lives <= 0)) {
//             setGameOver(true);
//         }
//     }

//     runChecks();
//   }, [players, coins, obstacles]);

  
  
  useEffect(() => {
    setPlayerOneScore(players[0].score);
    setPlayerTwoScore(players[1].score);
    setPlayerOneLives(players[0].lives);
    setPlayerTwoLives(players[1].lives);
  }, [players]);

  useEffect(() => {
    const interval = setInterval(() => {
      setObstacles((prev) => [...prev, { x: Math.random() * 300, y: 0 }]);
    }, 2000);
    return () => clearInterval(interval);
  }, [gameOver, goalReached]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCoins((prev) => [...prev, { x: Math.random() * 300, y: 0 }]);
    }, 3000);
    return () => clearInterval(interval);
  }, [gameOver, goalReached]);

  useEffect(() => {
    const handleKeydown = (e) => {
      setPlayers((prev) =>
        prev.map((player) => {
          if (e.key === player.keyLeft && player.x > 0) return { ...player, x: player.x - 10 };
          if (e.key === player.keyRight && player.x < 300) return { ...player, x: player.x + 10 };
          if (e.key === player.keyUp && player.y > 0) return { ...player, y: player.y - 10 };
          if (e.key === player.keyDown && player.y < 400) return { ...player, y: player.y + 10 };
          return player;
        })
      );
    };
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setObstacles((prev) => prev.map((o) => ({ ...o, y: o.y + 5 })).filter((o) => o.y < 400));
      setCoins((prev) => prev.map((c) => ({ ...c, y: c.y + 3 })).filter((c) => c.y < 400));
    }, 50);
  
    return () => clearInterval(interval);
  }, []); 
  
  
  useEffect(() => {
    checkCoinCollisions(coins, setPlayers, setCoins);
    checkObstacleCollisions(obstacles, setPlayers, setObstacles);
  }, [coins, obstacles]);

  useEffect(() => {
    const goalTimeout = setTimeout(() => {
      setGoalReached(true);
    }, 120000);
    return () => clearTimeout(goalTimeout);
  }, []);

  return (
    <div className="game-container">
      <h1>2-Spieler Autorennen</h1>
      {gameOver ? (
        <h2>Game Over!</h2>
      ) : goalReached ? (
        <h2>Ziellinie erreicht!</h2>
      ) : (
        <>
          <div className="track">
            {players.map((player, index) => (
              <div
                key={index}
                className="car"
                style={{
                  left: player.x + "px",
                  top: player.y + "px",
                  width: player.width + "px",
                  height: player.height + "px",
                  backgroundImage: `url(${process.env.PUBLIC_URL}/${player.imageSrc})`,
                }}
              ></div>
            ))}
            {obstacles.map((obs, index) => (
              <div
                key={index}
                className="obstacle"
                style={{ left: obs.x + "px", top: obs.y + "px", width: "50px", height: "50px", backgroundColor: "black" }}
              ></div>
            ))}
            {coins.map((coin, index) => (
              <div
                key={index}
                className="coin"
                style={{ left: coin.x + "px", top: coin.y + "px", width: "20px", height: "20px", backgroundColor: "gold" }}
              ></div>
            ))}
          </div>
          <div>
            <p>Punkte Spieler 1: {playerOneScore} | Leben Spieler 1: {playerOneLives}</p>
            <p>Punkte Spieler 2: {playerTwoScore} | Leben Spieler 2: {playerTwoLives}</p>
          </div>
        </>
      )}
    </div>
  );
}
