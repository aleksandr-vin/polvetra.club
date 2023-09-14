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
import { deflateRaw, inflateRaw } from 'pako';
import { Router } from '@angular/router';

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

function arrayBufferToBase64(buffer: Uint8Array) {
  var binary = '';
  var bytes = new Uint8Array(buffer);
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

function base64ToArrayBuffer(base64: string) {
  var binary_string = window.atob(base64);
  var len = binary_string.length;
  var bytes = new Uint8Array(len);
  for (var i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}

type State = [Args, Boat[], Attendee[]];

/**
 * Return an url-ready string of encoded state
 */
function encodeState<S>(state: S): string {
  let json = JSON.stringify(state);
  const byteArray = new TextEncoder().encode(json);
  let compressed = deflateRaw(byteArray);
  let base64str = arrayBufferToBase64(compressed);
  let safeStr = base64str; // TODO: subs unsafe chars
  return safeStr;
}

/**
 * Return a decoded state, see [encodeState]
 */
function decodeState<S>(safeStr: string): S {
  let base64str = safeStr; // TODO: subs unsafe chars
  let compressed = base64ToArrayBuffer(base64str);
  let json = inflateRaw(compressed, { to: 'string' });
  let state = JSON.parse(json);
  return state;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private consatisfactionService: ConsatisfactionService,
    public dialog: MatDialog,
    private router: Router
  ) {}

  isKidsTheme = false;

  toggleKidsTheme() {
    this.isKidsTheme = !this.isKidsTheme;
    localStorage.setItem('theme', this.isKidsTheme ? 'kids' : '');
  }

  saveData() {
    // Updating url fragment
    this.saveStateToFragment();

    // To local storate
    localStorage.setItem('solverArgs', JSON.stringify(this.solverArgs));
    localStorage.setItem('attendees', JSON.stringify(this.attendees));
    localStorage.setItem('boats', JSON.stringify(this.boats));
    localStorage.setItem('autosave', this.isAutosaveChecked ? 'true' : 'false');
    console.log('Saved everything');
  }

  saveStateToFragment() {
    let state: State = [this.solverArgs, this.boats, this.attendees];
    let stateFragment: string = encodeState(state);
    // console.log('location.hash', location.hash);
    let urlWithouFragment = location.href.replace(/[#].*$/, '');
    let newUrl = urlWithouFragment + '#' + stateFragment;
    if (
      newUrl.length < 2000 &&
      location.href.replace(/^.*[#]/, '') != stateFragment
    ) {
      console.log(
        'Saving state to fragment, new url size:',
        newUrl.length,
        newUrl
      );
      console.log('compressed state', stateFragment.length);
      this.router.navigate(['/'], { fragment: stateFragment });
    }
  }

  loadStateFromFragment(): boolean {
    let fragment = location.href.replace(/^.*[#]/, '');
    if (fragment.length > 1) {
      console.log('Loading state from fragment of len', fragment.length);
      try {
        let [solverArgs, boats, attendees]: State = decodeState(fragment);
        this.solverArgs = solverArgs;
        this.boats = boats;
        this.attendees = attendees;
        console.log(
          `Loaded ${boats.length} boats and ${attendees.length} attendees`,
          this.solverArgs
        );
        return true;
      } catch (e) {
        console.warn(e);
        console.log('Navigating to /');
        this.router.navigate(['/'], { fragment: '' });
      }
    }
    return false;
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

    if (!this.loadStateFromFragment()) {
      this.restoreData();
    }

    this.startAutosave();

    if (!(this.solverArgs && Object.keys(this.solverArgs).length > 0)) {
      this.resetSolverArgs();
    }

    if (!(this.attendees && this.attendees.length > 0)) {
      Array.from(Array(5).keys()).forEach((x) => {
        this.addRandomAttendee();
      });
    }

    if (!(this.boats && this.boats.length > 0)) {
      Array.from(Array(2).keys()).forEach((x) => {
        this.addRandomBoat();
      });
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
        consatisfactionResponseDate: this.consatisfactionResponseDate,
        consatisfactionRequestId: this.consatisfactionRequestId,
      },
    });

    dialogRef.afterClosed().subscribe((result: string | number) => {
      // alert('Thank you!');
    });
  }

  title = 'Лодочник'; // (⍺-тестирование)
  groupsCount: number = 5;
  attendees: Attendee[] = [];
  solverArgs: Args;
  boats: Boat[] = [];

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
        'капитан',
        'матрос',
        'пассажир',
        'ни разу не бывал на яхте',
      ]),
      skipper_rating: randomChoice([0, 0.5, 1, 1, 1, 1]),
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
  consatisfactionRequestId?: string | null;
  consatisfactionResponseDate?: string | null;

  assignAttendeesToBoats() {
    this.consatisfactionComputing = true;
    this.consatisfactionResponse = undefined;
    let call = this.consatisfactionService.getSolutionFor(
      this.solverArgs,
      this.boats,
      this.attendees
    );
    //call.subscribe((data: ConsatisfactionResponse) => {
    call.subscribe((response) => {
      if (response.body) {
        let data = response.body;
        this.consatisfactionRequestId =
          response.headers.get('x-amzn-requestid');
        this.consatisfactionResponseDate = response.headers.get('Date');
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
      }
      this.consatisfactionComputing = false;
    });
  }
}
