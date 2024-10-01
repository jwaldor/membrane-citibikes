// `nodes` contain any nodes you add from the graph (dependencies)
// `root` is a reference to this program's root node
// `state` is an object that persists across program updates. Store data here.

import { state, root } from "membrane";


async function fetchCitiBikeStations(url) {
      const response = await fetch(url);
      const data = await response.json();
      const stations: Station[] = data.data.stations;
      console.log(stations); // List of stations
      return stations;
  }

function joinStationLists(list1, list2) {
  const stationMap = new Map<string, Station>();

  // Add all stations from list1 to the map
  list1.forEach(station => {
      stationMap.set(station.station_id, station);
  });

  // For each station in list2, add or merge with the map
  list2.forEach(station => {
      const existingStation = stationMap.get(station.station_id);
      if (existingStation) {
          // Merge station data if necessary (can customize this part based on your needs)
          stationMap.set(station.station_id, { ...existingStation, ...station });
      } else {
          stationMap.set(station.station_id, station);
      }
  });

  // Return the merged stations as an array
  return Array.from(stationMap.values());
}


export const Root = {

  async stations() {
    //'https://gbfs.lyft.com/gbfs/2.3/bkn/en/station_status.json'
    const basic_info = await fetchCitiBikeStations('https://gbfs.citibikenyc.com/gbfs/en/station_information.json')
    const availability = await fetchCitiBikeStations('https://gbfs.lyft.com/gbfs/2.3/bkn/en/station_status.json')
    return joinStationLists(basic_info,availability);
  },
};