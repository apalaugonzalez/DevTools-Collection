// app/api/pagespeed/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const urlToAnalyze = searchParams.get('url');

    if (!urlToAnalyze) {
      return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
    }

    const apiKey = process.env.PAGESPEED_API_KEY;

    if (!apiKey) {
      console.error('PAGESPEED_API_KEY is not set in .env.local');
      return NextResponse.json(
        { error: 'API key is not configured on the server.' },
        { status: 500 }
      );
    }

    // --- START OF THE FIX ---
    // Use .append() instead of .set() to include all categories in the request.
    const googleApiUrl = new URL('https://www.googleapis.com/pagespeedonline/v5/runPagespeed');
    googleApiUrl.searchParams.set('url', urlToAnalyze);
    googleApiUrl.searchParams.set('key', apiKey);
    googleApiUrl.searchParams.append('category', 'PERFORMANCE');
    googleApiUrl.searchParams.append('category', 'ACCESSIBILITY');
    googleApiUrl.searchParams.append('category', 'BEST_PRACTICES');
    googleApiUrl.searchParams.append('category', 'SEO');
    // By default, the API uses a 'mobile' strategy. You can change it to 'desktop'.
    googleApiUrl.searchParams.set('strategy', 'desktop'); 
    // --- END OF THE FIX ---

    const apiResponse = await fetch(googleApiUrl.toString());
    const data = await apiResponse.json();

    return NextResponse.json(data, { status: apiResponse.status });

  } catch (error) {
    console.error('Internal Server Error:', error);
    return NextResponse.json(
      { error: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}
