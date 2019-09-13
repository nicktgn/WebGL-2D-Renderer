import * as mat3 from '../../gl-matrix/mat3.js';

import Node2D from './Node2D.js';
import Camera2D from './Camera2D.js';
import DrawInfo from '../DrawInfo.js';
import * as primitives from '../geometry/primitives.js';


export default class SceneTree2D extends Node2D {
   
   constructor(){
      super();
      
      this.camera = new Camera2D();

      this.projection = undefined;
      this.view = undefined;
      this.viewProjection = undefined;
   }

   init(gl){
      this._workingAreaBG(gl);
   }

   updateViewProjection(gl){
      this.projection = new Float32Array(9);
      mat3.projection(this.projection, gl.canvas.clientWidth, gl.canvas.clientHeight);
      
      this.view = new Float32Array(9);
      mat3.invert(this.view, this.camera.getMatrix());

      this.viewProjection = new Float32Array(9);
      mat3.multiply(this.viewProjection, this.projection, this.view);
   }

   draw(gl){
      this.updateViewProjection(gl);

      // update world matrix for all nodes in scene and add drawable nodes to drawQueue
      let drawQueue = [];
      //this.updateTreeInfo(undefined, viewProjection, drawQueue);
      this.updateTreeInfo(undefined, this.viewProjection, drawQueue);

      let cache = {
         lastUsedProgramInfo: undefined,
         lastUsedBufferInfo: undefined
      };

      for (let drawInfo of drawQueue){
         drawInfo.draw(gl, cache);
      }
   } 

   _workingAreaBG(gl){
      let bg = new Node2D();
      bg.drawInfo = new DrawInfo({solidColor: [1, 1, 1, 1]});
      bg.transform.scale = [gl.canvas.width, gl.canvas.height];

      bg.parent = this;
   }

}