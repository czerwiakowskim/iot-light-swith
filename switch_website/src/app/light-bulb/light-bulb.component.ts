import { Component, OnInit } from "@angular/core";
import { LightBulbState } from "./light-bulb-state";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs";
import {
  map,
  timeout,
  catchError,
  retry,
  delay,
  repeat,
  distinctUntilChanged
} from "rxjs/operators";

@Component({
  selector: "app-light-bulb",
  templateUrl: "./light-bulb.component.html",
  styleUrls: ["./light-bulb.component.scss"]
})
export class LightBulbComponent implements OnInit {
  public lightBulbState = LightBulbState;
  public state: LightBulbState; // = LightBulbState.Off;
  public resp: Observable<Response>;

  constructor(private _http: Http) {}

  ngOnInit() {
    this.state = LightBulbState.Off;
    this.getState();
    this.getStatus().subscribe(s => this.state = s);
  }

  public getStatus(): Observable<LightBulbState> {
    return this._http.get("http://light-switch.local/state").pipe(
      map(response => {
        console.log(response);
        return response.json().state === 1
          ? LightBulbState.On
          : LightBulbState.Off;
      }),
      timeout(500),
      catchError(() => {
        return new Observable<LightBulbState>();
      }),
      retry(),
      delay(1500),
      distinctUntilChanged(),
      repeat()
    );
  }

  getState() {
    this._http
      .get("http://light-switch.local/state")
      .toPromise()
      .then(response => {
        console.log(response);
        response.json().state === 1
          ? (this.state = LightBulbState.On)
          : (this.state = LightBulbState.Off);
      });
  }

  switchState() {
    this.state =
      this.state === LightBulbState.Off
        ? LightBulbState.On
        : LightBulbState.Off;
    if (this.state === LightBulbState.On) {
      this._http
        .post("http://light-switch.local/on", null)
        .toPromise()
        .then(() => {});
    } else {
      this._http
        .post("http://light-switch.local/off", null)
        .toPromise()
        .then(() => {});
    }
  }

  getInstruction(): string {
    return this.state === LightBulbState.Off
      ? "Click the light bulb to turn on the light"
      : "Click the light bulb to turn off the light";
  }
}
