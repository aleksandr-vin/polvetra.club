import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Attendee } from './attendee';
import { Args } from './solverArgs';
import { Boat } from './boat';

export interface ConsatisfactionRequest {
  args: Args;
  boats: number[][];
  attendees: Attendee[];
}

export interface ConsatisfactionResponse {
  result: {
    solution: number[];
    groups: Attendee[][];
    attendees: Attendee[];
    captain_groups: number[];
    kids_groups: number[];
    no_kids_groups: number[];
    odd_gender_groups: string[];
    capacities: number[];
    boats: number[][];
    objective_value: number;
    gender_disparity_weight: number;
    lambda_weight: number;
  };
  args: Args;
  consatisfaction_version_info: string;
  meta: Meta;
}

export interface Meta {
  elapsed_time: number;
}

@Injectable({
  providedIn: 'root',
})
export class ConsatisfactionService {
  constructor(private http: HttpClient) {}

  configUrl =
    'https://4cvelnmm67.execute-api.eu-central-1.amazonaws.com/Prod/hello/';

  getSolutionFor(args: Args, boats: Boat[], attendees: Attendee[]) {
    let payload: ConsatisfactionRequest = {
      args: args,
      boats: boats.map((boat) => boat.cabins.map((cabin) => cabin.berths)),
      attendees: attendees,
    };
    return this.http.post<ConsatisfactionResponse>(this.configUrl, payload);
  }
}
