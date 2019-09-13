import { disableBodyScroll } from './node_modules/body-scroll-lock/lib/bodyScrollLock.es6.js';

import Engine from './lib/engine/Engine.js';
import UI from './lib/ui/UI.js';

import * as vec2 from './lib/gl-matrix/vec2.js';

import Node2D from './lib/engine/2d/Node2D.js';
import glUtils from './lib/engine/webgl_utils.js';
import DrawInfo from './lib/engine/DrawInfo.js';
import * as primitives from './lib/engine/geometry/primitives.js';

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

   const fNode = new Node2D();
   fNode.drawInfo = new DrawInfo({mesh: primitives.letterF, solidColor: [1, 0, 0.5, 1]});
   content.push(fNode);

   const fNode2 = new Node2D();
   fNode2.drawInfo = new DrawInfo({mesh: primitives.letterF, solidColor: [0, 1, 0.5, 1]});
   fNode2.transform.translation = [512, 320];
   content.push(fNode2);

   const fNode3 = new Node2D();
   fNode3.drawInfo = new DrawInfo({mesh: primitives.letterF, solidColor: [0.5, 0, 1, 1]});
   fNode3.transform.translation = [512, 320];
   fNode3.transform.rotation = 180;
   content.push(fNode3);


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