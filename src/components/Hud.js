'use client';

export default function Hud({ 
  userRole, 
  currentInnings, 
  score, 
  userFinalScore, 
  opponentFinalScore 
}) {
  const youScore = userRole === 'batting' ? score : (currentInnings === 2 ? userFinalScore : '-');
  const oppScore = userRole === 'bowling' ? score : (currentInnings === 2 ? opponentFinalScore : '-');

  const youIsBatting = userRole === 'batting';
  const oppIsBatting = !youIsBatting;

  return (
    <div style={styles.hudRow}>
      {/* Left Pill (Player 1 - YOU) */}
      <div className="profile-badge-left">
        <div className="avatar-left-edge">{youIsBatting ? '🏏' : '🥎'}</div>
        <span style={styles.badgeName}>YOU</span>
        <div style={styles.badgeRoleContainer}>
          <span className={youIsBatting ? 'role-tag-batting' : 'role-tag-bowling'}>
            {youIsBatting ? '🏏 BATTING' : '🥎 BOWLING'}
          </span>
          <span style={styles.badgeScore}>SCORE: {youScore}</span>
        </div>
      </div>

      {/* Right Pill (Player 2 - OPP) */}
      <div className="profile-badge-right">
        <div className="avatar-right-edge">{oppIsBatting ? '🏏' : '🥎'}</div>
        <span style={styles.badgeName}>OPPONENT</span>
        <div style={styles.badgeRoleContainerRight}>
          <span className={oppIsBatting ? 'role-tag-batting' : 'role-tag-bowling'}>
            {oppIsBatting ? '🏏 BATTING' : '🥎 BOWLING'}
          </span>
          <span style={styles.badgeScore}>SCORE: {oppScore}</span>
        </div>
      </div>
    </div>
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
    marginBottom: '4px',
  },
  badgeRoleContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '6px',
  },
  badgeRoleContainerRight: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '6px',
  },
  badgeScore: {
    fontSize: '0.85rem',
    fontWeight: '800',
    opacity: 0.95,
  }
};

