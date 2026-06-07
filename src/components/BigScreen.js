'use client';

export default function BigScreen({ 
  userRole, 
  currentInnings,
  score, 
  userFinalScore, 
  opponentFinalScore, 
  ballOutcome, 
  playerChoice, 
  opponentChoice,
  countdown,
  ballsBowled,
  showOutcome
}) {
  // Safe score calculations
  const youScore = userRole === 'batting' ? score : (currentInnings === 2 ? userFinalScore : '-');
  const oppScore = userRole === 'bowling' ? score : (currentInnings === 2 ? opponentFinalScore : '-');

  return (
    <section className="stadium-bigscreen">
      <div className="bigscreen-header">
        <span className="bigscreen-title">STADIUM SCOREBOARD</span>
        <div style={styles.headerRight}>
          <span className="bigscreen-balls">BALLS: {ballsBowled}/6</span>
          <span className="bigscreen-mode">● LIVE</span>
        </div>
      </div>

      <div className="bigscreen-content">
        {!showOutcome ? (
          // Selection phase scoreboard
          <div className="scoreboard-idle">
            <div className="score-row">
              <div className="score-col">
                <span className="player-label">
                  YOU {userRole === 'batting' ? '🏏' : '🥎'}
                </span>
                <span className="player-score">{youScore}</span>
              </div>
              
              <div className="score-divider" />
              
              <div className="score-col">
                <span className="player-label">
                  OPP {userRole === 'bowling' ? '🏏' : '🥎'}
                </span>
                <span className="player-score">{oppScore}</span>
              </div>
            </div>
            
            {/* Visual timer visual progress bar */}
            <div style={styles.timerSection}>
              <span style={styles.timerLabel}>
                {playerChoice ? `🟢 LOCKED SHOT: CARD ${playerChoice}` : '⏳ CHOOSE YOUR CARD NOW'}
              </span>
              <div className="timer-bar-container">
                <div 
                  className={`timer-bar-fill ${countdown <= 1 ? 'alert' : ''}`}
                  style={{ width: `${(countdown / 3) * 100}%` }}
                />
              </div>
              {countdown > 0 ? (
                <span className={`timer-countdown-text ${countdown <= 1 ? 'alert-text' : ''}`}>
                  {countdown} SECONDS LEFT
                </span>
              ) : (
                <span className="timer-countdown-text alert-text">
                  LOCKED!
                </span>
              )}
            </div>
          </div>
        ) : (
          // Outcome reveal scoreboard
          <div className="scoreboard-matchup">
            <div className="matchup-cards">
              <div className="matchup-card you-card">
                <span className="matchup-label">
                  YOU {userRole === 'batting' ? '🏏' : '🥎'}
                </span>
                <div className="matchup-val">{playerChoice === 0 ? '-' : playerChoice}</div>
              </div>
              
              <div className="matchup-vs">VS</div>
              
              <div className="matchup-card opp-card">
                <span className="matchup-label">
                  OPP {userRole === 'batting' ? '🥎' : '🏏'}
                </span>
                <div className="matchup-val opp-val">
                  {opponentChoice === 0 ? '-' : (opponentChoice ?? '?')}
                </div>
              </div>
            </div>

            <div className="matchup-outcome">
              {ballOutcome === 'W' ? (
                <span className="outcome-text outcome-out">🔴 OUT!</span>
              ) : ballOutcome === '0' ? (
                <span className="outcome-text" style={{ color: 'rgba(255,255,255,0.6)' }}>🥎 DOT BALL (0 RUNS)</span>
              ) : (
                <span className="outcome-text outcome-runs">🏏 +{ballOutcome} RUNS</span>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

const styles = {
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  timerSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    marginTop: '10px',
  },
  timerLabel: {
    fontSize: '0.75rem',
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  }
};

