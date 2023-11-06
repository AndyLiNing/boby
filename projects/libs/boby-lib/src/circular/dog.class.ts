import { AnimalClass } from './internal';

export class DogClass extends AnimalClass {
  constructor(name: string, age: number) {
    super(name, age);
  }
}
