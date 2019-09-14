attribute vec2 a_position;
attribute float a_direction; 
attribute vec2 a_next;
attribute vec2 a_previous;

uniform mat3 u_model;
uniform mat3 u_view;
uniform mat3 u_projection;

uniform float u_aspect;
uniform float u_thickness;
uniform int u_miter;

void main() {
   vec2 aspectVec = vec2(u_aspect, 1.0);

   vec2 currentWorld = (u_model * vec3(a_position, 1)).xy;
   vec2 previousWorld = (u_model * vec3(a_previous, 1)).xy;
   vec2 nextWorld = (u_model * vec3(a_next, 1)).xy;

   currentWorld = 

   float len = u_thickness;
   float orientation = a_direction;
   float d = 1.0;

   //starting point uses (next - current)
   vec2 dir = vec2(0.0);
   if (currentWorld == previousWorld) {
      dir = normalize(nextWorld - currentWorld);
   }
   //ending point uses (current - previous)
   else if (currentWorld == nextWorld) {
      dir = normalize(currentWorld - nextWorld);
   }
   //somewhere in middle, needs a join
   /*
   else{
      //get directions from (C - B) and (B - A)
      vec2 dirA = normalize((a_position - a_previous));
      if (u_miter == 1) {
         vec2 dirB = normalize((a_next - a_position));
         //now compute the miter join normal and length
         vec2 tangent = normalize(dirA + dirB);
         vec2 perp = vec2(-dirA.y, dirA.x);
         vec2 miter = vec2(-tangent.y, tangent.x);
         dir = tangent;
         //len = u_thickness / dot(miter, perp);
         d = dot(miter, perp);
      } else {
         dir = dirA;
      }
   }*/
   /*
   vec2 normal = vec2(-dir.y, dir.x);
   normal *= len / 2.0; 
   
   //normal.x /= u_aspect;

   vec2 offset = normal * orientation;
   vec2 shifted = currentWorld + offset;
  
   mat3 pv = u_projection * u_view;*/

   gl_Position = vec4((pv * vec3(shifted, 1)).xy, 0, 1);
   gl_PointSize = 1.0;
} 