import fs from "fs/promises";
import path from "path";

// Define a City class with name and id properties
class City {
  constructor(public id: string, public name: string) {}
}

// HistoryService class handles reading, writing, adding, and removing cities from searchHistory.json
class HistoryService {
  // Define the path to the searchHistory.json file
  private filePath = path.join(__dirname, "../searchHistory.json"); // Adjusted path to ensure proper file access

  // Read method that reads from the searchHistory.json file
  private async read(): Promise<City[]> {
    try {
      // Read the file content as a string
      const data = await fs.readFile(this.filePath, "utf-8");
      // Parse the JSON string into an array of City objects
      return JSON.parse(data) as City[];
    } catch (error) {
      console.error("Error reading searchHistory.json:", error);
      return []; // Return an empty array if the file doesn't exist or there's an error
    }
  }

  // Write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]): Promise<void> {
    // Convert the cities array to a formatted JSON string and write it to the file
    await fs.writeFile(this.filePath, JSON.stringify(cities, null, 2), "utf-8");
  }

  // getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities(): Promise<City[]> {
    return await this.read(); // Simply calls the private read method
  }

  // addCity method that adds a new city to the searchHistory.json file
  async addCity(cityName: string): Promise<void> {
    const cities = await this.read(); // Read the current list of cities
    const newCity = new City(Date.now().toString(), cityName); // Create a new City object with a unique ID based on the current timestamp
    cities.push(newCity); // Add the new city to the array
    await this.write(cities); // Write the updated array back to the file
  }

  // removeCity method that removes a city from the searchHistory.json file based on its ID
  async removeCity(id: string): Promise<void> {
    let cities = await this.read(); // Read the current list of cities
    cities = cities.filter(city => city.id !== id); // Filter out the city with the matching ID
    await this.write(cities); // Write the updated array back to the file
  }
}

// Export an instance of the HistoryService class for use in other parts of the application
export default new HistoryService();