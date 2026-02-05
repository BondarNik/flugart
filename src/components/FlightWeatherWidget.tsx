import React, { useState, useEffect } from 'react';
import { Cloud, Wind, Eye, Droplets, Thermometer, MapPin, AlertTriangle, CheckCircle, XCircle, Loader2, Search, Calendar, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';

interface WeatherData {
  temperature: number;
  windSpeed: number;
  windDirection: number;
  humidity: number;
  visibility: number;
  precipitation: number;
  cloudCover: number;
  weatherCode: number;
}

interface HourlyForecast {
  time: string;
  temperature: number;
  windSpeed: number;
  precipitation: number;
  visibility: number;
  cloudCover: number;
}

interface ForecastDay {
  date: string;
  tempMax: number;
  tempMin: number;
  windSpeedMax: number;
  precipitation: number;
  weatherCode: number;
  sunrise: string;
  sunset: string;
}

interface LocationData {
  latitude: number;
  longitude: number;
  city?: string;
}

type FlightCondition = 'excellent' | 'good' | 'moderate' | 'poor' | 'dangerous';

const FlightWeatherWidget: React.FC = () => {
  const { language } = useLanguage();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [hourlyForecast, setHourlyForecast] = useState<HourlyForecast[]>([]);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cityQuery, setCityQuery] = useState('');

  const translations = {
    uk: {
      title: 'Погода для польотів',
      getLocation: 'Моє місцезнаходження',
      searchCity: 'Введіть назву міста',
      loading: 'Завантаження...',
      temperature: 'Температура',
      wind: 'Вітер',
      visibility: 'Видимість',
      humidity: 'Вологість',
      precipitation: 'Опади',
      cloudCover: 'Хмарність',
      flightConditions: 'Умови для польоту',
      hourlyTab: 'Погодинно',
      dailyTab: 'По днях',
      sunrise: 'Схід',
      sunset: 'Захід',
      excellent: 'Відмінні',
      good: 'Добрі',
      moderate: 'Помірні',
      poor: 'Погані',
      dangerous: 'Небезпечні',
      excellentDesc: 'Ідеальні умови для польотів',
      goodDesc: 'Сприятливі умови, будьте уважні',
      moderateDesc: 'Обмежені умови, літайте обережно',
      poorDesc: 'Несприятливі умови, рекомендуємо почекати',
      dangerousDesc: 'Небезпечно! Польоти не рекомендуються',
      locationError: 'Геолокація недоступна',
      weatherError: 'Не вдалося отримати дані погоди',
      cityNotFound: 'Місто не знайдено',
      ms: 'м/с',
      km: 'км',
      mm: 'мм',
      north: 'Пн',
      south: 'Пд',
      east: 'Сх',
      west: 'Зх',
      changeLocation: 'Змінити місце',
      today: 'Сьогодні',
      tomorrow: 'Завтра',
      days: ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
    },
    en: {
      title: 'Flight Weather',
      getLocation: 'My Location',
      searchCity: 'Enter city name',
      loading: 'Loading...',
      temperature: 'Temperature',
      wind: 'Wind',
      visibility: 'Visibility',
      humidity: 'Humidity',
      precipitation: 'Precipitation',
      cloudCover: 'Cloud Cover',
      flightConditions: 'Flight Conditions',
      hourlyTab: 'Hourly',
      dailyTab: 'Daily',
      sunrise: 'Sunrise',
      sunset: 'Sunset',
      excellent: 'Excellent',
      good: 'Good',
      moderate: 'Moderate',
      poor: 'Poor',
      dangerous: 'Dangerous',
      excellentDesc: 'Perfect conditions for flying',
      goodDesc: 'Favorable conditions, stay alert',
      moderateDesc: 'Limited conditions, fly carefully',
      poorDesc: 'Unfavorable conditions, recommend waiting',
      dangerousDesc: 'Dangerous! Flying not recommended',
      locationError: 'Geolocation unavailable',
      weatherError: 'Could not fetch weather data',
      cityNotFound: 'City not found',
      ms: 'm/s',
      km: 'km',
      mm: 'mm',
      north: 'N',
      south: 'S',
      east: 'E',
      west: 'W',
      changeLocation: 'Change location',
      today: 'Today',
      tomorrow: 'Tomorrow',
      days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    }
  };

  const t = translations[language];

  const getWindDirection = (degrees: number): string => {
    if (degrees >= 337.5 || degrees < 22.5) return t.north;
    if (degrees >= 22.5 && degrees < 67.5) return `${t.north}${t.east}`;
    if (degrees >= 67.5 && degrees < 112.5) return t.east;
    if (degrees >= 112.5 && degrees < 157.5) return `${t.south}${t.east}`;
    if (degrees >= 157.5 && degrees < 202.5) return t.south;
    if (degrees >= 202.5 && degrees < 247.5) return `${t.south}${t.west}`;
    if (degrees >= 247.5 && degrees < 292.5) return t.west;
    return `${t.north}${t.west}`;
  };

  const assessFlightConditions = (data: { windSpeed: number; precipitation: number; visibility?: number; cloudCover?: number }): FlightCondition => {
    const { windSpeed, precipitation, visibility = 10, cloudCover = 0 } = data;
    
    if (windSpeed > 15 || visibility < 1 || precipitation > 5) return 'dangerous';
    if (windSpeed > 10 || visibility < 3 || precipitation > 2) return 'poor';
    if (windSpeed > 7 || visibility < 5 || precipitation > 0.5 || cloudCover > 80) return 'moderate';
    if (windSpeed > 4 || visibility < 8 || cloudCover > 50) return 'good';
    return 'excellent';
  };

  const getConditionColor = (condition: FlightCondition): string => {
    switch (condition) {
      case 'excellent': return 'text-green-400';
      case 'good': return 'text-emerald-400';
      case 'moderate': return 'text-yellow-400';
      case 'poor': return 'text-orange-400';
      case 'dangerous': return 'text-red-400';
    }
  };

  const getConditionBg = (condition: FlightCondition): string => {
    switch (condition) {
      case 'excellent': return 'bg-green-500/20 border-green-500/30';
      case 'good': return 'bg-emerald-500/20 border-emerald-500/30';
      case 'moderate': return 'bg-yellow-500/20 border-yellow-500/30';
      case 'poor': return 'bg-orange-500/20 border-orange-500/30';
      case 'dangerous': return 'bg-red-500/20 border-red-500/30';
    }
  };

  const getConditionDot = (condition: FlightCondition): string => {
    switch (condition) {
      case 'excellent': return 'bg-green-400';
      case 'good': return 'bg-emerald-400';
      case 'moderate': return 'bg-yellow-400';
      case 'poor': return 'bg-orange-400';
      case 'dangerous': return 'bg-red-400';
    }
  };

  const getConditionIcon = (condition: FlightCondition) => {
    switch (condition) {
      case 'excellent':
      case 'good':
        return <CheckCircle className="h-5 w-5" />;
      case 'moderate':
        return <AlertTriangle className="h-5 w-5" />;
      case 'poor':
      case 'dangerous':
        return <XCircle className="h-5 w-5" />;
    }
  };

  const getConditionLabel = (condition: FlightCondition): string => {
    return t[condition];
  };

  const getConditionDesc = (condition: FlightCondition): string => {
    return t[`${condition}Desc` as keyof typeof t] as string;
  };

  const getDayName = (dateStr: string, index: number): string => {
    if (index === 0) return t.today;
    if (index === 1) return t.tomorrow;
    const date = new Date(dateStr);
    return t.days[date.getDay()];
  };

  const formatTime = (timeStr: string): string => {
    const date = new Date(timeStr);
    return date.toLocaleTimeString(language === 'uk' ? 'uk-UA' : 'en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const formatSunTime = (timeStr: string): string => {
    const date = new Date(timeStr);
    return date.toLocaleTimeString(language === 'uk' ? 'uk-UA' : 'en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const fetchWeather = async (lat: number, lon: number) => {
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation,cloud_cover,visibility,wind_speed_10m,wind_direction_10m,weather_code&hourly=temperature_2m,wind_speed_10m,precipitation,visibility,cloud_cover&daily=temperature_2m_max,temperature_2m_min,wind_speed_10m_max,precipitation_sum,weather_code,sunrise,sunset&wind_speed_unit=ms&forecast_days=7&timezone=auto`
      );
      
      if (!response.ok) throw new Error('Weather fetch failed');
      
      const data = await response.json();
      const current = data.current;
      
      setWeather({
        temperature: current.temperature_2m,
        windSpeed: current.wind_speed_10m,
        windDirection: current.wind_direction_10m,
        humidity: current.relative_humidity_2m,
        visibility: current.visibility / 1000,
        precipitation: current.precipitation,
        cloudCover: current.cloud_cover,
        weatherCode: current.weather_code,
      });

      // Parse hourly forecast (next 24 hours from current time)
      const hourly = data.hourly;
      const now = new Date();
      const currentHourIndex = hourly.time.findIndex((t: string) => new Date(t) >= now);
      const startIndex = Math.max(0, currentHourIndex);
      
      const hourlyData: HourlyForecast[] = hourly.time
        .slice(startIndex, startIndex + 24)
        .map((time: string, i: number) => ({
          time,
          temperature: hourly.temperature_2m[startIndex + i],
          windSpeed: hourly.wind_speed_10m[startIndex + i],
          precipitation: hourly.precipitation[startIndex + i],
          visibility: hourly.visibility[startIndex + i] / 1000,
          cloudCover: hourly.cloud_cover[startIndex + i],
        }));
      setHourlyForecast(hourlyData);

      // Parse daily forecast
      const daily = data.daily;
      const forecastDays: ForecastDay[] = daily.time.map((date: string, i: number) => ({
        date,
        tempMax: daily.temperature_2m_max[i],
        tempMin: daily.temperature_2m_min[i],
        windSpeedMax: daily.wind_speed_10m_max[i],
        precipitation: daily.precipitation_sum[i],
        weatherCode: daily.weather_code[i],
        sunrise: daily.sunrise[i],
        sunset: daily.sunset[i],
      }));
      setForecast(forecastDays);
    } catch (err) {
      setError(t.weatherError);
    }
  };

  const fetchCityName = async (lat: number, lon: number) => {
    try {
      const reverseResponse = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
      );
      if (reverseResponse.ok) {
        const data = await reverseResponse.json();
        return data.address?.city || data.address?.town || data.address?.village || null;
      }
    } catch {
      // Ignore city name errors
    }
    return null;
  };

  const searchCity = async () => {
    if (!cityQuery.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityQuery)}&count=1&language=${language}`
      );
      
      if (!response.ok) throw new Error('City search failed');
      
      const data = await response.json();
      
      if (!data.results || data.results.length === 0) {
        setError(t.cityNotFound);
        setLoading(false);
        return;
      }
      
      const result = data.results[0];
      setLocation({
        latitude: result.latitude,
        longitude: result.longitude,
        city: result.name,
      });
      await fetchWeather(result.latitude, result.longitude);
      setCityQuery('');
    } catch (err) {
      setError(t.cityNotFound);
    }
    
    setLoading(false);
  };

  const getLocation = () => {
    setLoading(true);
    setError(null);
    
    if (!navigator.geolocation) {
      setError(t.locationError);
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const city = await fetchCityName(latitude, longitude);
        setLocation({ latitude, longitude, city: city || undefined });
        await fetchWeather(latitude, longitude);
        setLoading(false);
      },
      () => {
        setError(t.locationError);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  useEffect(() => {
    if (location) {
      const interval = setInterval(() => {
        fetchWeather(location.latitude, location.longitude);
      }, 600000);
      return () => clearInterval(interval);
    }
  }, [location]);

  if (!weather) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border/50 relative z-20">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Cloud className="h-5 w-5 text-cyan-400" />
            {t.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <p className="text-amber-400 text-sm text-center">{error}</p>
          )}
          
          <div className="space-y-3">
            <div className="flex gap-2">
              <Input
                value={cityQuery}
                onChange={(e) => setCityQuery(e.target.value)}
                placeholder={t.searchCity}
                onKeyDown={(e) => e.key === 'Enter' && searchCity()}
                className="bg-background/50"
              />
              <Button 
                onClick={searchCity} 
                disabled={loading || !cityQuery.trim()}
                className="bg-cyan-600 hover:bg-cyan-700"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div className="text-center">
              <Button 
                onClick={getLocation}
                disabled={loading}
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-cyan-400"
              >
                <MapPin className="h-3 w-3 mr-1" />
                {t.getLocation}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const condition = assessFlightConditions(weather);

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50 relative z-20">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cloud className="h-5 w-5 text-cyan-400" />
            {t.title}
          </div>
          {location?.city && (
            <span className="text-sm font-normal text-muted-foreground flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {location.city}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Flight Conditions Assessment */}
        <div className={`p-3 rounded-lg border ${getConditionBg(condition)}`}>
          <div className="flex items-center gap-3">
            <div className={getConditionColor(condition)}>
              {getConditionIcon(condition)}
            </div>
            <div>
              <div className={`font-semibold text-sm ${getConditionColor(condition)}`}>
                {t.flightConditions}: {getConditionLabel(condition)}
              </div>
              <div className="text-xs text-muted-foreground">
                {getConditionDesc(condition)}
              </div>
            </div>
          </div>
        </div>

        {/* Current Weather Grid */}
        <div className="grid grid-cols-4 gap-2">
          <div className="flex flex-col items-center p-2 rounded-lg bg-background/50">
            <Thermometer className="h-4 w-4 text-orange-400 mb-1" />
            <div className="text-xs text-muted-foreground">{t.temperature}</div>
            <div className="font-medium text-sm">{Math.round(weather.temperature)}°C</div>
          </div>

          <div className="flex flex-col items-center p-2 rounded-lg bg-background/50">
            <Wind className="h-4 w-4 text-blue-400 mb-1" />
            <div className="text-xs text-muted-foreground">{t.wind}</div>
            <div className="font-medium text-sm">{weather.windSpeed.toFixed(1)} {t.ms}</div>
          </div>

          <div className="flex flex-col items-center p-2 rounded-lg bg-background/50">
            <Eye className="h-4 w-4 text-cyan-400 mb-1" />
            <div className="text-xs text-muted-foreground">{t.visibility}</div>
            <div className="font-medium text-sm">{weather.visibility.toFixed(0)} {t.km}</div>
          </div>

          <div className="flex flex-col items-center p-2 rounded-lg bg-background/50">
            <Droplets className="h-4 w-4 text-blue-300 mb-1" />
            <div className="text-xs text-muted-foreground">{t.precipitation}</div>
            <div className="font-medium text-sm">{weather.precipitation} {t.mm}</div>
          </div>
        </div>

        {/* Forecast Tabs */}
        <Tabs defaultValue="hourly" className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-8">
            <TabsTrigger value="hourly" className="text-xs flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {t.hourlyTab}
            </TabsTrigger>
            <TabsTrigger value="daily" className="text-xs flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {t.dailyTab}
            </TabsTrigger>
          </TabsList>
          
          {/* Hourly Forecast */}
          <TabsContent value="hourly" className="mt-2">
            <ScrollArea className="w-full whitespace-nowrap">
              <div className="flex gap-2 pb-2">
                {hourlyForecast.map((hour, index) => {
                  const hourCondition = assessFlightConditions({
                    windSpeed: hour.windSpeed,
                    precipitation: hour.precipitation,
                    visibility: hour.visibility,
                    cloudCover: hour.cloudCover,
                  });
                  return (
                    <div 
                      key={hour.time}
                      className="flex flex-col items-center p-2 rounded-lg bg-background/50 min-w-[60px]"
                    >
                      <div className="text-xs text-muted-foreground">
                        {index === 0 ? language === 'uk' ? 'Зараз' : 'Now' : formatTime(hour.time)}
                      </div>
                      <div className={`w-2 h-2 rounded-full my-1 ${getConditionDot(hourCondition)}`} />
                      <div className="text-sm font-medium">{Math.round(hour.temperature)}°</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-0.5">
                        <Wind className="h-2.5 w-2.5" />
                        {Math.round(hour.windSpeed)}
                      </div>
                      {hour.precipitation > 0 && (
                        <div className="text-xs text-blue-400">
                          {hour.precipitation.toFixed(1)}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </TabsContent>

          {/* Daily Forecast */}
          <TabsContent value="daily" className="mt-2">
            <div className="space-y-1">
              {forecast.map((day, index) => {
                const dayCondition = assessFlightConditions({
                  windSpeed: day.windSpeedMax,
                  precipitation: day.precipitation,
                });
                return (
                  <div 
                    key={day.date}
                    className="flex items-center justify-between p-2 rounded-lg bg-background/50"
                  >
                    <div className="flex items-center gap-2 min-w-[80px]">
                      <div className={`w-2 h-2 rounded-full ${getConditionDot(dayCondition)}`} />
                      <span className="text-sm font-medium">{getDayName(day.date, index)}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <span className="text-yellow-400">☀ {formatSunTime(day.sunrise)}</span>
                      <span className="text-orange-400">☾ {formatSunTime(day.sunset)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-xs text-muted-foreground flex items-center gap-0.5">
                        <Wind className="h-3 w-3" />
                        {Math.round(day.windSpeedMax)} {t.ms}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">{Math.round(day.tempMax)}°</span>
                        <span className="text-muted-foreground">/{Math.round(day.tempMin)}°</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>

        {/* Legend */}
        <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground border-t border-border/50 pt-2">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400" /> {t.excellent}</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-400" /> {t.moderate}</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400" /> {t.dangerous}</span>
        </div>

        {/* Change location button */}
        <Button 
          onClick={() => {
            setWeather(null);
            setHourlyForecast([]);
            setForecast([]);
            setLocation(null);
          }} 
          variant="ghost" 
          size="sm" 
          className="w-full text-muted-foreground hover:text-foreground text-xs"
        >
          <MapPin className="h-3 w-3 mr-1" />
          {t.changeLocation}
        </Button>
      </CardContent>
    </Card>
  );
};

export default FlightWeatherWidget;
