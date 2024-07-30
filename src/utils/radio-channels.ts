import axios from "axios";

export class Radio {
  constructor() {}

  async getStationsByTag(tag: string) {
    try {
      const response = await axios.get(
        `https://nl1.api.radio-browser.info/json/stations/search?limit=100&tagList=${tag}&hidebroken=true&order=clickcount&reverse=true`
      );
      return response.data;
    } catch (error: any) {
      console.error(error.message);
    }
  }
}
