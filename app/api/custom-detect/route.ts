// app/api/custom-detect/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

// Define the structure for a CMS fingerprint
interface CmsFingerprint {
  name: string;
  pattern: RegExp;
}

// A list of CMS fingerprints to check against
const cmsFingerprints: CmsFingerprint[] = [
  { name: 'WordPress', pattern: /wp-content/ },
  { name: 'Shopify', pattern: /cdn\.shopify\.com/ },
  { name: 'Drupal', pattern: /sites\/all\/modules/ },
  { name: 'Joomla', pattern: /media\/com_joomla/ },
  { name: 'Squarespace', pattern: /static\.squarespace\.com/ },
  { name: 'Wix', pattern: /static\.wixstatic\.com/ },
  // Feel free to add more fingerprints here
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    const { data } = await axios.get(url, {
      // It's good practice to set a realistic User-Agent
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36',
      },
      timeout: 5000, // Set a timeout to prevent long-running requests
    });

    const $ = cheerio.load(data);

    // Also check for the generator meta tag
    const generatorTag = $('meta[name="generator"]').attr('content');
    if (generatorTag) {
        return NextResponse.json({ detectedCms: [generatorTag] });
    }

    // Fallback to checking the entire HTML body
    const html = $('html').html();

    if (!html) {
      return NextResponse.json({ message: 'Could not retrieve HTML content.' }, { status: 404 });
    }

    const detectedCms = cmsFingerprints
      .filter(cms => cms.pattern.test(html))
      .map(cms => cms.name);

    if (detectedCms.length > 0) {
      return NextResponse.json({ detectedCms });
    } else {
      return NextResponse.json({ message: 'No specific CMS detected based on current fingerprints.' });
    }
  } catch (error) {
    console.error(error);
    if (axios.isAxiosError(error)) {
        const status = error.response?.status || 500;
        const message = error.response?.statusText || 'Failed to fetch the URL.';
        return NextResponse.json({ error: message }, { status });
    }
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}