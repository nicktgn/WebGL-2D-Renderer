import * as primitives from './primitives.js';
import Shape2D from './Shape2D.js';


export default class Triangle extends Shape2D {
   constructor(){
      super(primitives.unitTriangle);
   }

}