'use client';

export default function BigScreen({ 
  player1, 
  player2, 
  userRole, 
  score, 
  opponentFinalScore, 
  isThinking, 
  ballOutcome, 
  playerChoice, 
  opponentChoice 
}) {
  const isPlayActive = playerChoice !== null;

  // Derive scores safely
  const youScore = userRole === 'batting' ? score : opponentFinalScore ?? '-';
  const oppScore = userRole === 'batting' ? opponentFinalScore ?? '-' : score;

  return (
    <section className="stadium-bigscreen">
      <div className="bigscreen-header">
        <span className="bigscreen-title">STADIUM SCOREBOARD</span>
        <span className="bigscreen-mode">● LIVE</span>
      </div>

      <div className="bigscreen-content">
        {!isPlayActive ? (
          // Idle State: Clean, simplified scorecard display
          <div className="scoreboard-idle">
            <div className="score-row">
              <div className="score-col">
                <span className="player-label">
                  YOU {userRole === 'batting' && '🧤'}
                </span>
                <span className="player-score">{youScore}</span>
              </div>
              
              <div className="score-divider" />
              
              <div className="score-col">
                <span className="player-label">
                  OPP {userRole === 'bowling' && '🧤'}
                </span>
                <span className="player-score">{oppScore}</span>
              </div>
            </div>
            <div className="score-status">
              {userRole === 'batting' ? '🏏 You are batting' : '🥎 You are bowling'}
            </div>
          </div>
        ) : (
          // Active Confrontation State: Simplified matchup
          <div className="scoreboard-matchup">
            <div className="matchup-cards">
              <div className="matchup-card you-card">
                <span className="matchup-label">YOU</span>
                <div className="matchup-val">{playerChoice}</div>
              </div>
              
              <div className="matchup-vs">VS</div>
              
              <div className="matchup-card opp-card">
                <span className="matchup-label">OPP</span>
                <div className="matchup-val opp-val">
                  {isThinking ? (
                    <div className="thinking-dots-light">
                      <span />
                      <span />
                      <span />
                    </div>
                  ) : (
                    opponentChoice ?? '?'
                  )}
                </div>
              </div>
            </div>

            <div className="matchup-outcome">
              {isThinking ? (
                <span className="outcome-thinking">Opponent is thinking...</span>
              ) : (
                <span className={`outcome-text ${ballOutcome === 'W' ? 'outcome-out' : 'outcome-runs'}`}>
                  {ballOutcome === 'W' ? '🔴 OUT!' : `🏏 +${ballOutcome} RUNS`}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
