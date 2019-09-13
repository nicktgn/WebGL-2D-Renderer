import glUtils from './webgl_utils.js';
import * as utils from './utils.js';


const DEFAULT_PROGRAM = "default_program";
const DEFAULT_PROGRAM_SOURCES = ["2d-vertex-shader", "2d-fragment-shader"];


export default class ProgramManager{
   constructor(){
      this.programDB = {};
   }

   init(gl){
      this.gl = gl;

      // create default program
      const program = {
         sources: [],
         programInfo: glUtils.createProgramInfo(gl, DEFAULT_PROGRAM_SOURCES)
      };
      program.programInfo.optionsStr = DEFAULT_PROGRAM;
      this.programDB[DEFAULT_PROGRAM] = program;
   }

   getProgramInfo(optionsOrName = DEFAULT_PROGRAM){
      // stringify options or leave the name
      const options = optionsOrName;
      const optionsStr = utils.isString(optionsOrName) ? optionsOrName : JSON.stringify(options);

      let program = this._findInDB(optionsStr);
      if(program){
         return program.programInfo;
      }

      // if no options - return default program
      if (utils.isObjectEmpty(options)){
         program = this.programDB[DEFAULT_PROGRAM];
         return program ? program.programInfo : undefined;
      }

      // no program found - generate new one
      program = this._generateProgram(options, optionsStr);
      return program.programInfo;      
   }

   _findInDB(optionsStr){
      if(this.programDB.hasOwnProperty(optionsStr)){
         return this.programDB[optionsStr];
      }
      return undefined;
   }

   _generateProgram(options, optionsStr){
      const program = {
         sources: [
            this._generateVertexShader(options),
            this._generateFragmentShader(options)
         ],
         optionsStr: optionsStr,
         programInfo: undefined
      };

      console.log(program.sources);

      program.programInfo = glUtils.createProgramInfo(this.gl, program.sources);
      program.programInfo.optionsStr = optionsStr;

      this.programDB[optionsStr] = program;

      return program;
   }

   _generateVertexShader(options){
      const src = `
attribute vec2 a_position;
attribute vec2 a_texCoord;

uniform mat3 u_matrix;

varying vec2 v_texCoord;

void main() {
  gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0, 1);
  v_texCoord = a_texCoord;
}
      `; 
      return src;
   }

   _generateFragmentShader(options){
      const sampler2DList = [];
      const texture2DList = [];

      for (let i = 0; i < options.numTexUnits; i++){
         sampler2DList.push(`uniform sampler2D u_tex${i};`);   
         texture2DList.push(`texture2D(u_tex${i}, v_texCoord)`);
      }
      

      const src = `
precision mediump float;

// blended solid color
uniform vec4 u_color;

// textures
${sampler2DList.join('\n')}
 
// the texCoords passed in from the vertex shader.
varying vec2 v_texCoord;
 
void main() {
   vec4 texColor = vec4(1.0)${texture2DList.length > 0 ? ` * ${texture2DList.join(' * ')}` : ""};
   gl_FragColor = texColor * u_color;
}
      `;
      return src;
   }   

}

ProgramManager.DEFAULT_PROGRAM = DEFAULT_PROGRAM;


