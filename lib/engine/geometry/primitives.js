
export let unitTriangle = {
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

export let unitSquare = {
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

export let unitSquareStroke = {
   position: {
      numComponents: 2,
      data: [
         0, 0,
         0, 0,
         1, 0,
         1, 0,
         0, 1,
         0, 1,
         1, 1,
         1, 1
      ]
   },
   normal: {
      numComponents: 2,
      data: [

      ]
   }
};

export let letterF = {
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