var isosurface = require("isosurface")

function sphere(x,y,z) {
  return x*x + y*y + z*z - 100
}

function torus( x,y,z,R,r)
{
	//r, radius of the tube
	//R, dist from the center of the tube to the center of the torus
	
	//vec2 q = vec2(length(p.xz)-R,p.y);
	qx = Math.sqrt(x*x+z*z)-R;
	qy = y;
	
	//return length(q)-r; 
	return Math.sqrt(qx*qx+qy*qy)-r;
}

function zcylinder( x,y,z,r,h)
{
  //h is half the height and r is the radius
  //vec2 d = abs(vec2(length(p.xz),p.y)) - vec2(r,h);
  dx = Math.abs(Math.sqrt(x*x + z*z)) - r;
  dy = Math.abs(y) - h;
  
  //return min(max(d.x,d.y),0.0) + length(max(d,0.0));
  return Math.min(Math.max(dx,dy),0) + Math.sqrt(Math.pow(Math.max(dx,0),2)+ Math.pow(Math.max(dy,0),2))
}

function xcylinder(x,y,z,r,l)
{
	return zcylinder(x,z,y,r,l)
}


function endcap( x,y,z,w,h)
{
	var d_tor = torus(x,y,z,(w-h)*0.5,0.5*h);
	var d_cyl = zcylinder(x,y,z,(w-h)*0.5,0.5*h);

	return Math.min(d_tor,d_cyl);
	//return d_tor
}

function implicitwrapper(x,y,z)
{
	//return endcap(x,y,z,3,1);
	return Math.min(zcylinder(x,y,z,1,5),xcylinder(x,y,z,3,3))
}


var mymesh = isosurface.surfaceNets([64,64,64], implicitwrapper, [[-11,-11,-11], [11,11,11]])




var shell = require("mesh-viewer")()
var mesh

shell.on("viewer-init", function() {
  mesh = shell.createMesh(mymesh)
})

shell.on("gl-render", function() {
  mesh.draw()
})