import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs/operators";
import {environment} from "../../environments/environment";
/*import { } from '@types/googlemaps';
import LatLng = google.maps.LatLng;*/

@Injectable()
export class LocationService {

  constructor(private http: HttpClient) { }

  API_KEY = 'AIzaSyDCMiWfCYMjwSfTF1QMO4az2TsUrftTNFw';

  getPointsOfInterest(lat, lon, type, range = 10000){

   /* var tmp = document.createElement("div");
    const test = new google.maps.places.PlacesService(tmp);

    test.nearbySearch({
    location: new LatLng(lon, lat),
    radius: range,
    type: type
    }, (results, status, pagination) => {
      console.log("RESULTS", results);
    });*/

    const url = `${environment.GOOGLE_API_URL}/maps/api/place/nearbysearch/json?location=${lon},${lat}&radius=${range}&type=${type}&key=${this.API_KEY}`
    return this.http.get(url, {headers: {
        "Access-Control-Allow-Origin": '*',
        "Access-Control-Allow-Methods": 'GET',
      },}).pipe(
      map((data: any) => {
        const results = data.results.map( r => {
          return {
              location: [r.geometry.location.lng, r.geometry.location.lat],
              name: r.name,
              type: type
          }
        });
        return results;
      })
    )
  }
}
