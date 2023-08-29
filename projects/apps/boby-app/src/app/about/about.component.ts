import { AfterContentChecked, AfterContentInit, AfterViewChecked, AfterViewInit, Component, OnInit } from '@angular/core';

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit, AfterContentInit, AfterContentChecked, AfterViewInit, AfterViewChecked {
  person!: Person ;
  constructor() {
      this.person = {
        name: 'Person',
        age: 5
      };
  }

  ngOnInit() {
    // *** IMPORTANT:
    // All the values in async call of "ngOnInit" is rendered between "ngAfterContentChecked" and "ngAfterViewInit"
    // *** IMPORTANT:
    setTimeout(() => {
    //   this.person = {
    //     name: 'Person',
    //     age: 5
    //   };
      console.log('ngOnInit setTimeout');
    });
  }

  ngAfterContentInit(): void {
    console.log('ngAfterContentInit');
  }

  ngAfterContentChecked(): void {
    console.log('ngAfterContentChecked');
  }

  ngAfterViewInit(): void {
    console.log('ngAfterViewInit');
  }

  ngAfterViewChecked(): void {
    console.log('ngAfterViewChecked');
  }

}

interface Person {
  name: string;
  age: number;
}
