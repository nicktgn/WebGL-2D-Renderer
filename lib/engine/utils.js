import * as vec4 from '../gl-matrix/vec4.js';


const MAX_COLOR = [1, 1, 1, 1];
const MIN_COLOR = [0, 0, 0, 0];


export function getClipSpaceMousePosition(canvas, mousePosition) {
   // get canvas relative css position
   const rect = canvas.getBoundingClientRect();
   const cssX = mousePosition[0] - rect.left;
   const cssY = mousePosition[1] - rect.top;

   // get normalized 0 to 1 position across and down canvas
   const normalizedX = cssX / canvas.clientWidth;
   const normalizedY = cssY / canvas.clientHeight;

   // convert to clip space
   const clipX = normalizedX * 2 - 1;
   const clipY = normalizedY * -2 + 1;

   return [clipX, clipY];
}


export function isString(str){
   return str.constructor === String;
}

export function isObjectEmpty(obj){
   return Object.keys(obj).length === 0 && obj.constructor === Object;
}


export function isVec4(vec4){
   // TODO: do more checks?
   if (vec4 && vec4.length == 4){ 
      return true;
   }
   return false;
}


export function blendColor(type, colorA, colorB, out){
   out = out || new Float32Array(4); 
   if (type === 'ADD'){
      return vec4.min(out, vec4.add(out, colorA, colorB), MAX_COLOR);
   } else if (type === 'MUL'){
      return vec4.mul(out, colorA, colorB);  
   } else if (type === 'NORMAL'){
      return colorB;
   }
}
