import { Component, OnInit } from '@angular/core';
import { Attendee } from './attendee';
import { Args } from './solverArgs';
import { Boat, Cabin } from './boat';
import {
  ConsatisfactionResponse,
  ConsatisfactionService,
} from './consatisfaction.service';

function getRandomName(): string {
  return 'Minnie-' + Math.floor(Math.random() * 1000).toString();
}

function getRandomSurname(): string {
  return 'Moocher-' + Math.floor(Math.random() * 1000).toString();
}

function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min);
}

function randomChoice<A>(items: A[]): A {
  return items[Math.floor(Math.random() * items.length)];
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private consatisfactionService: ConsatisfactionService) {}

  isKidsTheme = false;

  toggleKidsTheme() {
    this.isKidsTheme = !this.isKidsTheme;
    localStorage.setItem('theme', this.isKidsTheme ? 'kids' : '');
  }

  // implement OnInit's `ngOnInit` method
  ngOnInit() {
    this.isKidsTheme = localStorage.getItem('theme') === 'kids' ? true : false;

    this.addRandomAttendee();
    this.addRandomAttendee();
    this.addRandomAttendee();

    this.addRandomBoat();
    this.addRandomBoat();
  }

  title = 'Лодочник'; // (⍺-тестирование)
  attendees: Attendee[] = [];
  groupsCount: number = 5;
  solverArgs: Args = {
    sail_experience_as_captain: 'капитан',
    skipper_rating_threshold: 0.5,
    kids_age_threshold: 14,
    no_kids_tag: 'no-kids',
    lambda_weight: 10,
    gender_disparity_weight: 100,
  };
  boats: Boat[] = [];

  consatisfactionComputing: boolean = false;

  onDelete(attendee: Attendee) {
    this.attendees.forEach((value, index) => {
      if (value == attendee) this.attendees.splice(index, 1);
    });
  }

  onAdd() {
    this.addRandomAttendee();
  }

  onAddBoat() {
    this.addRandomBoat();
  }

  onDeleteBoat(boat: Boat) {
    this.boats.forEach((value, index) => {
      if (value == boat) this.boats.splice(index, 1);
    });
  }

  addRandomBoat() {
    let cabins: Cabin[] = [];

    Array.from(Array(randomChoice([1, 2, 3, 4, 5])).keys()).forEach(
      (element) => {
        cabins.push({ berths: randomChoice([1, 2, 2, 2]) });
      }
    );
    this.boats.push({
      cabins: cabins,
    });
  }

  addRandomAttendee() {
    this.attendees.unshift({
      name: getRandomName(),
      surname: getRandomSurname(),
      age: getRandomNumber(1, 99),
      gender: randomChoice(['F', 'M']),
      sail_exp: randomChoice([
        'капитан',
        'матрос',
        'пассажир',
        'ни разу не бывал на яхте',
      ]),
      skipper_rating: randomChoice([0, 0.5, 1, 1]),
      group_id: randomChoice([
        -1,
        -1,
        -1,
        -1,
        -1,
        ...Array.from(Array(this.groupsCount).keys()),
      ]),
      tags: randomChoice(['', '', '', '', '', '', '', '', 'no-kids']),
    });
  }

  consatisfactionResponse?: ConsatisfactionResponse;
  consatisfactionResponseArgs?: string;
  consatisfactionResponseMeta?: string;
  consatisfactionResponseResultBoats?: string;
  consatisfactionResponseStats?: boolean;

  assignAttendeesToBoats() {
    this.consatisfactionComputing = true;
    let call = this.consatisfactionService.getSolutionFor(
      this.solverArgs,
      this.boats,
      this.attendees
    );
    call.subscribe((data: ConsatisfactionResponse) => {
      console.log(data);
      this.consatisfactionResponse = data;
      this.consatisfactionResponseArgs = JSON.stringify(
        this.consatisfactionResponse.args
      );
      this.consatisfactionResponseMeta = JSON.stringify(
        this.consatisfactionResponse.meta
      );
      this.consatisfactionResponseResultBoats = JSON.stringify(
        this.consatisfactionResponse.result.boats
      );

      if (this.consatisfactionResponseStats == undefined) {
        this.consatisfactionResponseStats = true;
      }
    });
    call.subscribe((data: ConsatisfactionResponse) => {
      this.consatisfactionComputing = false;
    });
  }
}
