// app/api/port-scanner/route.ts
import { NextRequest, NextResponse } from 'next/server';
import net from 'net';

interface PortScanResult {
  port: number;
  status: 'open' | 'closed' | 'timeout';
}

// Function to check a single port
const checkPort = (port: number, host: string): Promise<PortScanResult> => {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    const timeout = 2000; // 2 seconds timeout for connection

    socket.setTimeout(timeout);

    socket.on('connect', () => {
      socket.destroy();
      resolve({ port, status: 'open' });
    });

    socket.on('timeout', () => {
      socket.destroy();
      resolve({ port, status: 'timeout' });
    });

    socket.on('error', (err: NodeJS.ErrnoException) => {
      // Log specific network errors for better debugging on the server
      console.error(`Socket error for ${host}:${port} - Code: ${err.code}, Message: ${err.message}`);
      socket.destroy();
      resolve({ port, status: 'closed' });
    });

    socket.connect(port, host);
  });
};

export async function POST(request: NextRequest) {
  try {
    const { host, ports } = await request.json();

    if (!host || !ports) {
      return NextResponse.json({ error: 'Host and ports are required.' }, { status: 400 });
    }

    // Basic validation for ports
    const portArray = ports.split(',').map((p: string) => p.trim()).flatMap((p: string) => {
        if(p.includes('-')) {
            const [start, end] = p.split('-').map(Number);
            if(isNaN(start) || isNaN(end) || start > end || start < 1 || end > 65535) return [];
            return Array.from({length: end - start + 1}, (_, i) => start + i);
        }
        const portNum = Number(p);
        if(isNaN(portNum) || portNum < 1 || portNum > 65535) return [];
        return portNum;
    });

    if (portArray.length === 0) {
      return NextResponse.json({ error: 'Invalid port format. Use comma-separated values or ranges (e.g., 80, 443, 8080-8090).' }, { status: 400 });
    }
    
    // Limit the number of ports to scan to prevent abuse
    if (portArray.length > 100) {
        return NextResponse.json({ error: 'Too many ports. Please scan a maximum of 100 ports at a time.'}, { status: 400 });
    }

    const scanPromises = portArray.map((port: number) => checkPort(port, host));
    const results = await Promise.all(scanPromises);
    const openPorts = results.filter(result => result.status === 'open').map(result => result.port);

    return NextResponse.json({ openPorts });

  } catch (error) {
    console.error('Port Scan Error:', error);
    if (error instanceof Error) {
        return NextResponse.json({ error: `An internal error occurred: ${error.message}` }, { status: 500 });
    }
    return NextResponse.json({ error: 'An internal server error occurred during the port scan.' }, { status: 500 });
  }
}
