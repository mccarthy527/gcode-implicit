var isosurface = require("isosurface")

function sphere(x,y,z) {
  return x*x + y*y + z*z - 100
}

function veclength(x,y,z)
{
	return Math.sqrt(x*x + y*y + z*z);
}

function torus( x,y,z,R,r)
{
	//r, radius of the tube
	//R, dist from the center of the tube to the center of the torus
	
	//vec2 q = vec2(length(p.xz)-R,p.y);
	qx = Math.sqrt(x*x+y*y)-R;
	qz = z;
	
	//return length(q)-r; 
	return Math.sqrt(qx*qx+qz*qz)-r;
}

function zcylinder( x,y,z,r,h)
{
  //h is half the height and r is the radius
  //vec2 d = abs(vec2(length(p.xz),p.y)) - vec2(r,h);
  dx = Math.abs(Math.sqrt(x*x + y*y)) - r;
  dz = Math.abs(z) - h;
  
  //return min(max(d.x,d.y),0.0) + length(max(d,0.0));
  return Math.min(Math.max(dx,dz),0) + Math.sqrt(Math.pow(Math.max(dx,0),2)+ Math.pow(Math.max(dz,0),2))
}

function xcylinder(x,y,z,r,l)
{
	return zcylinder(z,y,x,r,l)
}

function roadend( x,y,z,w,h)
{
	var d_tor = torus(x,y,z,(w-h)*0.5,0.5*h);
	var d_cyl = zcylinder(x,y,z,(w-h)*0.5,0.5*h);

	return Math.min(d_tor,d_cyl);
}

//creates a box with lengths bx,by,bz centered at the origin
function rectangle(x,y,z,bx,by,bz)
{
	dx = Math.abs(x) - bx/2;
	dy = Math.abs(y) - by/2;
	dz = Math.abs(z) - bz/2;
	
	return Math.min(Math.max(dx,Math.max(dy,dz)),0.0) + veclength(Math.max(dx,0.0),Math.max(dy,0.0),Math.max(dz,0.0));
}

//road is centered at origin
//l is in x, w is in y, h is in z
function road(x,y,z,l,w,h)
{
	//union a rectangle and two translated cylinders actually, could maybe just take absolute value of y and use only one translated cylinder - should be a bit more efficient
	
	//can also exploit another symmetry by taking absolute value of x and using just one endcap
}

function implicitwrapper(x,y,z)
{
	//return roadend(x,y,z,3,1);
	return rectangle(x,y,z,5,2,2);
	//return Math.min(zcylinder(x,y,z,1,5),xcylinder(x,y,z,3,3))
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