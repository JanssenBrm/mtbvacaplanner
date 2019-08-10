import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs/operators";

@Injectable()
export class LocationService {

  constructor(private http: HttpClient) { }

  API_KEY = 'AIzaSyDCMiWfCYMjwSfTF1QMO4az2TsUrftTNFw';

  getPointsOfInterest(lat, lon, type, range = 10000){
    const url = `/proxy/google/maps/api/place/nearbysearch/json?location=${lon},${lat}&radius=${range}&type=${type}&key=${this.API_KEY}`
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
