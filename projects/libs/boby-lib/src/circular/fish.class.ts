import { AnimalClass } from './internal';

export class FishClass extends AnimalClass {
  constructor(name: string, age: number) {
    super(name, age);
  }
}
