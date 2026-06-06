'use client';

export default function BigMoment({ bigMoment }) {
  if (!bigMoment) return null;

  return (
    <>
      {bigMoment === 'four' && (
        <div className="big-moment-overlay four-moment">
          <div className="big-moment-text">FOUR!</div>
          <div className="big-moment-subtext">CRACKING BOUNDARY!</div>
        </div>
      )}

      {bigMoment === 'six' && (
        <div className="big-moment-overlay six-moment">
          <div className="big-moment-text">SIXER!</div>
          <div className="big-moment-subtext">MAXIMUM POWER!</div>
        </div>
      )}

      {bigMoment === 'wicket' && (
        <div className="big-moment-overlay wicket-moment">
          <div className="big-moment-text">WICKET!</div>
          <div className="big-moment-subtext">CLEAN BOWLED!</div>
        </div>
      )}
    </>
  );
}
