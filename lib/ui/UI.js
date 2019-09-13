import EventEmitter from "./EventEmitter.js";


export default class UI extends EventEmitter {
   
   constructor(canvas){
      super();

      this.canvas = canvas;

      this._setupEventSystem();
   }

   _setupEventSystem(){
      var lastMousePosition = undefined;
      var mouseButton = -1;
      var mousedown = false;
      
      this.canvas.addEventListener('mousedown', (e) => {
         e.preventDefault();
         mouseButton = e.button;
         mousedown = true;
         lastMousePosition = [e.clientX, e.clientY];
      }, false);

      this.canvas.addEventListener('mousemove', (e) => {
         e.preventDefault();
         if (mousedown === true && mouseButton === 0){
            let panEvent = {
               delta: [
                  e.clientX - lastMousePosition[0], 
                  e.clientY - lastMousePosition[1]
               ] 
            };
            this.emit('pan', panEvent);
            lastMousePosition = [e.clientX, e.clientY];
         }
      }, false);

      window.addEventListener('mouseup', (e) => {
         e.preventDefault();
         mousedown = false;
         mouseButton = -1;
      }, false);

      this.canvas.addEventListener('wheel', (e) => {
         e.preventDefault();
         //console.log(`zoom: ${e.deltaY}; ${e.clientX}, ${e.clientY}`);
         if (e.deltaY != 0) {
            let zoomEvent = {
               delta: e.deltaY,
               position: [e.clientX, e.clientY]
            }
            this.emit('zoom', zoomEvent);
         }
      }, false);

      window.addEventListener('keydown', (e) => {
         e.preventDefault();
         //console.log(`keydown: ${e}`);
         if (e.key === 'c'){
            this.emit('resetView');
         }
      }, false);
      
   }

}