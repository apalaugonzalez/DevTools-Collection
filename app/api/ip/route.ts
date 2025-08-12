// app/api/ip/route.ts
import { NextRequest, NextResponse } from 'next/server';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_request: NextRequest) {
  try {
    // For maximum reliability in all environments (local, Docker, Vercel),
    // we will not pass a specific IP to the lookup service.
    // Instead, we let ip-api.com automatically detect the public IP of the server making the request.
    // This avoids issues with private/internal IPs from Docker networks.
    const response = await fetch(`http://ip-api.com/json/`, {
        // A timeout is crucial for handling network issues in production.
        signal: AbortSignal.timeout(5000) // 5-second timeout
    });
    
    if (!response.ok) {
      console.error(`ip-api.com service responded with status: ${response.status} ${response.statusText}`);
      throw new Error(`External IP service failed with status: ${response.status}`);
    }
    
    const data = await response.json();

    if (data.status === 'fail') {
      console.error(`ip-api.com service returned an error: ${data.message}`);
      throw new Error(data.message || 'Failed to get IP information from external service.');
    }

    // Structure the response with the requested details.
    const ipInfo = {
      ip: data.query,
      isp: data.isp,
      city: data.city,
      region: data.regionName,
      country: data.country,
    };
    
    return NextResponse.json(ipInfo);

  } catch (error) {
    // Log the specific error to the server console for better debugging.
    console.error('Error in /api/ip route:', error);

    // Provide a more specific error message to the client.
    if (error instanceof Error) {
        if (error.name === 'TimeoutError' || error.name === 'AbortError') {
            return NextResponse.json({ error: 'The request to the external IP service timed out. This may be due to a network issue in the production environment.' }, { status: 504 }); // Gateway Timeout
        }
        return NextResponse.json({ error: `An internal error occurred: ${error.message}` }, { status: 500 });
    }
    return NextResponse.json({ error: 'Could not determine IP address due to an unexpected error.' }, { status: 500 });
  }
}
