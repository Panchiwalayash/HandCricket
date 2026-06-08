import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST(request) {
  try {
    const data = await request.json();
    const {
      gameId,
      userFinalScore,
      opponentFinalScore,
      winner,
      history
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
      // Auto-create matches table if it doesn't exist
      await sql`
        CREATE TABLE IF NOT EXISTS matches (
          id SERIAL PRIMARY KEY,
          game_id VARCHAR(50) UNIQUE,
          ip VARCHAR(50),
          user_agent TEXT,
          user_score INT,
          opponent_score INT,
          winner VARCHAR(20),
          history JSONB,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `;

      // Insert record
      await sql`
        INSERT INTO matches (
          game_id, ip, user_agent, user_score, opponent_score, winner, history
        )
        VALUES (
          ${gameId}, ${ip}, ${userAgent}, ${userFinalScore}, ${opponentFinalScore}, ${winner}, ${JSON.stringify(history)}
        )
        ON CONFLICT (game_id) DO NOTHING;
      `;
    }

    return NextResponse.json({ success: true, ip });
  } catch (error) {
    console.error('Error logging match data:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

