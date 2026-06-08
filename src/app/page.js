'use client';

import { useState, useEffect, useRef } from 'react';
import Hud from '../components/Hud';
import BigScreen from '../components/BigScreen';
import CardDeck from '../components/CardDeck';
import BigMoment from '../components/BigMoment';
import GameOver from '../components/GameOver';

export default function DirectHandCricket() {
  // States: 'PLAYING' | 'GAME_OVER'
  const [gameState, setGameState] = useState('PLAYING');
  const isProcessing = useRef(false);

  // Match statistics
  const [currentInnings, setCurrentInnings] = useState(1);
  const [userRole, setUserRole] = useState('batting'); // 'batting' | 'bowling'
  const [score, setScore] = useState(0);
  const [target, setTarget] = useState(0);
  const [ballsBowled, setBallsBowled] = useState(0);
  const [userFinalScore, setUserFinalScore] = useState(null);
  const [opponentFinalScore, setOpponentFinalScore] = useState(null);
  const [history, setHistory] = useState([]);

  // Play selections
  const [playerChoice, setPlayerChoice] = useState(null);
  const [opponentChoice, setOpponentChoice] = useState(null);
  const [isWicket, setIsWicket] = useState(false);
  const [commentary, setCommentary] = useState('Select a run card to play!');
  const [ballOutcome, setBallOutcome] = useState('-'); 
  const [isShaking, setIsShaking] = useState(false);
  
  // Big Moment overlays: 'four' | 'six' | 'wicket' | null
  const [bigMoment, setBigMoment] = useState(null);

  // 3-second selection countdown timer
  const [timerVal, setTimerVal] = useState(3);
  const [showOutcome, setShowOutcome] = useState(false);
  const [gameId, setGameId] = useState('');

  // Helper to generate random game ID
  const generateGameId = () => {
    return 'g-' + Math.random().toString(36).substring(2, 11) + '-' + Date.now();
  };

  const sendMatchResults = (finalUser, finalOpponent, currentHistory) => {
    let winner = 'tie';
    if (finalUser > finalOpponent) {
      winner = 'human';
    } else if (finalOpponent > finalUser) {
      winner = 'computer';
    }

    fetch('/api/record-play', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        gameId,
        userFinalScore: finalUser,
        opponentFinalScore: finalOpponent,
        winner,
        history: currentHistory
      })
    }).catch(err => console.error('Failed to log match:', err));
  };

  // Initialize starting roles and game ID
  useEffect(() => {
    setGameId(generateGameId());
    const startingRole = Math.random() < 0.5 ? 'batting' : 'bowling';
    setUserRole(startingRole);
    setCommentary(
      startingRole === 'batting' 
        ? 'Match started: You are batting first!' 
        : 'Opponent is batting first. You are bowling!'
    );
  }, []);

  // Update selection on click (without immediate comparison)
  const handleSelectCard = (userNum) => {
    if (showOutcome || isWicket || gameState !== 'PLAYING') return;
    setPlayerChoice(userNum);
    setCommentary(`You selected card ${userNum}! Waiting for delivery...`);
  };

  // Evaluate comparison and compute runs/wickets when timer hits 0
  const evaluatePlay = (userNum) => {
    const isDotBall = userNum === null;
    const finalUserNum = isDotBall ? 0 : userNum;
    const compNum = isDotBall ? 0 : (Math.floor(Math.random() * 6) + 1);

    setPlayerChoice(finalUserNum);
    setOpponentChoice(compNum);

    const isMatch = !isDotBall && (finalUserNum === compNum);
    const nextBallsBowled = ballsBowled + 1;
    setBallsBowled(nextBallsBowled);

    // Calculate runs for this ball
    let runsScored = 0;
    if (!isDotBall && !isMatch) {
      runsScored = userRole === 'batting' ? finalUserNum : compNum;
    }
    const newScore = score + runsScored;

    const currentPlay = {
      innings: currentInnings,
      userRole,
      playerChoice: finalUserNum,
      opponentChoice: compNum,
      runsScored,
      isWicket: isMatch,
      scoreBefore: score,
      scoreAfter: newScore,
      ballsBowled: nextBallsBowled
    };

    setHistory(prev => [...prev, currentPlay]);

    if (currentInnings === 1) {
      if (isMatch) {
        // OUT
        setIsWicket(true);
        setIsShaking(true);
        setBallOutcome('W');
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
          setBallsBowled(0);
          setUserRole(prev => prev === 'batting' ? 'bowling' : 'batting');
          setPlayerChoice(null);
          setOpponentChoice(null);
          setBallOutcome('-');
          setBigMoment(null);
          setCommentary(`Innings 2: Target is ${score + 1} runs!`);
          setShowOutcome(false);
          setTimerVal(3);
          isProcessing.current = false;
        }, 1500);

      } else {
        // Dot ball or normal runs
        setScore(newScore);
        setBallOutcome(isDotBall ? '0' : runsScored.toString());

        if (runsScored === 4) setBigMoment('four');
        if (runsScored === 6) setBigMoment('six');

        if (isDotBall) {
          setCommentary(userRole === 'batting' ? 'No shot played! Dot ball.' : 'Opponent defended! Dot ball.');
        } else {
          if (userRole === 'batting') {
            setCommentary(`You score ${finalUserNum} run(s)!`);
          } else {
            setCommentary(`Opponent scores ${compNum} run(s)!`);
          }
        }

        // Check if 6 balls completed
        if (nextBallsBowled === 6) {
          if (userRole === 'batting') {
            setUserFinalScore(newScore);
          } else {
            setOpponentFinalScore(newScore);
          }
          setTarget(newScore + 1);

          setTimeout(() => {
            setCurrentInnings(2);
            setScore(0);
            setBallsBowled(0);
            setUserRole(prev => prev === 'batting' ? 'bowling' : 'batting');
            setPlayerChoice(null);
            setOpponentChoice(null);
            setBallOutcome('-');
            setBigMoment(null);
            setCommentary(`Innings 2: 6 balls completed! Target is ${newScore + 1} runs!`);
            setShowOutcome(false);
            setTimerVal(3);
            isProcessing.current = false;
          }, 1500);
        } else {
          setTimeout(() => {
            setPlayerChoice(null);
            setOpponentChoice(null);
            setBigMoment(null);
            setShowOutcome(false);
            setTimerVal(3);
            isProcessing.current = false;
          }, 1500);
        }
      }

    } else {
      // Innings 2 (Chasing target)
      if (isMatch) {
        // OUT
        setIsWicket(true);
        setIsShaking(true);
        setBallOutcome('W');
        setBigMoment('wicket');
        setTimeout(() => setIsShaking(false), 600);

        let finalUser = userFinalScore;
        let finalOpponent = opponentFinalScore;
        if (userRole === 'batting') {
          setUserFinalScore(score);
          finalUser = score;
          setCommentary(`Clean bowled! Opponent matched your ${compNum}!`);
        } else {
          setOpponentFinalScore(score);
          finalOpponent = score;
          setCommentary(`Clean bowled! You got Opponent OUT!`);
        }

        sendMatchResults(finalUser, finalOpponent, [...history, currentPlay]);

        setTimeout(() => {
          setGameState('GAME_OVER');
          setBigMoment(null);
        }, 1500);

      } else {
        // Dot ball or normal runs
        setScore(newScore);
        setBallOutcome(isDotBall ? '0' : runsScored.toString());

        if (runsScored === 4) setBigMoment('four');
        if (runsScored === 6) setBigMoment('six');

        if (isDotBall) {
          setCommentary(userRole === 'batting' ? 'No shot played! Dot ball.' : 'Opponent defended! Dot ball.');
        } else {
          if (userRole === 'batting') {
            setCommentary(`You score ${finalUserNum} run(s)!`);
          } else {
            setCommentary(`Opponent scores ${compNum} run(s)!`);
          }
        }

        // Check victory or over complete
        if (newScore >= target) {
          let finalUser = userFinalScore;
          let finalOpponent = opponentFinalScore;
          if (userRole === 'batting') {
            setUserFinalScore(newScore);
            finalUser = newScore;
          } else {
            setOpponentFinalScore(newScore);
            finalOpponent = newScore;
          }

          sendMatchResults(finalUser, finalOpponent, [...history, currentPlay]);

          setTimeout(() => {
            setGameState('GAME_OVER');
            setBigMoment(null);
          }, 1500);
        } else if (nextBallsBowled === 6) {
          let finalUser = userFinalScore;
          let finalOpponent = opponentFinalScore;
          if (userRole === 'batting') {
            setUserFinalScore(newScore);
            finalUser = newScore;
          } else {
            setOpponentFinalScore(newScore);
            finalOpponent = newScore;
          }

          sendMatchResults(finalUser, finalOpponent, [...history, currentPlay]);

          setTimeout(() => {
            setGameState('GAME_OVER');
            setBigMoment(null);
          }, 1500);
        } else {
          setTimeout(() => {
            setPlayerChoice(null);
            setOpponentChoice(null);
            setBigMoment(null);
            setShowOutcome(false);
            setTimerVal(3);
            isProcessing.current = false;
          }, 1500);
        }
      }
    }
  };

  // Safe handler callback ref for stable timer closures
  const playerChoiceRef = useRef(playerChoice);
  useEffect(() => {
    playerChoiceRef.current = playerChoice;
  }, [playerChoice]);

  // Countdown timer effect
  useEffect(() => {
    if (gameState !== 'PLAYING' || showOutcome || isWicket) {
      return;
    }

    const timer = setInterval(() => {
      setTimerVal((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Transition timerVal to 0 so the progress bar hits 0% and text shows 0s
          // We wait exactly 1 second for this final animation before displaying outcome matchup
          setTimeout(() => {
            setShowOutcome(true);
            evaluatePlay(playerChoiceRef.current);
          }, 1000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, showOutcome, isWicket]);

  // Reset the match and state variables
  const resetGame = () => {
    isProcessing.current = false;
    setGameState('PLAYING');
    setCurrentInnings(1);
    setScore(0);
    setTarget(0);
    setBallsBowled(0);
    setUserFinalScore(null);
    setOpponentFinalScore(null);
    setHistory([]);
    setPlayerChoice(null);
    setOpponentChoice(null);
    setIsWicket(false);
    setBallOutcome('-');
    setTimerVal(3);
    setShowOutcome(false);
    setGameId(generateGameId());
    
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
            userRole={userRole} 
            currentInnings={currentInnings}
            score={score} 
            userFinalScore={userFinalScore}
            opponentFinalScore={opponentFinalScore} 
          />

          {/* Central Scoreboard screen */}
          <BigScreen 
            userRole={userRole} 
            currentInnings={currentInnings}
            score={score} 
            userFinalScore={userFinalScore}
            opponentFinalScore={opponentFinalScore} 
            ballOutcome={ballOutcome} 
            playerChoice={playerChoice} 
            opponentChoice={opponentChoice} 
            countdown={timerVal}
            ballsBowled={ballsBowled}
            showOutcome={showOutcome}
          />

          {/* Commentary Banner */}
          <div className={`zpl-commentary-banner ${isWicket ? 'out-state' : ''}`}>
            {commentary}
          </div>

          {/* Play Cards Grid */}
          <CardDeck 
            isWicket={isWicket} 
            playerChoice={playerChoice} 
            handlePlayBall={handleSelectCard} 
            disabled={showOutcome}
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

