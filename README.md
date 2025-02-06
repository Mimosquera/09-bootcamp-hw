# Weather Dashboard

## Description

The **Weather Dashboard** is a full-stack web application that allows users to search for the current weather conditions and a 5-day forecast for cities around the world. It utilizes the OpenWeather API to fetch weather data and maintains a search history for easy access to previously searched cities.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [API Information](#api-information)
- [Deployment](#deployment)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)

## Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/your-username/weather-dashboard.git
   cd weather-dashboard
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Environment Variables:**
   Create a `.env` file in the root directory and add your OpenWeather API key:
   ```env
   OPENWEATHER_API_KEY=your_api_key_here
   API_BASE_URL=https://api.openweathermap.org/data/2.5
   ```

4. **Run the Application Locally:**
   ```bash
   npm run dev
   ```

## Usage

- **Search for a City:** Enter the name of a city in the search bar and submit to view current weather and a 5-day forecast.
- **View Search History:** Click on any city in the search history to quickly view its weather data again.
- **Delete Search History:** Use the delete button next to a city in the history to remove it from the list.

## Features

- Displays current weather with temperature, wind speed, humidity, and an icon representing the weather conditions.
- Provides a 5-day weather forecast with daily weather details.
- Stores search history locally, allowing quick access to previously searched cities.
- Responsive design for both desktop and mobile devices.

## API Information

This application utilizes the [OpenWeather 5-Day Forecast API](https://openweathermap.org/forecast5) for retrieving weather data.

### Example API Request
```bash
https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
```

## Deployment

The application is deployed on Render. Visit the live site here:

[Live Application](https://your-render-app-url.com)

## Technologies Used

- **Frontend:** HTML, CSS, TypeScript
- **Backend:** Node.js, Express.js
- **API:** OpenWeather API
- **Database:** JSON file (`db.json`) for storing search history
- **Other Tools:** dotenv, uuid, axios

## Contributing

1. Fork the repository.
2. Create your feature branch:
   ```bash
   git checkout -b feature/YourFeature
   ```
3. Commit your changes:
   ```bash
   git commit -m 'Add new feature'
   ```
4. Push to the branch:
   ```bash
   git push origin feature/YourFeature
   ```
5. Open a pull request.

## License

N/A