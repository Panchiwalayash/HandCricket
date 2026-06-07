'use client';

export default function CardDeck({ isWicket, playerChoice, handlePlayBall, disabled }) {
  const isDisabled = isWicket || disabled;
  
  return (
    <section style={styles.cardsSection}>
      <div className="zpl-card-deck">
        {[1, 2, 3, 4, 5, 6].map((num) => (
          <button
            key={num}
            disabled={isDisabled}
            className={`flat-card ${playerChoice === num ? 'selected' : ''}`}
            onClick={() => handlePlayBall(num)}
          >
            <span className="card-number">{num}</span>
          </button>
        ))}
      </div>
    </section>
  );
}



const styles = {
  cardsSection: {
    padding: '5px 0',
  }
};

