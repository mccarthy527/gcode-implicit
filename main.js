"use strict"

var isosurface = require("isosurface")

function sphere(x,y,z) 
{
  return x*x + y*y + z*z - 9
}

function veclength(x,y,z)
{
	return Math.sqrt(x*x + y*y + z*z);
}

function veccross(ax,ay,az, bx,by,bz) 
{
  return [ay*bz - az*by,
          az*bx - ax*bz,
          ax*by - ay*bx];
}

function torus( x,y,z,R,r)
{
	//r, radius of the tube
	//R, dist from the center of the tube to the center of the torus
	
	//vec2 q = vec2(length(p.xz)-R,p.y);
	var qx = Math.sqrt(x*x+y*y)-R;
	var qz = z;
	
	//return length(q)-r; 
	return Math.sqrt(qx*qx+qz*qz)-r;
}

function zcylinder( x,y,z,r,h)
{
  //h is half the height and r is the radius
  //vec2 d = abs(vec2(length(p.xz),p.y)) - vec2(r,h);
  var dx = Math.abs(Math.sqrt(x*x + y*y)) - r;
  var dz = Math.abs(z) - h;
  
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
	var dx = Math.abs(x) - bx/2;
	var dy = Math.abs(y) - by/2;
	var dz = Math.abs(z) - bz/2;
	
	return Math.min(Math.max(dx,Math.max(dy,dz)),0.0) + veclength(Math.max(dx,0.0),Math.max(dy,0.0),Math.max(dz,0.0));
}

//road is centered at origin
//l is in x, w is in y, h is in z
function originroad(x,y,z,l,w,h)
{	
	//error checking
	if((w-h) <= 0 )
	{
		throw "width must be greater than height!";
	}
	

	//exploit symmetry
	x = Math.abs(x);
	y = Math.abs(y);
	z = Math.abs(z);
	
	var dr = rectangle(x,y,z,l,w-h,h);
	var de = roadend(x-l/2.0,y,z,w,h);
	var dc = xcylinder(x,y-(w-h)/2.0,z,h/2.0,l/2.0);
	return Math.min(dr,de, dc);
}

//create a road from start point (sx,sy,sz) to end point (ex,ey,ez) with width w and height h.
function road(x,y,z,sx,sy,sz,ex,ey,ez,w,h)
{
	//error checking
	if(Math.abs(sz-ez)>0.00001)
	{
		throw "code does not support roads that do not lie in the same plane"
	}
	
	//compute distance between start and end point
	var l = veclength(ex-sx,ey-sy,ez-sz);
	
	//change of basis: transform the query, (x,y,z) in abs to (xloc,yloc,zloc), 
	//a local coordinate system centered between the start and end points.
	var ux = (ex-sx);				//u is a unit vector pointing from the start point to the end point
	var uy = (ey-sy);
	ux = ux/Math.sqrt(ux*ux+uy*uy);
	uy = uy/Math.sqrt(ux*ux+uy*uy);
	
	var mx = (ex+sx)/2;				//m is a vector point from the origin to the local coordinate system
	var my = (ey+sy)/2;
	var mz = (ez+sz)/2;
	
	var xloc = (x-mx)* ux  + (y-my)*uy;	//finally have the original querry in the local coordinate system
	var yloc = (x-mx)*(-uy)+ (y-my)*ux;
	var zloc = z - mz;
	
	return originroad(xloc,yloc,zloc,l,w,h);
}

function implicitwrapper(x,y,z)
{
	//return roadend(x,y,z,3,1);
	var sx= 0
	var sy= 0
	var sz= 2
	var ex= 2
	var ey= 7 
	var ez= 2
	return Math.min(originroad(x,y,z,10,8,2),road(x,y,z,sx,sy,sz,ex,ey,ez,8,2), sphere(x-ex,y-ey,z-ez));
	//return Math.min(zcylinder(x,y,z,1,5),xcylinder(x,y,z,3,3))
}


var mymesh = isosurface.surfaceNets([128,128,128], implicitwrapper, [[-11,-11,-11], [11,11,11]])




var shell = require("mesh-viewer")()
var mesh

shell.on("viewer-init", function() {
  mesh = shell.createMesh(mymesh)
})

shell.on("gl-render", function() {
  mesh.draw()
})