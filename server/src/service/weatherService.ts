import dotenv from 'dotenv';
dotenv.config();

import axios from 'axios';

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// TODO: Define a class for the Weather object
class Weather {
  constructor(
    public city: string,
    public date: string,
    public temperature: number,
    public humidity: number,
    public windSpeed: number,
    public description: string,
    public icon: string
  ) {}
}

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL = process.env.API_BASE_URL;
  private apiKey = process.env.OPENWEATHER_API_KEY;
  private city: string = '';

  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string) {
    const response = await axios.get(
      `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=1&appid=${this.apiKey}`
    );
    return response.data[0];
  }

  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: any): Coordinates {
    return {
      lat: locationData.lat,
      lon: locationData.lon,
    };
  }

  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {
    return `${this.city}`;
  }

  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=metric`;
  }

  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData() {
    const locationData = await this.fetchLocationData(this.buildGeocodeQuery());
    return this.destructureLocationData(locationData);
  }

  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    const response = await axios.get(this.buildWeatherQuery(coordinates));
    return response.data;
  }

  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any) {
    return new Weather(
      response.city.name,
      new Date(response.list[0].dt * 1000).toDateString(),
      response.list[0].main.temp,
      response.list[0].main.humidity,
      response.list[0].wind.speed,
      response.list[0].weather[0].description,
      response.list[0].weather[0].icon
    );
  }

  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    const forecast = weatherData
      .filter((_, index: number) => index % 8 === 0)
      .map((item: any) =>
        new Weather(
          currentWeather.city,
          new Date(item.dt * 1000).toDateString(),
          item.main.temp,
          item.main.humidity,
          item.wind.speed,
          item.weather[0].description,
          item.weather[0].icon
        )
      );

    return [currentWeather, ...forecast];
  }

  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    this.city = city;
    const coordinates = await this.fetchAndDestructureLocationData();
    const weatherData = await this.fetchWeatherData(coordinates);
    const currentWeather = this.parseCurrentWeather(weatherData);
    return this.buildForecastArray(currentWeather, weatherData.list);
  }
}

export default new WeatherService();