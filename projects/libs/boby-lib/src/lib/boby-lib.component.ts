import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'lib-boby-lib',
  template: `
    <p>
      boby-lib works!
    </p>
    <div class="input-group">
      <span class="input-group-text">First and last name</span>
      <input type="text" aria-label="First name" class="form-control">
      <input type="text" aria-label="Last name" class="form-control">
    </div>
    <br>
    <br>
    <br>
    <div class="input-group mb-3">
      <span class="input-group-text" id="basic-addon1">@</span>
      <input type="text" class="form-control" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1">
    </div>

    <br>
    <br>
    <br>
    <button type="button" class="btn btn-primary">Primary</button>
    <button type="button" class="btn btn-secondary">Secondary</button>
    <button type="button" class="btn btn-success">Success</button>
    <button type="button" class="btn btn-danger">Danger</button>
    <button type="button" class="btn btn-warning">Warning</button>
    <button type="button" class="btn btn-info">Info</button>

  `,
  styles: [
  ]
})
export class BobyLibComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
