import Node2D from '../2d/Node2D.js';
import DrawInfo from '../DrawInfo.js';

import * as utils from '../utils.js';


export default class Shape2D extends Node2D {
   constructor(mesh){
      super();

      this.drawInfo = new DrawInfo({mesh: mesh});

      this.solidFills = [];
      this.texFills = [];
      this.strokes = [];
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
         this.drawInfo.addOptions({solidColor: color});
         this.solidFills.push(color);
         return true;
      }
      else if (type === 'IMAGE' 
            && this.texFills.length < DrawInfo.MAX_NUM_TEX 
            && image.src && image.complete){
         
         this.drawInfo.addOptions({textures: [image]});
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
      if(type === 'SOLID' && utils.isVec4(color)){
         this.drawInfo.addOptions({stroke: color});
         return true;
      }
      return false;
   }

}