# WebGL 2d Renderer Test 

## Features:
   
   - [x] Bacic rendering
   - [x] Scene graph
   - [x] Pan
   - [x] Zoom at the mouse cursor
   - [x] Shapes API (`Rectangle`, `Triangle`):
      
      - [x] `addFill()` with `SOLID` and `IMAGE` fills 
      - [x] `setDimensions()` to set position and size of the shape
      - [x] `addStroke()` with `SOLID` fill
      - [x] `setStrokeWidth()`
      - [x] `setStrokePosition()`
      - [x] Multiple fills are supported (all currently use multiply blend mode)

## TODO:

   - [ ] Add tests
   - [ ] Add webback for bundling
   - [ ] `IMAGE` mode for strokes
   - [ ] Round corners


## USAGE:

Run:

```bash
npm install
npm start 
```
Then open the browser at [http://127.0.0.1:8080](http://127.0.0.1:8080)


For API usage please see `main.js` file.

## API:

### **lib/engine/Engine**

   - **new Engine(canvas)**

   creates new Engine instance. `canvas` is the canvas element to draw on.

   - **init()**

   initializes the WebGL context and all internal parts depending on it

   - **draw()** 

   draws the content of scene tree to the canvas

   - **addContent(fn)**

   `fn` function to add content to scene tree. `fn` should return an array of `Node2D` (or its subclasses) instances. Nodes are rendered in the order they were added to the scene tree.

   - **pan({delta = [0, 0]})**

   pans the camera around the workspace by 2d vector `delta`

   - **zoom({delta = 0, position = [0, 0]})**

   zooms the camera in the workspace by value `delta` at the position on the canvas `position`

   - **resetView()**

   resets zoom and pan state of the camera to default.

### **lib/engine/geometry/Shape2D**
   
   - **new Shape2D(mesh, strokePath, strokePathClosed = false)**

   creates a new Shape2D instance. `mesh` is a structure describing shape's mesh properties (vertices, texture coordinates, etc..). `stokePath` is a list of 2d points describing a stroke path. `strokePathClos` is a flag indicating if the stroke path is closed (first point is connected to the last) or not.

   - **setDimensions({x, y, width, height} = {})**

   sets shape's size (`width` and `height`) and postion (`x` and `y`) in the workspace 

   - **addFill({type, color, image} = {})**

   adds a fill to the shape. If `type` is `SOLID` fills the shape with a `color` (rgba vector). Otherwise if `type` is `IMAGE` fills the shape with the texture provided in `image`. Can be called multiple times. Each successive fill blends with the previous ones (currently using multiply blend).

   - **addStroke({type, color, image} = {})**

   adds a stroke around the bounds of the shape. Can be set to solid color `color` (if `type` is `SOLID`) ~~or can use texture `image` (if `type` is `IMAGE`)~~. `IMAGE` stroke fill currently not working.

   - **setStrokeWidth(width)**

   sets the width of the stroke line

   - **setStrokePosition(position)**

   sets the stroke displacement relative to the edges of the shape. `position` can be `CENTER`, `INSIDE` or `OUTSIDE`.

### **lib/engine/geometry/Rectangle**

   subclass of `Shape2D` drawing the rectangle

### **lib/engine/geometry/Triangle**

   subclass of `Shape2D` drawing the rectangle

