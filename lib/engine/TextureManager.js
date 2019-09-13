

export default class TextureManager{
   constructor(){
      this.texDB = {};
   }

   getTexture(gl, img){
      if (!img instanceof Image || !img.src){
         return undefined;
      }
      
      // find texture in DB
      if (this.texDB.hasOwnProperty(img.src)){
         return this.texDB[img.src].texture;      
      }

      const tex = {
         imgSrc: img.src,
         texture: this._createTexture(gl, img)
      };

      this.texDB[img.src] = tex;

      return tex.texture;
   }

   _createTexture(gl, image){
      let texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);

      // Set the parameters so we can render any size image.
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

      // Upload the image into the texture.
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      return texture;
   }

   _loadImg(imgSrc, callback){
      var image = new Image();
      image.src = imgSrc;
      image.onload = callback;
      return image;
   }
}