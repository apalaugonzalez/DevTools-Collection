/*
* =======================================================================
* FILE: app/api/analyze/route.ts (Updated)
* =======================================================================
*
* This API route analyzes a given URL to detect the web technologies
* and frameworks it uses. It now works by fetching the site's HTML
* AND its response headers, then searching for specific patterns.
*
* How to use:
* Send a POST request to `/api/analyze` with a JSON body like:
* {
* "url": "https://www.example.com"
* }
*
* UPDATE: Greatly expanded the list of detectable technologies and added
* analysis of server response headers for more accuracy.
* This version also includes TypeScript fixes for type safety.
*/

import { NextResponse } from 'next/server';

// Define the technology signatures we'll be looking for.
// This list is now separated into HTML-based and Header-based patterns.
const techSignatures = {
    html: [
        // JS Frameworks & Libraries
        { name: 'Next.js', pattern: /<div id="__next"|<script id="__NEXT_DATA__"|\/_next\/static\//i },
        { name: 'React', pattern: /data-reactroot/i },
        { name: 'Vue.js', pattern: /<div id="app"|data-v-[a-f0-9]{8}/i },
        { name: 'Angular', pattern: /ng-version/i },
        { name: 'SvelteKit', pattern: /data-sveltekit-preload-data/i },
        { name: 'Gatsby', pattern: /<div id="___gatsby"/i },
        { name: 'Ember.js', pattern: /<div id="ember-view"/i },
        { name: 'jQuery', pattern: /jquery\.js|jquery\.min\.js/i },

        // CMS & Platforms
        { name: 'WordPress', pattern: /(wp-content|wp-includes|content="WordPress)/i },
        { name: 'Shopify', pattern: /(Shopify\.theme|cdn\.shopify\.com|\.myshopify\.com)/i },
        { name: 'Wix', pattern: /(wix\.com|static\.wixstatic\.com)/i },
        { name: 'Squarespace', pattern: /squarespace\.com/i },
        { name: 'Joomla', pattern: /<meta name="generator" content="Joomla!/i },
        { name: 'Drupal', pattern: /<meta name="Generator" content="Drupal/i },
        { name: 'Ghost', pattern: /<meta name="generator" content="Ghost/i },

        // E-commerce
        { name: 'WooCommerce', pattern: /\/plugins\/woocommerce\//i },
        { name: 'Magento', pattern: /magento\/backend\/en_US\/requirejs-config\.js/i },
        { name: 'BigCommerce', pattern: /cdn\.bigcommerce\.com/i },

        // UI Frameworks
        { name: 'Bootstrap', pattern: /bootstrap\.min\.css|data-bs-theme/i },
        { name: 'Tailwind CSS', pattern: /<style>[\s\S]*--tw-/i },

        // Static Site Generators
        { name: 'Hugo', pattern: /<meta name="generator" content="Hugo/i },
        { name: 'Jekyll', pattern: /<meta name="generator" content="Jekyll/i },

        // Analytics
        { name: 'Google Analytics', pattern: /googletagmanager\.com\/gtag\/js|google-analytics\.com\/analytics\.js/i },
    ],
    headers: [
        // Server-side technologies
        { name: 'PHP', key: 'x-powered-by', pattern: /PHP/i },
        { name: 'ASP.NET', key: 'x-powered-by', pattern: /ASP\.NET/i },
        { name: 'Express', key: 'x-powered-by', pattern: /Express/i },

        // Web Servers & Hosting Platforms
        { name: 'Nginx', key: 'server', pattern: /nginx/i },
        { name: 'Apache', key: 'server', pattern: /Apache/i },
        { name: 'Cloudflare', key: 'server', pattern: /cloudflare/i },
        { name: 'Vercel', key: 'x-vercel-id', pattern: /.*/ },
        { name: 'Netlify', key: 'server', pattern: /Netlify/i },
    ]
};

/**
 * Handles POST requests to /api/analyze.
 * Expects a JSON body with a "url" property.
 * @param {Request} request - The incoming request object.
 * @returns {Promise<NextResponse>} A JSON response with the detected technologies.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    let { url } = body;

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    if (!/^https?:\/\//i.test(url)) {
      url = `https://${url}`;
    }

    const response = await fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
        signal: AbortSignal.timeout(8000), 
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
    }

    const html = await response.text();
    const headers = response.headers;

    const detectedTechnologies = new Set<string>(); // Use const as the Set itself is not reassigned

    // 1. Analyze HTML content
    techSignatures.html.forEach(tech => {
      if (tech.pattern.test(html)) {
        detectedTechnologies.add(tech.name);
      }
    });

    // 2. Analyze response headers
    techSignatures.headers.forEach(tech => {
        const headerValue = headers.get(tech.key);
        if (headerValue && tech.pattern.test(headerValue)) {
            detectedTechnologies.add(tech.name);
        }
    });

    // 3. Refine the results
    let finalDetections = Array.from(detectedTechnologies);

    // If Next.js is detected, remove React to avoid redundancy
    if (finalDetections.includes('Next.js')) {
        finalDetections = finalDetections.filter(t => t !== 'React');
    }
    // If WordPress and WooCommerce are detected, just show WooCommerce as it's more specific
    if (finalDetections.includes('WordPress') && finalDetections.includes('WooCommerce')) {
        finalDetections = finalDetections.filter(t => t !== 'WordPress');
    }

    if (finalDetections.length === 0) {
        if (html) {
            finalDetections.push('Generic HTML/JS');
        }
    }

    // 4. Return the results
    return NextResponse.json({
      analyzedUrl: url,
      detected: finalDetections.length > 0 ? finalDetections : ['No specific technologies detected.'],
    });

  } catch (error) {
    console.error('Analysis Error:', error);
    // Type-check the error before accessing its properties
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to analyze the website.', details: errorMessage },
      { status: 500 }
    );
  }
}
