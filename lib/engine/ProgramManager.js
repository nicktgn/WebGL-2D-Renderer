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
      return program ? program.programInfo : undefined;     
   }

   _findInDB(optionsStr){
      if(this.programDB.hasOwnProperty(optionsStr)){
         return this.programDB[optionsStr];
      }
      return undefined;
   }

   _generateProgram(options, optionsStr){
      const program = {
         sources: [undefined, undefined],
         optionsStr: optionsStr,
         programInfo: undefined
      };

      // if sources provided
      if (options.sources){
         if (options.sources.length != 2){
            console.error("Can't get vetex or fragment source from options: sources array size is wrong");
            return undefined;
         }
         program.sources = options.sources;
      }

      // check if has all sources - if not generate missing ones from options
      if (!program.sources[0]) program.sources[0] = this._generateVertexShader(options);
      if (!program.sources[1]) program.sources[1] = this._generateFragmentShader(options);

      // crete a program
      program.programInfo = glUtils.createProgramInfo(this.gl, program.sources);
      program.programInfo.optionsStr = optionsStr;

      //console.log(program);

      // add it to DB
      this.programDB[optionsStr] = program;

      return program;
   }

   _generateVertexShader(options){
      const src = `
attribute vec2 a_position;
attribute vec2 a_texCoord;

uniform mat3 u_model;
uniform mat3 u_view;
uniform mat3 u_projection;

varying vec2 v_texCoord;

void main() {
   mat3 pvm = u_projection * u_view * u_model;
   gl_Position = vec4((pvm * vec3(a_position, 1)).xy, 0, 1);
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


