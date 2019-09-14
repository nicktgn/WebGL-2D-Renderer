
export const unitTriangle = {
   position: {
      numComponents: 2,
      data: [
         0, 0,
         1, 0,
         0, 1
      ]
   },
   texCoord: {
      numComponents: 2,
      data: [
         0, 0,
         1, 0,
         0, 1
      ]
   }
};

export const unitSquare = {
   position: {
      numComponents: 2,
      data: [
         0, 0,
         1, 0,
         0, 1,
         0, 1,
         1, 0,
         1, 1
      ]
   },
   texCoord: {
      numComponents: 2,
      data: [
         0, 0,
         1, 0,
         0, 1,
         0, 1,
         1, 0,
         1, 1
      ]
   }
};


export const letterF = {
   position: {
      numComponents: 2,
      data: [
         // left column
         0, 0,
         30, 0,
         0, 150,
         0, 150,
         30, 0,
         30, 150,

         // top rung
         30, 0,
         100, 0,
         30, 30,
         30, 30,
         100, 0,
         100, 30,

         // middle rung
         30, 60,
         67, 60,
         30, 90,
         30, 90,
         67, 60,
         67, 90,
      ]
   }
};


export const unitSquareStrokePath = {
   numComponents: 2,
   data: [
      0, 0,
      1, 0,
      1, 1,
      0, 1,
   ]
};

export const unitTriangleStrokePath = {
   numComponents: 2,
   data: [
      0, 0,
      1, 0,
      0, 1
   ]
};

export const singleSegmentStrokePath = {
   numComponents: 2,
   data: [
      0, 0,
      1, 0
   ]
};


export function createStokePrimitive(path, closed = false){
   // TODO: guess numComponents?
   const pathData = path.data;
   const numComponents = path.numComponents;
   const numElements = pathData.length / numComponents;
   
   let direction = new Float32Array(numElements);
   direction.fill(1);

   const stroke = {
      position: {
         numComponents: numComponents,
         data: duplicate(pathData, numElements, numComponents)
      },
      direction: {
         numComponents: 1,
         data: duplicate(direction, numElements, 1, true)
      },
      previous: {
         numComponents: numComponents,
         data: duplicate(neighbours(pathData, numElements, numComponents, -1, closed), numElements, numComponents)
      },
      next: {
         numComponents: numComponents,
         data: duplicate(neighbours(pathData, numElements, numComponents, +1, closed), numElements, numComponents)
      },
      indices: {
         numComponents: numComponents,
         data: createStrokeIndices(numElements, closed)
      }
   };

   return stroke;
};


export function duplicate(arr, numElements, numComponents, mirror) {
   const out = [];
   
   for(var i = 0; i < numElements; i++){
      const e = new Float32Array(numComponents*2);
      for(var j = 0; j < numComponents; j++){
         e[numComponents+j] = arr[i * numComponents + j];
         e[j] = mirror ? -e[numComponents+j] : e[numComponents+j];
      }
      Array.prototype.push.apply(out, e);
   }
   return out;
}


export function createStrokeIndices(length, closed = false) {
   const lenMinusOne = length - 1;
   const indices = new Uint16Array(lenMinusOne * 6 + closed*6);
   let c = 0, index = 0;
   for (let j = 0; j < lenMinusOne; j++) {
      let i = index;
      indices[c++] = i + 0;
      indices[c++] = i + 1;
      indices[c++] = i + 2;
      indices[c++] = i + 2;
      indices[c++] = i + 1;
      indices[c++] = i + 3;
      index += 2;
   }
   if (closed){
      let i = index;
      indices[c++] = i + 0;
      indices[c++] = i + 1;
      indices[c++] = 0;
      indices[c++] = 0;
      indices[c++] = i + 1;
      indices[c++] = 1;
   }
   return indices
}

function neighbours(arr, numElements, numComponents, direction, closed = false){
   direction = Math.sign(direction);
   const out = [];

   let count = 0;
   while(count < numElements){
      let i = closed ? wrap(count + direction, 0, numElements - 1) : clamp(count + direction, 0, numElements - 1);
      for(var j = 0; j < numComponents; j++){
         out.push(arr[numComponents * i + j]);
      }
      count++;
   }
   return out;
}


function relative(offset) {
   return (point, index, list) => {
      index = clamp(index + offset, 0, list.length - 1);
      return list[index];
   }
}

function wrap(value, min, max){
   let maxLessMin = max+1 - min;
   return ((value - min) % maxLessMin + maxLessMin) % maxLessMin + min;
}

function clamp(value, min, max) {
   return min < max ?
      (value < min ? min : value > max ? max : value) :
      (value < max ? max : value > min ? min : value);
}