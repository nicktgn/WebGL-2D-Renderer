import glUtils from './webgl_utils.js';
import * as mat3 from '../gl-matrix/mat3.js';
import * as vec4 from '../gl-matrix/vec4.js';

import Engine from './Engine.js';
import * as primitives from './geometry/primitives.js';

import * as utils from './utils.js';


const DEFAULT_COLOR = [1, 1, 1, 1];
const MAX_COLOR = [1, 1, 1, 1];
const MAX_NUM_TEX = 16;

export default class DrawInfo {
   constructor(options){   
      this.options = {
         mesh: primitives.unitSquare, 
         solidColor: DEFAULT_COLOR
      };
      this.pendingChanges = {mesh: true, solidColor: true};

      this.programInfo = Engine.instance.programManager.getProgramInfo();
      this.bufferInfo = undefined;
      this.uniforms = {};

      this.setOptions(options);
   }

   /**
    * sets the options 
    * @param {Object} mesh  prmitive type object; see 'lib/engine/geometry/primitives.js'
    * @param {vec4} solidColor  RGBA solid fill color 
    * @param {Array} textures array of textures
    * @param {Object} progOptions  program options used with ProgramManager
    */
   setOptions({mesh, solidColor, textures, progOptions} = {}){
      if (mesh){
         this.options.mesh = mesh;
         this.pendingChanges.mesh = true;  
      } 
      if (solidColor){
         this.options.solidColor = solidColor;
         this.pendingChanges.solidColor = true;
      }
      if (textures){
         this.options.textures = textures;
         this.pendingChanges.textures = true;
      }
      // TODO: better comparison?
      if (progOptions && this.options.progOptions !== progOptions){
         this.options.progOptions = progOptions;
         this.pendingChanges.progOptions = true;
      }
   }

   /**
    * Adds options to existing ones
    * @param {Object} mesh  prmitive type object; see 'lib/engine/geometry/primitives.js'
    * @param {vec4} solidColor  RGBA solid fill color (multiplied to already exisitng color)
    * @param {Array} textures array of textures
    * @param {Object} progOptions  program options used with ProgramManager
    */
   addOptions({mesh, solidColor, textures, progOptions} = {}){
      if (mesh){
         this.options.mesh = mesh;
         this.pendingChanges.mesh = true;  
      }
      if (solidColor){
         const prevColor = this.options.solidColor;
         this.options.solidColor = prevColor ? utils.blendColor('MUL', prevColor, solidColor) : solidColor;
         this.pendingChanges.solidColor = true;
      } 
      if (textures){
         const prevTextures = this.options.textures;
         this.options.textures = prevTextures ? prevTextures.concat(textures) : textures;
         this.pendingChanges.textures = true;
      }
      if (progOptions && this.options.progOptions !== progOptions){
         // TODO: maybe use Object.assign() ?
         this.options.progOptions = progOptions;
         this.pendingChanges.progOptions = true;
      }
   }

   _applyPendingChanges(gl){
      const programManager = Engine.instance.programManager;
      const textureManager = Engine.instance.textureManager;
      const programOptions = {};

      if (this.pendingChanges.mesh){
         const mesh = this.options.mesh;
         this.bufferInfo = glUtils.createBufferInfoFromArrays(gl, mesh);
         this.pendingChanges.mesh = false;
      }

      if (this.pendingChanges.solidColor){
         this.uniforms.u_color = this.options.solidColor;
         this.pendingChanges.solidColor = false;
      }

      if (this.pendingChanges.textures){
         const textures = this.options.textures;
         for(var i=0; i<textures.length; i++){
            this.uniforms[`u_tex${i}`] = textureManager.getTexture(gl, textures[i]);
         }
         programOptions.numTexUnits = textures.length;      
         this.pendingChanges.textures = false;
      }

      if (this.pendingChanges.progOptions){
         Object.assign(programOptions, this.options.progOptions);
         this.pendingChanges.programOptions = false;
      }

      // need new program?
      if (!utils.isObjectEmpty(programOptions)){
         this.programInfo = programManager.getProgramInfo(programOptions);
      }
   }

   draw(gl, cache){
      this._applyPendingChanges(gl);

      let bindBuffers = false;

      console.log("drawing..");

      if (this.programInfo.optionsStr === '{"sources":["stroke-vertex-shader","2d-fragment-shader"]}'){
         console.log("drawing stroke");
      }

      if (this.programInfo !== cache.lastUsedProgramInfo) {
         cache.lastUsedProgramInfo = this.programInfo;
         gl.useProgram(this.programInfo.program);

         // We have to rebind buffers when changing programs because we
         // only bind buffers the program uses. So if 2 programs use the same
         // bufferInfo but the 1st one uses only positions the when the
         // we switch to the 2nd one some of the attributes will not be on.
         bindBuffers = true;
      }

      // Setup all the needed attributes.
      if (bindBuffers || this.bufferInfo !== cache.lastUsedBufferInfo) {
         cache.lastUsedBufferInfo = this.bufferInfo;
         glUtils.setBuffersAndAttributes(gl, this.programInfo, this.bufferInfo);
      }

      // Set the uniforms.
      glUtils.setUniforms(this.programInfo, this.uniforms);

      // Draw
      glUtils.drawBufferInfo(gl, this.bufferInfo);
   }
}

DrawInfo.MAX_COLOR = MAX_COLOR;
DrawInfo.MAX_NUM_TEX = MAX_NUM_TEX;