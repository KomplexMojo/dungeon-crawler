// SharedProperties.ts
import { Property } from "./Property";

export class SharedProperties {
    index: i32;
    name: string;
    description: string;
    properties: Property[];
  
    constructor() {
      this.index = 0;
      this.name = "";
      this.description = "";
      this.properties = [];
    }
  }