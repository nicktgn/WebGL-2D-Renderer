import * as mat3 from '../../gl-matrix/mat3.js'

import Transform2D from './Transform2D.js';


export default class Node2D {
   constructor(){
      this.children = []
      this.transform = new Transform2D();

      this.localMatrix = mat3.create();
      this.worldMatrix = mat3.create();
      this._parent = undefined;

      this.drawInfoList = [];
   }

   get parent(){
      return this._parent;
   }

   set parent(parent){
      // remove this node from current parent
      if (this._parent) {
         let ndx = this._parent.children.indexOf(this);
         if (ndx >= 0) {
            this._parent.children.splice(ndx, 1);
         }
      }

      // Add this node to new parent
      if (parent) {
         parent.children.push(this);
      }
      this._parent = parent;
   }

   updateDrawInfo(projection, view, world, drawQueue){
      if (this.drawInfoList.length > 0){
         for(let drawInfo of this.drawInfoList){
            drawInfo.uniforms.u_projection = projection;
            drawInfo.uniforms.u_view = view;
            drawInfo.uniforms.u_model = world;
            drawQueue.push(drawInfo);
         }         
      }
   }

   updateTreeInfo(projection, view, parentWorldMatrix, drawQueue) {
      if (this.transform) {
         this.transform.getMatrix(this.localMatrix);
      }

      // update world matrix
      if (parentWorldMatrix) {
         mat3.multiply(this.worldMatrix, this.localMatrix, parentWorldMatrix);
      } else {
         mat3.copy(this.worldMatrix, this.localMatrix);
      }

      // update drawInfo full matrix and add drawInfo to draw queue
      this.updateDrawInfo(projection, view, this.worldMatrix, drawQueue);

      // update the children
      for(let child of this.children){
         child.updateTreeInfo(projection, view, this.worldMatrix, drawQueue);
      }
   }
}