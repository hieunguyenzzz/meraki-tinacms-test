import { NextResponse } from 'next/server';

/**
 * Health check endpoint for Docker healthcheck
 * Used by docker-compose to verify the app is running
 */
export async function GET() {
  try {
    // Add any additional health checks here (database connection, etc.)
    return NextResponse.json(
      { 
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'meraki-tinacms'
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
