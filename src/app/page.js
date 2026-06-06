'use client';

import { useState, useEffect, useRef } from 'react';
import { PLAYER_NAMES } from '../utils/playerPool';
import Hud from '../components/Hud';
import BigScreen from '../components/BigScreen';
import CardDeck from '../components/CardDeck';
import BigMoment from '../components/BigMoment';
import GameOver from '../components/GameOver';

export default function DirectHandCricket() {
  // States: 'PLAYING' | 'GAME_OVER'
  const [gameState, setGameState] = useState('PLAYING');
  const isProcessing = useRef(false);
  const [player1, setPlayer1] = useState({ name: 'YOU', avatar: '🧤' });
  const [player2, setPlayer2] = useState({ name: 'OPPONENT', avatar: '🔴' });

  // Match statistics
  const [currentInnings, setCurrentInnings] = useState(1);
  const [userRole, setUserRole] = useState('batting'); // 'batting' | 'bowling'
  const [score, setScore] = useState(0);
  const [target, setTarget] = useState(0);
  const [userFinalScore, setUserFinalScore] = useState(null);
  const [opponentFinalScore, setOpponentFinalScore] = useState(null);

  // Play selections
  const [playerChoice, setPlayerChoice] = useState(null);
  const [opponentChoice, setOpponentChoice] = useState(null);
  const [isWicket, setIsWicket] = useState(false);
  const [commentary, setCommentary] = useState('Select a run card to play!');
  
  // Simulated Multiplayer delays
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingText, setThinkingText] = useState('Opponent is ready...');

  // Visual effects
  const [ballOutcome, setBallOutcome] = useState('-'); 
  const [ballHistory, setBallHistory] = useState([]); 
  const [isShaking, setIsShaking] = useState(false);
  
  // Big Moment overlays: 'four' | 'six' | 'wicket' | null
  const [bigMoment, setBigMoment] = useState(null);

  // Initialize player profiles on mount
  useEffect(() => {
    setPlayer1({ name: 'YOU', avatar: '🧤' });
    setPlayer2({ name: 'OPPONENT', avatar: '🔴' });

    const startingRole = Math.random() < 0.5 ? 'batting' : 'bowling';
    setUserRole(startingRole);
    setCommentary(
      startingRole === 'batting' 
        ? 'Match started: You are batting first!' 
        : 'Opponent is batting first. You are bowling!'
    );
  }, []);

  // Handle number card clicks
  const handlePlayBall = (userNum) => {
    if (isProcessing.current || isThinking || isWicket) return;
    isProcessing.current = true;

    setPlayerChoice(userNum);
    setIsThinking(true);

    const opponentMessages = userRole === 'batting'
      ? [
          'Opponent is adjusting fielders...',
          'Opponent is selecting run-up...',
          'Opponent is preparing delivery...'
        ]
      : [
          'Opponent is checking boundaries...',
          'Opponent is choosing shot angle...',
          'Opponent is locking in...'
        ];

    setThinkingText(opponentMessages[0]);
    const messageTimeout = setTimeout(() => {
      setThinkingText(opponentMessages[Math.floor(Math.random() * opponentMessages.length)]);
    }, 1000);

    setTimeout(() => {
      clearTimeout(messageTimeout);
      setIsThinking(false);

      const compNum = Math.floor(Math.random() * 6) + 1;
      setOpponentChoice(compNum);

      const isMatch = userNum === compNum;

      if (currentInnings === 1) {
        if (isMatch) {
          // OUT
          setIsWicket(true);
          setIsShaking(true);
          setBallOutcome('W');
          setBallHistory(prev => [...prev.slice(-5), 'W']);
          setBigMoment('wicket');
          setTimeout(() => setIsShaking(false), 600);

          if (userRole === 'batting') {
            setUserFinalScore(score);
            setCommentary(`Clean bowled! Opponent matched your ${compNum}!`);
          } else {
            setOpponentFinalScore(score);
            setCommentary(`Clean bowled! You got Opponent OUT!`);
          }

          setTarget(score + 1);
          setTimeout(() => {
            setCurrentInnings(2);
            setIsWicket(false);
            setScore(0);
            setUserRole(prev => prev === 'batting' ? 'bowling' : 'batting');
            setPlayerChoice(null);
            setOpponentChoice(null);
            setBallOutcome('-');
            setBallHistory([]);
            setCommentary(`Innings 2: Target is ${score + 1} runs!`);
            isProcessing.current = false;
          }, 2000);

        } else {
          // Score runs
          const runsScored = userRole === 'batting' ? userNum : compNum;
          const newScore = score + runsScored;
          setScore(newScore);
          setBallOutcome(runsScored.toString());
          setBallHistory(prev => [...prev.slice(-5), 'R']);

          if (runsScored === 4) setBigMoment('four');
          if (runsScored === 6) setBigMoment('six');

          if (userRole === 'batting') {
            setCommentary(`You score ${userNum} run(s)!`);
          } else {
            setCommentary(`Opponent scores ${compNum} run(s)!`);
          }
        }

      } else {
        // Innings 2 (Chasing target)
        if (isMatch) {
          // OUT
          setIsWicket(true);
          setIsShaking(true);
          setBallOutcome('W');
          setBallHistory(prev => [...prev.slice(-5), 'W']);
          setBigMoment('wicket');
          setTimeout(() => setIsShaking(false), 600);

          if (userRole === 'batting') {
            setUserFinalScore(score);
            setCommentary(`Clean bowled! Opponent matched your ${compNum}!`);
          } else {
            setOpponentFinalScore(score);
            setCommentary(`Clean bowled! You got Opponent OUT!`);
          }

          setTimeout(() => {
            setGameState('GAME_OVER');
          }, 2000);

        } else {
          // Score runs
          const runsScored = userRole === 'batting' ? userNum : compNum;
          const newScore = score + runsScored;
          setScore(newScore);
          setBallOutcome(runsScored.toString());
          setBallHistory(prev => [...prev.slice(-5), 'R']);

          if (runsScored === 4) setBigMoment('four');
          if (runsScored === 6) setBigMoment('six');

          if (userRole === 'batting') {
            setCommentary(`You score ${userNum} run(s)!`);
          } else {
            setCommentary(`Opponent scores ${compNum} run(s)!`);
          }

          if (newScore >= target) {
            if (userRole === 'batting') {
              setUserFinalScore(newScore);
            } else {
              setOpponentFinalScore(newScore);
            }

            setTimeout(() => {
              setGameState('GAME_OVER');
            }, 1000);
          }
        }
      }

      // CLEAR CARD SELECTIONS AND OVERLAYS AFTER 1.8 SECONDS
      setTimeout(() => {
        setPlayerChoice(null);
        setOpponentChoice(null);
        setBigMoment(null);
        isProcessing.current = false;
      }, 1800);

    }, 2000);
  };

  // Reset lobby/state
  const resetGame = () => {
    isProcessing.current = false;
    setPlayer1({ name: 'YOU', avatar: '🧤' });
    setPlayer2({ name: 'OPPONENT', avatar: '🔴' });

    setGameState('PLAYING');
    setCurrentInnings(1);
    setScore(0);
    setTarget(0);
    setUserFinalScore(null);
    setOpponentFinalScore(null);
    setPlayerChoice(null);
    setOpponentChoice(null);
    setIsWicket(false);
    setBallOutcome('-');
    setBallHistory([]);
    
    const startingRole = Math.random() < 0.5 ? 'batting' : 'bowling';
    setUserRole(startingRole);
    setCommentary(
      startingRole === 'batting' 
        ? 'Match started: You are batting first!' 
        : 'Opponent is batting first. You are bowling!'
    );
  };

  return (
    <main style={styles.container}>
      {/* Big Moment Overlays */}
      <BigMoment bigMoment={bigMoment} />

      {/* Main Playing Interface */}
      {gameState === 'PLAYING' && (
        <div style={styles.gameGrid} className={isShaking ? 'shake-wicket' : ''}>
          
          {/* Top HUD profiles & logs */}
          <Hud 
            player1={player1} 
            player2={player2} 
            userRole={userRole} 
            score={score} 
            opponentFinalScore={opponentFinalScore} 
            ballHistory={ballHistory} 
          />

          {/* Central Scoreboard screen */}
          <BigScreen 
            player1={player1} 
            player2={player2} 
            userRole={userRole} 
            score={score} 
            opponentFinalScore={opponentFinalScore} 
            isThinking={isThinking} 
            ballOutcome={ballOutcome} 
            playerChoice={playerChoice} 
            opponentChoice={opponentChoice} 
          />

          {/* Commentary Banner */}
          <div className={`zpl-commentary-banner ${isWicket ? 'out-state' : ''}`}>
            {isThinking ? thinkingText : commentary}
          </div>

          {/* Play Cards Grid */}
          <CardDeck 
            isWicket={isWicket} 
            isThinking={isThinking} 
            playerChoice={playerChoice} 
            handlePlayBall={handlePlayBall} 
          />

          {/* Score Target indicators in play */}
          {currentInnings === 2 && (
            <div style={styles.targetBanner}>
              Target: {target} runs | Need {Math.max(0, target - score)} runs to win
            </div>
          )}
        </div>
      )}

      {/* Game Over Screen */}
      {gameState === 'GAME_OVER' && (
        <GameOver 
          userFinalScore={userFinalScore} 
          opponentFinalScore={opponentFinalScore} 
          player1={player1} 
          player2={player2} 
          resetGame={resetGame} 
        />
      )}
    </main>
  );
}

const styles = {
  container: {
    maxWidth: '520px',
    width: '100%',
    margin: '0 auto',
    padding: '30px 15px 10px 15px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: '20px',
  },
  gameGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  targetBanner: {
    background: 'rgba(255, 255, 255, 0.8)',
    padding: '10px',
    borderRadius: '12px',
    fontSize: '0.9rem',
    fontWeight: '800',
    color: '#333333',
    textAlign: 'center',
    border: '1px solid rgba(0,0,0,0.05)',
  }
};
