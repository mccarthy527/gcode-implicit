"use strict"

var imrd = require("../index.js")
var isosurface = require("isosurface")

function implicitwrapper(x,y,z)
{
	//return roadend(x,y,z,3,1);
	var sx= 0
	var sy= 0
	var sz= 2
	var ex= 2
	var ey= 7 
	var ez= 2
	return Math.min(imrd(x,y,z,sx,sy,sz,ex,ey,ez,8,2))
	//return Math.min(imfun.originroad(x,y,z,10,8,2),imfun.road(x,y,z,sx,sy,sz,ex,ey,ez,8,2), imfun.sphere(x-ex,y-ey,z-ez));
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