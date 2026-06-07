'use client';

export default function GameOver({ 
  userFinalScore, 
  opponentFinalScore, 
  resetGame 
}) {
  const userScoreVal = userFinalScore ?? 0;
  const opponentScoreVal = opponentFinalScore ?? 0;
  let resultMessage = '';

  if (userScoreVal > opponentScoreVal) {
    resultMessage = '🏆 CONGRATS! YOU WON!';
  } else if (opponentScoreVal > userScoreVal) {
    resultMessage = '💀 GAME OVER! OPPONENT WON!';
  } else {
    resultMessage = '🤝 TIED MATCH! DRAW!';
  }

  return (
    <section style={styles.cardContainer}>
      <h2 style={styles.sectionTitle}>{resultMessage}</h2>
      
      <div style={styles.scoreSummaryCard}>
        <div style={styles.summaryScoreCol}>
          <span style={styles.summaryScoreLabel}>YOUR SCORE</span>
          <span style={{ ...styles.summaryScoreVal, color: 'var(--zpl-blue-light)' }}>{userScoreVal}</span>
        </div>
        <div style={styles.summaryScoreCol}>
          <span style={styles.summaryScoreLabel}>OPPONENT SCORE</span>
          <span style={{ ...styles.summaryScoreVal, color: 'var(--zpl-red-light)' }}>{opponentScoreVal}</span>
        </div>
      </div>

      <button className="btn-next-match" onClick={resetGame}>Find Next Match</button>
    </section>
  );
}

const styles = {
  cardContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '40px 20px',
    gap: '30px',
    textAlign: 'center',
    background: 'rgba(18, 19, 26, 0.95)',
    border: '3px solid #2b2e3c',
    color: '#ffffff',
    borderRadius: '20px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
  },
  sectionTitle: {
    fontSize: '1.6rem',
    fontWeight: '900',
    letterSpacing: '1px',
    textShadow: '0 0 10px rgba(255,255,255,0.1)',
  },
  scoreSummaryCard: {
    display: 'flex',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    padding: '20px 10px',
    width: '100%',
    maxWidth: '400px',
    justifyContent: 'space-around',
    margin: '10px 0',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
  },
  summaryScoreCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
  },
  summaryScoreLabel: {
    fontSize: '0.85rem',
    fontWeight: '800',
    color: 'rgba(255, 255, 255, 0.5)',
    letterSpacing: '1px',
  },
  summaryScoreVal: {
    fontSize: '2.8rem',
    fontWeight: '900',
    textShadow: '0 0 12px rgba(255, 255, 255, 0.1)',
  }
};

