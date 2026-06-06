'use client';

export default function Hud({ player1, player2, userRole, score, opponentFinalScore, ballHistory }) {
  const p1Avatar = userRole === 'batting' ? '🧤' : '🔴';
  const p2Avatar = userRole === 'batting' ? '🔴' : '🧤';

  return (
    <>
      {/* Top Slanting Profile HUD */}
      <div style={styles.hudRow}>
        {/* Left Pill (Player 1) */}
        <div className="profile-badge-left">
          <div className="avatar-left-edge">{p1Avatar}</div>
          <span style={styles.badgeName}>YOU</span>
          <span style={styles.badgeRole}>
            {userRole === 'batting' ? `BATTING: ${score}` : 'BOWLING'}
          </span>
        </div>

        {/* Right Pill (Player 2) */}
        <div className="profile-badge-right">
          <div className="avatar-right-edge">{p2Avatar}</div>
          <span style={styles.badgeName}>OPP</span>
          <span style={styles.badgeRole}>
            {userRole === 'batting' ? 'BOWLING' : `BATTING: ${score}`}
          </span>
        </div>
      </div>

      {/* Dots Indicator track */}
      <div style={styles.dotsRow}>
        <div className="dots-pill-container">
          {[0, 1, 2, 3, 4, 5].map((idx) => {
            const outcome = ballHistory[idx];
            return (
              <div 
                key={idx} 
                className={`log-dot ${outcome === 'R' ? 'active-run' : outcome === 'W' ? 'active-out' : ''}`} 
              />
            );
          })}
        </div>
      </div>
    </>
  );
}

const styles = {
  hudRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: '10px 10px 0 10px',
  },
  badgeName: {
    fontSize: '1.05rem',
    fontWeight: '900',
  },
  badgeRole: {
    fontSize: '0.8rem',
    opacity: 0.85,
    fontWeight: '700',
  },
  dotsRow: {
    display: 'flex',
    justifyContent: 'center',
    margin: '0 auto',
  }
};
