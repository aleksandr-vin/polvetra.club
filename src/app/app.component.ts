import { Component, OnInit } from '@angular/core';
import { Attendee } from './attendee';
import { Args } from './solverArgs';
import { Boat, Cabin } from './boat';
import {
  ConsatisfactionResponse,
  ConsatisfactionService,
} from './consatisfaction.service';
import {
  MatDialog,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { EditDialogComponent } from './report-dialog/report-dialog.component';

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
  constructor(
    private consatisfactionService: ConsatisfactionService,
    public dialog: MatDialog
  ) {}

  isKidsTheme = false;

  toggleKidsTheme() {
    this.isKidsTheme = !this.isKidsTheme;
    localStorage.setItem('theme', this.isKidsTheme ? 'kids' : '');
  }

  saveData() {
    console.log('Saving everything...');
    localStorage.setItem('solverArgs', JSON.stringify(this.solverArgs));
    localStorage.setItem('attendees', JSON.stringify(this.attendees));
    localStorage.setItem('boats', JSON.stringify(this.boats));
    localStorage.setItem('autosave', this.isAutosaveChecked ? 'true' : 'false');
  }

  restoreData() {
    console.log('Restoring everything...');
    let solverArgs = localStorage.getItem('solverArgs');
    if (solverArgs) {
      this.solverArgs = JSON.parse(solverArgs);
    }

    let attendees = localStorage.getItem('attendees');
    if (attendees) {
      this.attendees = JSON.parse(attendees);
    }

    let boats = localStorage.getItem('boats');
    if (boats) {
      this.boats = JSON.parse(boats);
    }
  }

  timeLeft: number = 60;
  interval: any;

  startAutosave() {
    this.interval = setInterval(() => {
      if (this.isAutosaveChecked) {
        this.saveData();
      } else {
        localStorage.setItem(
          'autosave',
          this.isAutosaveChecked ? 'true' : 'false'
        );
      }
    }, 1000);
  }

  stopAutosave() {
    clearInterval(this.interval);
  }

  isAutosaveChecked: boolean;

  // implement OnInit's `ngOnInit` method
  ngOnInit() {
    this.isKidsTheme = localStorage.getItem('theme') === 'kids' ? true : false;

    this.isAutosaveChecked =
      localStorage.getItem('autosave') === 'false' ? false : true;

    this.restoreData();

    this.startAutosave();

    if (!(this.solverArgs && Object.keys(this.solverArgs).length > 0)) {
      this.resetSolverArgs();
    }

    if (!(this.attendees && this.attendees.length > 0)) {
      this.addRandomAttendee();
      this.addRandomAttendee();
      this.addRandomAttendee();
    }

    if (!(this.boats && this.boats.length > 0)) {
      this.addRandomBoat();
      this.addRandomBoat();
    }
  }

  onResetSolverArgs() {
    this.resetSolverArgs();
    this.saveData();
  }

  resetSolverArgs() {
    this.solverArgs = {
      sail_experience_as_captain: 'капитан',
      skipper_rating_threshold: 0.5,
      kids_age_threshold: 14,
      no_kids_tag: 'no-kids',
      lambda_weight: 10,
      gender_disparity_weight: 100,
    };
  }

  reportProblem() {
    const dialogRef = this.dialog.open(EditDialogComponent, {
      width: '600px',
      enterAnimationDuration: '100ms',
      exitAnimationDuration: '700ms',
      data: {
        attendees: this.attendees,
        solverArgs: this.solverArgs,
        boats: this.boats,
        consatisfactionResponse: this.consatisfactionResponse,
      },
    });

    dialogRef.afterClosed().subscribe((result: string | number) => {
      // alert('Thank you!');
    });
  }

  title = 'Лодочник'; // (⍺-тестирование)
  groupsCount: number = 5;
  attendees: Attendee[];
  solverArgs: Args;
  boats: Boat[];

  consatisfactionComputing: boolean = false;

  changeBerths(cabin: Cabin) {
    if (cabin.berths == 2) {
      cabin.berths = 1;
    } else {
      cabin.berths = 2;
    }
  }

  onDeleteAllBoats() {
    this.boats = [];
  }

  onDeleteAllAtteendees() {
    this.attendees = [];
  }

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

  assignAttendeesToBoats() {
    this.consatisfactionComputing = true;
    this.consatisfactionResponse = undefined;
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
    });
    call.subscribe((data: ConsatisfactionResponse) => {
      this.consatisfactionComputing = false;
    });
  }
}
