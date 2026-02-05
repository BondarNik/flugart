import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, RefreshCw, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LocationData {
  country: string;
  city: string;
  count: number;
  lat?: number;
  lon?: number;
}

interface VisitorMapProps {
  mapboxToken: string;
}

const VisitorMap: React.FC<VisitorMapProps> = ({ mapboxToken }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [locationData, setLocationData] = useState<LocationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [countryStats, setCountryStats] = useState<{ country: string; count: number }[]>([]);
  const [cityStats, setCityStats] = useState<{ city: string; country: string; count: number }[]>([]);

  const fetchLocationData = async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from("site_analytics")
        .select("country, city")
        .not("country", "is", null);

      if (data) {
        // Aggregate by country
        const countryCounts: Record<string, number> = {};
        const cityCounts: Record<string, { country: string; count: number }> = {};

        data.forEach((item) => {
          if (item.country) {
            countryCounts[item.country] = (countryCounts[item.country] || 0) + 1;
          }
          if (item.city && item.country) {
            const key = `${item.city}, ${item.country}`;
            if (!cityCounts[key]) {
              cityCounts[key] = { country: item.country, count: 0 };
            }
            cityCounts[key].count++;
          }
        });

        const countries = Object.entries(countryCounts)
          .map(([country, count]) => ({ country, count }))
          .sort((a, b) => b.count - a.count);

        const cities = Object.entries(cityCounts)
          .map(([city, data]) => ({ city: city.split(', ')[0], country: data.country, count: data.count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10);

        setCountryStats(countries);
        setCityStats(cities);
      }
    } catch (error) {
      console.error('Error fetching location data:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLocationData();
  }, []);

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      projection: 'globe',
      zoom: 1.5,
      center: [30, 40],
      pitch: 30,
    });

    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    map.current.scrollZoom.disable();

    map.current.on('style.load', () => {
      map.current?.setFog({
        color: 'rgb(10, 22, 40)',
        'high-color': 'rgb(20, 40, 60)',
        'horizon-blend': 0.2,
      });
    });

    // Rotation animation
    const secondsPerRevolution = 240;
    const maxSpinZoom = 5;
    const slowSpinZoom = 3;
    let userInteracting = false;
    let spinEnabled = true;

    function spinGlobe() {
      if (!map.current) return;
      const zoom = map.current.getZoom();
      if (spinEnabled && !userInteracting && zoom < maxSpinZoom) {
        let distancePerSecond = 360 / secondsPerRevolution;
        if (zoom > slowSpinZoom) {
          const zoomDif = (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom);
          distancePerSecond *= zoomDif;
        }
        const center = map.current.getCenter();
        center.lng -= distancePerSecond;
        map.current.easeTo({ center, duration: 1000, easing: (n) => n });
      }
    }

    map.current.on('mousedown', () => { userInteracting = true; });
    map.current.on('dragstart', () => { userInteracting = true; });
    map.current.on('mouseup', () => { userInteracting = false; spinGlobe(); });
    map.current.on('touchend', () => { userInteracting = false; spinGlobe(); });
    map.current.on('moveend', () => { spinGlobe(); });

    spinGlobe();

    return () => {
      map.current?.remove();
    };
  }, [mapboxToken]);

  // Country coordinates for markers (simplified)
  const countryCoords: Record<string, [number, number]> = {
    'Ukraine': [31.1656, 48.3794],
    'United States': [-95.7129, 37.0902],
    'Germany': [10.4515, 51.1657],
    'Poland': [19.1451, 51.9194],
    'United Kingdom': [-3.4360, 55.3781],
    'France': [2.2137, 46.2276],
    'Canada': [-106.3468, 56.1304],
    'Netherlands': [5.2913, 52.1326],
    'Italy': [12.5674, 41.8719],
    'Spain': [-3.7492, 40.4637],
    'Russia': [105.3188, 61.5240],
    'Belarus': [27.9534, 53.7098],
    'Australia': [133.7751, -25.2744],
    'Japan': [138.2529, 36.2048],
  };

  useEffect(() => {
    if (!map.current || countryStats.length === 0) return;

    // Wait for map to load
    const addMarkers = () => {
      countryStats.forEach((stat) => {
        const coords = countryCoords[stat.country];
        if (coords && map.current) {
          // Create marker element
          const el = document.createElement('div');
          el.className = 'visitor-marker';
          el.style.cssText = `
            width: ${Math.min(40, 20 + stat.count * 2)}px;
            height: ${Math.min(40, 20 + stat.count * 2)}px;
            background: radial-gradient(circle, rgba(6, 182, 212, 0.8) 0%, rgba(6, 182, 212, 0.2) 70%);
            border-radius: 50%;
            border: 2px solid #06b6d4;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 10px;
            font-weight: bold;
          `;
          el.innerHTML = stat.count.toString();

          new mapboxgl.Marker(el)
            .setLngLat(coords)
            .setPopup(
              new mapboxgl.Popup({ offset: 25 })
                .setHTML(`<strong>${stat.country}</strong><br/>${stat.count} відвідувачів`)
            )
            .addTo(map.current);
        }
      });
    };

    if (map.current.isStyleLoaded()) {
      addMarkers();
    } else {
      map.current.on('load', addMarkers);
    }
  }, [countryStats]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-6 h-6 text-cyan-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Map */}
      <Card className="bg-[#0a1628]/60 border-cyan-500/20 overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-cyan-400" />
              Географія відвідувачів
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchLocationData}
              className="text-cyan-400 hover:text-cyan-300"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div ref={mapContainer} className="h-[400px] w-full" />
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Countries */}
        <Card className="bg-[#0a1628]/60 border-cyan-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyan-400" />
              Країни
            </CardTitle>
          </CardHeader>
          <CardContent>
            {countryStats.length === 0 ? (
              <p className="text-slate-400 text-sm">Немає даних про геолокацію</p>
            ) : (
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {countryStats.slice(0, 10).map((stat, idx) => {
                  const maxCount = countryStats[0]?.count || 1;
                  const width = (stat.count / maxCount) * 100;
                  return (
                    <div key={idx}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-slate-300 text-sm">{stat.country}</span>
                        <span className="text-cyan-400 text-sm font-mono">{stat.count}</span>
                      </div>
                      <div className="w-full bg-slate-700/30 rounded-full h-1.5">
                        <div 
                          className="bg-cyan-500 h-1.5 rounded-full transition-all duration-500" 
                          style={{ width: `${width}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Cities */}
        <Card className="bg-[#0a1628]/60 border-cyan-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-purple-400" />
              Міста
            </CardTitle>
          </CardHeader>
          <CardContent>
            {cityStats.length === 0 ? (
              <p className="text-slate-400 text-sm">Немає даних про міста</p>
            ) : (
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {cityStats.map((stat, idx) => {
                  const maxCount = cityStats[0]?.count || 1;
                  const width = (stat.count / maxCount) * 100;
                  return (
                    <div key={idx}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-slate-300 text-sm">{stat.city}</span>
                        <span className="text-purple-400 text-sm font-mono">{stat.count}</span>
                      </div>
                      <div className="w-full bg-slate-700/30 rounded-full h-1.5">
                        <div 
                          className="bg-purple-500 h-1.5 rounded-full transition-all duration-500" 
                          style={{ width: `${width}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VisitorMap;
