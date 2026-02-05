import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get client IP from headers
    const forwardedFor = req.headers.get('x-forwarded-for');
    const realIp = req.headers.get('x-real-ip');
    const clientIp = forwardedFor?.split(',')[0]?.trim() || realIp || '';

    console.log('Getting location for IP:', clientIp);

    // Use ip-api.com free API for geolocation (no API key needed)
    const geoResponse = await fetch(`http://ip-api.com/json/${clientIp}?fields=status,country,countryCode,city,lat,lon`);
    
    if (!geoResponse.ok) {
      console.error('Geo API response not OK:', geoResponse.status);
      return new Response(JSON.stringify({ 
        country: null, 
        city: null,
        countryCode: null,
        lat: null,
        lon: null
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const geoData = await geoResponse.json();
    console.log('Geo data:', geoData);

    if (geoData.status === 'success') {
      return new Response(JSON.stringify({
        country: geoData.country,
        countryCode: geoData.countryCode,
        city: geoData.city,
        lat: geoData.lat,
        lon: geoData.lon
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else {
      return new Response(JSON.stringify({ 
        country: null, 
        city: null,
        countryCode: null,
        lat: null,
        lon: null
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch (error: unknown) {
    console.error('Error in get-visitor-location:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ 
      error: errorMessage,
      country: null, 
      city: null,
      countryCode: null,
      lat: null,
      lon: null
    }), {
      status: 200, // Return 200 to not break client
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
