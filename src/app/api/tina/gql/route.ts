import { NextRequest, NextResponse } from "next/server";

// Simple local backend for TinaCMS development
// This handles basic GraphQL queries for local content
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  
  // Basic introspection query response
  if (query?.includes('__schema')) {
    return NextResponse.json({
      data: {
        __schema: {
          types: [],
          queryType: { name: "Query" },
          mutationType: { name: "Mutation" }
        }
      }
    });
  }

  // Default response for other queries
  return NextResponse.json({
    data: {},
    errors: [{ message: "Local TinaCMS backend - query not implemented" }]
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Handle basic queries for local development
    if (body.query?.includes('__schema')) {
      return NextResponse.json({
        data: {
          __schema: {
            types: [],
            queryType: { name: "Query" },
            mutationType: { name: "Mutation" }
          }
        }
      });
    }

    // For now, return empty data to prevent authentication errors
    return NextResponse.json({
      data: {},
      errors: [{ message: "Local TinaCMS backend - running in development mode" }]
    });
  } catch (error) {
    return NextResponse.json({
      errors: [{ message: "Invalid request body" }]
    }, { status: 400 });
  }
}
