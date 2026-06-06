'use client';

export default function GameOver({ 
  userFinalScore, 
  opponentFinalScore, 
  player1, 
  player2, 
  resetGame 
}) {
  const userScoreVal = userFinalScore ?? 0;
  const opponentScoreVal = opponentFinalScore ?? 0;
  let resultMessage = '';

  if (userScoreVal > opponentScoreVal) {
    resultMessage = '🏆 CONGRATS! YOU WON!';
  } else if (opponentScoreVal > userScoreVal) {
    resultMessage = `💀 GAME OVER! OPPONENT WON!`;
  } else {
    resultMessage = '🤝 TIED MATCH! DRAW!';
  }

  return (
    <section className="glass-panel animate-fade-in" style={styles.cardContainer}>
      <h2 style={styles.sectionTitle}>{resultMessage}</h2>
      
      <div style={styles.scoreSummaryCard}>
        <div style={styles.summaryScoreCol}>
          <span style={styles.summaryScoreLabel}>YOUR SCORE</span>
          <span style={{ ...styles.summaryScoreVal, color: 'var(--zpl-blue-light)' }}>{userScoreVal}</span>
        </div>
        <div style={styles.summaryScoreCol}>
          <span style={styles.summaryScoreLabel}>OPPONENT SCORE</span>
          <span style={{ ...styles.summaryScoreVal, color: 'var(--zpl-red)' }}>{opponentScoreVal}</span>
        </div>
      </div>

      <button className="btn-zpl" onClick={resetGame}>Find Next Match</button>
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
    background: 'rgba(255,255,255,0.85)',
    color: '#333333',
    borderRadius: '20px'
  },
  sectionTitle: {
    fontSize: '1.6rem',
    fontWeight: '900',
    letterSpacing: '1px',
  },
  scoreSummaryCard: {
    display: 'flex',
    background: '#ffffff',
    border: '1px solid #e0e0e0',
    borderRadius: '16px',
    padding: '20px 10px',
    width: '100%',
    maxWidth: '400px',
    justifyContent: 'space-around',
    margin: '10px 0',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  },
  summaryScoreCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
  },
  summaryScoreLabel: {
    fontSize: '0.8rem',
    fontWeight: '800',
    color: '#777777',
  },
  summaryScoreVal: {
    fontSize: '2.8rem',
    fontWeight: '900',
  }
};
