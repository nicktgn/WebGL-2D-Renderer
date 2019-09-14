import Node2D from '../2d/Node2D.js';
import DrawInfo from '../DrawInfo.js';

import * as utils from '../utils.js';
import * as primitives from './primitives.js';


export default class Shape2D extends Node2D {
   constructor(mesh, strokePath){
      super();

      this.solidFills = [];
      this.texFills = [];
      this.strokes = [];

      this.strokePath = strokePath;

      this.drawInfoList.push(new DrawInfo({mesh: mesh}));
   }

   setDimensions({x, y, width, height} = {}){
      if (x) this.transform.translation[0] = x;
      if (y) this.transform.translation[1] = y;
      if (width) this.transform.scale[0] = width;
      if (height) this.transform.scale[1] = height;
   }

   /**
    * [addFill description]
    * @param {Sting} options.type  'SOLID' for solid color or 'IMAGE' for texture
    * @param {vec4} options.color  RGBA color
    * @param {Image} options.image   loaded Image object; if not loaded will not add fill and return false;
    * @returns {bool} true if successful, otherwise false (for example, if maximum number of textures reached)   
    */
   addFill({type, color, image} = {}){
      if (type === 'SOLID' && utils.isVec4(color)){   
         // blend colors it in addOptions
         this.drawInfoList[0].addOptions({solidColor: color});
         this.solidFills.push(color);
         return true;
      }
      else if (type === 'IMAGE' 
            && this.texFills.length < DrawInfo.MAX_NUM_TEX 
            && image.src && image.complete){
         
         this.drawInfoList[0].addOptions({textures: [image]});
         this.texFills.push(image);
         return true;
      }
      return false;
   }

   /**
    * [addStroke description]
    * @param {Sting} options.type  'SOLID' for solid color or 'IMAGE' for texture
    * @param {vec4} options.color  RGBA color
    * @param {Image} options.image   loaded Image object; if not loaded will not add fill and return false;
    * @returns {bool} true if successful, otherwise false (for example, if maximum number of textures reached)   
    */
   addStroke({type, color, image} = {}){
      if( (type === 'SOLID' && utils.isVec4(color))
         || (type === 'IMAGE' 
            && this.texFills.length < DrawInfo.MAX_NUM_TEX 
            && image.src && image.complete)){            

         // if drawInfo for stroke is not added yet
         if(this.drawInfoList.length == 1){
            const strokeMesh = primitives.createStokePrimitive(this.strokePath);
            this.drawInfoList.push(new DrawInfo({mesh: strokeMesh}));
            
            console.log(strokeMesh);
         }

         this.drawInfoList[1].uniforms.u_thickness = 1;
         this.drawInfoList[1].uniforms.u_aspect = 1.6; //1.6;
         this.drawInfoList[1].uniforms.u_miter = 1;

         const options = {
            progOptions: {
               sources: ['stroke-vertex-shader', '2d-fragment-shader']
            }
         };

         if (color){
            options.solidColor = color;
         }
         else if (image){
            options.textures = [image];
         }
         
         this.drawInfoList[1].addOptions(options);
         return true;
      }
      return false;
   }

}