import {toRadians} from '../../gl-matrix/common.js' 
import * as mat3 from '../../gl-matrix/mat3.js';

import Transform2D from './Transform2D.js';


const DEFAULT_ZOOM = 1;
const ZOOM_RANGE = [0.1, 200];

export default class Camera2D{
   constructor(){
      this.transform = new Transform2D();
      this._zoom = DEFAULT_ZOOM;
   }

   get zoom(){
      return this._zoom;
   }

   set zoom(zoom){
      this._zoom = Math.min(Math.max(zoom, ZOOM_RANGE[0]), ZOOM_RANGE[1]);
   }

   getMatrix(out){
      const zoomScale = 1 / this.zoom;

      out = out || new Float32Array(9);
      // compute a matrix from translation, rotation, and scale
      mat3.identity(out);
      mat3.translate(out, out, this.transform.translation);
      mat3.rotate(out, out, this.transform.rotation);
      mat3.scale(out, out, [zoomScale, zoomScale]);

      return out;
   }
}