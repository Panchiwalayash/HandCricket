import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST(request) {
  try {
    const data = await request.json();
    const {
      gameId,
      playerChoice,
      opponentChoice,
      userRole,
      scoreBefore,
      scoreAfter,
      runsScored,
      target,
      currentInnings,
      ballsBowled,
      isWicket
    } = data;

    // Get client IP address from proxy headers
    const ipHeader = request.headers.get('x-forwarded-for');
    const ip = ipHeader
      ? ipHeader.split(',')[0].trim()
      : (request.headers.get('x-real-ip') || '127.0.0.1');

    const userAgent = request.headers.get('user-agent') || 'Unknown';

    // Ensure we only store production entries to the database
    const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production';

    // If Vercel Postgres is connected and we are in production
    if (process.env.POSTGRES_URL && isProduction) {
      // Auto-create plays table if it doesn't exist
      await sql`
        CREATE TABLE IF NOT EXISTS plays (
          id SERIAL PRIMARY KEY,
          game_id VARCHAR(50),
          ip VARCHAR(50),
          user_agent TEXT,
          player_choice INT,
          opponent_choice INT,
          user_role VARCHAR(20),
          score INT,
          score_before INT,
          runs_scored INT,
          target INT,
          innings INT,
          balls_bowled INT,
          is_wicket BOOLEAN,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `;


      // Insert record
      await sql`
        INSERT INTO plays (
          game_id, ip, user_agent, player_choice, opponent_choice, 
          user_role, score, score_before, runs_scored, target, 
          innings, balls_bowled, is_wicket
        )
        VALUES (
          ${gameId}, ${ip}, ${userAgent}, ${playerChoice}, ${opponentChoice}, 
          ${userRole}, ${scoreAfter}, ${scoreBefore}, ${runsScored}, ${target}, 
          ${currentInnings}, ${ballsBowled}, ${isWicket}
        );
      `;
    }

    return NextResponse.json({ success: true, ip });
  } catch (error) {
    console.error('Error logging play data:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

