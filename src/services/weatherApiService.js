export async function getWeatherForecast(lat, lon, apiKey) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch weather data');
  return await res.json();
}