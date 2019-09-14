attribute vec2 a_position;
attribute float a_direction; 
attribute vec2 a_next;
attribute vec2 a_previous;

uniform mat3 u_matrix;
uniform float u_aspect;
uniform float u_thickness;
uniform int u_miter;

void main() {
   vec2 aspectVec = vec2(u_aspect, 1.0);
  
   vec4 previousProjected = vec4((u_matrix * vec3(a_previous, 1)).xy, 0, 1);
   vec4 currentProjected = vec4((u_matrix * vec3(a_position, 1)).xy, 0, 1);
   vec4 nextProjected = vec4((u_matrix * vec3(a_next, 1)).xy, 0, 1);

   //get 2D screen space with W divide and aspect correction
   vec2 currentScreen = currentProjected.xy / currentProjected.w * aspectVec;
   vec2 previousScreen = previousProjected.xy / previousProjected.w * aspectVec;
   vec2 nextScreen = nextProjected.xy / nextProjected.w * aspectVec;

   float len = u_thickness;
   float orientation = a_direction;

   //starting point uses (next - current)
   vec2 dir = vec2(0.0);
   if (currentScreen == previousScreen) {
      dir = normalize(nextScreen - currentScreen);
   } 
   //ending point uses (current - previous)
   else if (currentScreen == nextScreen) {
      dir = normalize(currentScreen - previousScreen);
   }
   //somewhere in middle, needs a join
   else {
      //get directions from (C - B) and (B - A)
      vec2 dirA = normalize((currentScreen - previousScreen));
      if (u_miter == 1) {
         vec2 dirB = normalize((nextScreen - currentScreen));
         //now compute the miter join normal and length
         vec2 tangent = normalize(dirA + dirB);
         vec2 perp = vec2(-dirA.y, dirA.x);
         vec2 miter = vec2(-tangent.y, tangent.x);
         dir = tangent;
         len = u_thickness / dot(miter, perp);
      } else {
         dir = dirA;
      }
   }
   vec2 normal = vec2(-dir.y, dir.x);
   normal *= len/2.0;
   normal.x /= u_aspect;

   vec4 offset = vec4(normal * orientation, 0.0, 1.0);
   //gl_Position = currentProjected + offset;
   gl_Position = currentProjected + offset;
   gl_PointSize = 1.0;
}   