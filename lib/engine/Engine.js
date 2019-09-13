import * as mat3 from '../gl-matrix/mat3.js'; 
import * as vec2 from '../gl-matrix/vec2.js';
import glUtils from './webgl_utils.js';

import SceneTree2D from './2d/SceneTree2D.js';
import ProgramManager from './ProgramManager.js';
import TextureManager from './TextureManager.js';
import * as utils from './utils.js';


const ZOOM_SPEED = -0.001;

export default class Engine {

   constructor(canvas){
      if(!Engine.instance){
         this.canvas = canvas;
         this.gl = null;
         
         this.programManager = new ProgramManager();
         this.textureManager = new TextureManager();

         this.sceneTree = new SceneTree2D();
         
         Engine.instance = this;
      }

      return Engine.instance;
   }

   init(){
      this.gl = this.canvas.getContext("webgl", {
         premultipliedAlpha: false
      });
      if (!this.gl) {
         return false;
      }

      this.programManager.init(this.gl);

      this.sceneTree.init(this.gl);
      return true;
   }

   draw(){
      const gl = this.gl;

      glUtils.resizeCanvasToDisplaySize(gl.canvas);

      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      //this.gl.enable(this.gl.CULL_FACE);
      //this.gl.enable(this.gl.DEPTH_TEST);
      
      // gray color
      gl.clearColor(0.765625, 0.765625, 0.765625, 1);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      gl.enable(gl.BLEND);
      //gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      
      //gl.enable(gl.SAMPLE_COVERAGE);
      //gl.sampleCoverage(0.5, false);

      this.sceneTree.draw(gl);
   }

   addContent(fn){
      const nodes = fn();

      for(let node of nodes){
         node.parent = this.sceneTree
      }
   }

   pan({delta =[0, 0]} = {delta: [0, 0]}){
      const camTransform = this.sceneTree.camera.transform;

      vec2.add(camTransform.translation, camTransform.translation, delta);

      requestAnimationFrame(() => {
         this.draw();
      });
   }

   zoom({delta = 0, position = [0, 0]} = {delta: 0, position: [0, 0]}){
      const camera = this.sceneTree.camera;
      const camTransform = this.sceneTree.camera.transform;
      
      const zoomDelta = camera.zoom * delta * ZOOM_SPEED;
      
      // position before zooming
      const preZoom = this.screenToWorld(position);

      camera.zoom += zoomDelta;

      this.sceneTree.updateViewProjection(this.gl);

      // position after zooming
      const postZoom = this.screenToWorld(position);

      // camera needs to be moved the difference of before and after
      vec2.add(camTransform.translation, camTransform.translation, 
         vec2.sub(preZoom, preZoom, postZoom));

      requestAnimationFrame(() => {
         this.draw();
      });
   }

   resetView(){
      this.sceneTree.camera.zoom = 1;
      this.sceneTree.camera.transform.translation = [0, 0];

      requestAnimationFrame(() => {
         this.draw();
      });
   }

   screenToWorld(screenPosition){
      const clipPosition = utils.getClipSpaceMousePosition(this.canvas, screenPosition);

      const inverseVP = new Float32Array(9);
      mat3.invert(inverseVP, this.sceneTree.viewProjection);

      const worldPosition = [0, 0];
      return vec2.transformMat3(worldPosition, clipPosition, inverseVP);
   }

}