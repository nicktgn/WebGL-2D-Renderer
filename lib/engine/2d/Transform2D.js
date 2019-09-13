import {toRadians} from '../../gl-matrix/common.js' 
import * as mat3 from '../../gl-matrix/mat3.js'

/**
 * describes node's transform in 2D: translation, rotation, scale 
 */
export default class Transform2D {
   /**
    * Create a new default transform
    * @param {vec2} translation (in px ?)
    * @param {float} rotation (in degres)
    * @param {vec2} scale 
    */
   constructor(translation = [0, 0], rotation = 0, scale = [1, 1]){
      this.translation = translation
      this.rotation = rotation
      this.scale = scale
   }

   /**
    * generates transform matrix (in local space)
    * @param  {mat2d} out  matrix to write result into
    * @return {mat2d}     `out`, or the new matrix if `out` is undefined
    */
   getMatrix(out){
      out = out || new Float32Array(9);
      // compute a matrix from translation, rotation, and scale
      mat3.fromTranslation(out, this.translation);
      mat3.rotate(out, out, toRadians(this.rotation));
      mat3.scale(out, out, this.scale);
      return out;
   }
}