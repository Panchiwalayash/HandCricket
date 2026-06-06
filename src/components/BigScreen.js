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
  return (
    <section className="stadium-bigscreen">
      <div className="bigscreen-header">
        <span className="bigscreen-title">LIVE STADIUM SCOREBOARD</span>
        <span className="bigscreen-mode">● TRANSMISSION DIRECT</span>
      </div>

      <div className="bigscreen-body">
        {/* Player 1 Metric */}
        <div className="bigscreen-metric-col">
          <span className="bigscreen-label">{player1.name.toUpperCase()} (YOU)</span>
          <span className="bigscreen-value-glow">
            {userRole === 'batting' ? score : opponentFinalScore ?? '-'}
          </span>
          <span style={{ ...styles.choiceLabel, color: 'var(--zpl-blue-light)' }}>
            CHOICE: {playerChoice ?? '-'}
          </span>
        </div>

        {/* Central Reveal */}
        <div className="bigscreen-center-reveal">
          {isThinking ? (
            <div className="thinking-dots-light">
              <span />
              <span />
              <span />
            </div>
          ) : (
            <span className="bigscreen-reveal-num">{ballOutcome}</span>
          )}
          <span style={styles.outcomeLabel}>
            {isThinking ? 'THINKING' : 'OUTCOME'}
          </span>
        </div>

        {/* Player 2 Metric */}
        <div className="bigscreen-metric-col">
          <span className="bigscreen-label">{player2.name.toUpperCase()} (OPP)</span>
          <span className="bigscreen-value-yellow">
            {userRole === 'batting' ? opponentFinalScore ?? '-' : score}
          </span>
          <span style={{ ...styles.choiceLabelOpponent, color: 'var(--zpl-red-light)', opacity: 1 }}>
            CHOICE: {isThinking ? '...' : opponentChoice ?? '-'}
          </span>
        </div>
      </div>
    </section>
  );
}

const styles = {
  choiceLabel: {
    fontSize: '0.75rem',
    color: 'rgba(255,255,255,0.4)',
    fontWeight: '700',
    marginTop: '4px'
  },
  choiceLabelOpponent: {
    fontSize: '0.75rem',
    color: 'var(--zpl-yellow)',
    opacity: 0.8,
    fontWeight: '700',
    marginTop: '4px'
  },
  outcomeLabel: {
    fontSize: '0.6rem',
    color: 'rgba(255,255,255,0.4)',
    fontWeight: '700',
    marginTop: '2px'
  }
};
