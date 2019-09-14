import { disableBodyScroll } from './node_modules/body-scroll-lock/lib/bodyScrollLock.es6.js';

import Engine from './lib/engine/Engine.js';
import UI from './lib/ui/UI.js';

import * as vec2 from './lib/gl-matrix/vec2.js';

import glUtils from './lib/engine/webgl_utils.js';
import DrawInfo from './lib/engine/DrawInfo.js';
import * as primitives from './lib/engine/geometry/primitives.js';

import Shape2D from './lib/engine/geometry/Shape2D.js';
import Rectangle from './lib/engine/geometry/Rectangle.js';
import Triangle from './lib/engine/geometry/Triangle.js';


function main(){
   const canvas = document.getElementById('canvas');
   disableBodyScroll(canvas);
   
   const ui = new UI(canvas);

   const engine = new Engine(canvas);

   if (!engine.init()){
      console.error("Failed to initialize the engine");
      return;
   }

   connectUIEvents(ui, engine);
   

   addContent(engine, createContent, [
      'resources/webgl_logo1.png',
      'resources/leaves.jpg',
      'resources/star.jpg'
   ]).then(() => {
      engine.draw();
   })
}


function connectUIEvents(ui, engine){
   ui.on("pan", (e) => {
      engine.pan(e);
   });

   ui.on("zoom", (e) => {
      //let oldZoom = camTransform.scale[0];  
      //let zoom = Math.min(Math.max(oldZoom + e.delta / 100, zoomRange[0]), zoomRange[1]); 
      engine.zoom(e);
   });

   ui.on("resetView", (e) => {
      engine.resetView();
   });
}

function createContent(images){
   const content = [];

   const f = new Shape2D(primitives.letterF);
   f.addFill({type: 'SOLID', color: [1, 0, 0.5, 1]});
   content.push(f);

   const f2 = new Shape2D(primitives.letterF);
   f2.addFill({type: 'SOLID', color: [0, 1, 0.5, 1]});
   f2.setDimensions({x:512, y:320});
   content.push(f2);

   const f3 = new Shape2D(primitives.letterF);
   f3.addFill({type: 'SOLID', color: [0.5, 0, 1, 1]});
   f3.transform.translation = [512, 320];
   f3.transform.rotation = 180;
   content.push(f3);

   const rect = new Rectangle();
   rect.setDimensions({x: 600, y: 100, width: 300, height: 200});
   //rect.addFill({type:'SOLID', color:[1, 0, 0, 1]});
   //rect.addFill({type:'SOLID', color:[0, 1, 0, 1]});
   //rect.addFill({type:'SOLID', color:[0, 0.5, 0, 1]});
   rect.addFill({type:'IMAGE', image: images[1]});
   rect.addFill({type:'IMAGE', image: images[2]});
   content.push(rect);

   const triangle = new Triangle();
   triangle.setDimensions({x: 200, y: 200, width: 200, height: 400});
   //rect.addFill({type:'SOLID', color:[1, 0, 0, 1]});
   //rect.addFill({type:'SOLID', color:[0, 1, 0, 1]});
   triangle.addFill({type:'SOLID', color:[1, 0, 1, 1]});
   triangle.addFill({type:'SOLID', color:[0.5, 1, 0, 0.5]});
   //rect.addFill({type:'IMAGE', image: images[0]});
   content.push(triangle);

   const rect2 = new Rectangle();
   rect2.setDimensions({x: 650, y: 400, width: 300, height: 200});
   rect2.addFill({type:'SOLID', color:[0.7, 0.7, 0.7, 1]});
   rect2.addStroke({type:'SOLID', color:[1, 0, 0, 1]});
   content.push(rect2);

   return content;
}

async function addContent(engine, createContentFn, imageSources){
   const images = await loadImages(imageSources);

   engine.addContent(() => {
      return createContentFn(images);
   })
}

async function loadImages(imageSources){
   const imagesPromises = []; 
   
   for(var src of imageSources){
      imagesPromises.push(new Promise((resolve, reject) => {
         const image = new Image();
         image.onload = () => {
            resolve(image);   
         };
         image.src = src;
      }));
   }

   return Promise.all(imagesPromises); 
}

main();