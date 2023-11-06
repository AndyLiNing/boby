import { DogClass } from './internal';
import { FishClass } from './internal';

export class AnimalClass {

  name: string;
  age: number

  constructor(name: string, age:number) {
    this.name = name;
    this.age = age;
  }

  isDog(): boolean{
    return this instanceof DogClass;
  }

  isFish(): boolean{
    return this instanceof FishClass;
  }

}
