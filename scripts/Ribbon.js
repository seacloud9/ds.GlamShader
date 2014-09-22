//airtightinteractive.com/demos/js/ribbons01/
ATUtil = {

    getRandVec3D: function(minVal, maxVal) {
        return new THREE.Vector3(ATUtil.getRand(minVal, maxVal), ATUtil.getRand(minVal, maxVal), ATUtil.getRand(minVal, maxVal));
    },
    getRand: function(minVal, maxVal) {
        return minVal + (Math.random() * (maxVal - minVal));
    },
    map: function(value, min1, max1, min2, max2) {
        return ATUtil.lerp(min2, max2, ATUtil.norm(value, min1, max1));
    },
    lerp: function(min, max, amt) {
        return min + (max - min) * amt;
    },
    norm: function(value, min, max) {
        return (value - min) / (max - min);
    }
}




var RibbonGroup = function() {

    this.RIBBONCOUNT = 6;
    this.SPREAD = 300;
    this.MAXSEPARATION = 30;
    this.ribbons = [];
    this.ribbonTarget = ATUtil.getRandVec3D(-this.SPREAD, this.SPREAD);
    this.ribbonSeparation = 10;
    this.ribbonHolder = new THREE.Object3D();
    scene.add(this.ribbonHolder);
};

RibbonGroup.prototype.init = function() {

    for (var i = 0; i < this.RIBBONCOUNT; i++) {
        this.ribbons.push(new Ribbon(ATUtil.map(i, 0, this.RIBBONCOUNT, 0, 1), this));
    }
}

RibbonGroup.prototype.toggleWireframe = function() {

    for (var i = 0; i < this.RIBBONCOUNT; i++) {
        this.ribbons[i].toggleWireframe();
    }
}

RibbonGroup.prototype.update = function() {

    this.ribbonHolder.rotation.y += .01;
    this.ribbonTarget = ATUtil.getRandVec3D(-this.SPREAD, this.SPREAD);
    this.ribbonSeparation = ATUtil.getRand(0, this.MAXSEPARATION);

    for (var i = 0; i < this.RIBBONCOUNT; i++) {
        this.ribbons[i].update();
    }

}


var Ribbon = function(hue) {

	//number of ribbonCurves per ribbon
	this.NUMCURVES = 15;
	this.RIBBONWIDTH = 2;
	//lower -> faster
	this.CURVERESOLUTION = 20;
	this.pts = [];
	this.curves = [];
	this.stepId = 0;

	this.material = new THREE.MeshBasicMaterial({
		color : 0xffffff,
		opacity : .7,
		blending : THREE.AdditiveBlending,
		depthTest : false,
		transparent : true,
		wireframe : false

	});

	this.material.color.setHSL(hue, 1, 1);

	this.pts.push(this.getRandPt());
	this.pts.push(this.getRandPt());
	this.pts.push(this.getRandPt());

	this.addRibbonCurve();
};

Ribbon.prototype.toggleWireframe = function(){
	
	this.material.wireframe = !this.material.wireframe;
}

Ribbon.prototype.getRandPt = function() {
	return ribbonGroup.ribbonTarget.clone().add(ATUtil.getRandVec3D(-ribbonGroup.ribbonSeparation, ribbonGroup.ribbonSeparation));
}

Ribbon.prototype.update = function() {

	this.currentCurve.addSegment();

	if(this.curves.length > this.NUMCURVES - 1) {
		this.curves[0].removeSegment();
	}
	this.stepId++;

	if(this.stepId > this.CURVERESOLUTION) {
		this.addRibbonCurve();
	}

}

Ribbon.prototype.addRibbonCurve = function() {

	//add new point
	var p3d = this.getRandPt();
	this.pts.push(p3d);

	var nextPt = this.pts[this.pts.length - 1];
	var curPt = this.pts[this.pts.length - 2];
	var lastPt = this.pts[this.pts.length - 3];
	var lastMidPt = new THREE.Vector3((curPt.x + lastPt.x) / 2, (curPt.y + lastPt.y) / 2, (curPt.z + lastPt.z) / 2);
	var midPt = new THREE.Vector3((curPt.x + nextPt.x) / 2, (curPt.y + nextPt.y) / 2, (curPt.z + nextPt.z) / 2);

	this.currentCurve = new RibbonCurve(lastMidPt, midPt, curPt, this.RIBBONWIDTH, this.CURVERESOLUTION, this.material);
	this.curves.push(this.currentCurve);

	//remove old curves
	if(this.curves.length > this.NUMCURVES) {
		var c = this.curves.shift();
		c.remove();
	}

	this.stepId = 0;

}



var Quad = function(p0, p1, p2, p3) {

    var scope = this;

    THREE.Geometry.call(this);

    scope.vertices.push(new THREE.Vector3(p0));
    scope.vertices.push(new THREE.Vector3(p1));
    scope.vertices.push(new THREE.Vector3(p2));
    scope.vertices.push(new THREE.Vector3(p3));

    f3(0, 1, 2);
    f3(0, 3, 2);

    //this.computeCentroids();
    //this.computeFaceNormals();
    //this.sortFacesByMaterial();

    function f3(a, b, c) {

        scope.faces.push(new THREE.Face3(a, b, c));

    }

}

Quad.prototype = new THREE.Geometry();
Quad.prototype.constructor = Quad;




var RibbonCurve = function(pStartPt, pEndPt, pControlPt, pwidth, presolution, pMaterial) {
    this.startPt = pStartPt;
    this.endPt = pEndPt;
    this.controlPt = pControlPt;
    this.resolution = presolution;
    this.ribbonWidth = pwidth;
    this.stepId = 0;
    this.material = pMaterial;
    this.quads = [];
}

RibbonCurve.prototype.removeSegment = function() {
    if (this.quads.length > 0) {
        var quad = this.quads.shift();
        ribbonGroup.ribbonHolder.remove(quad);
    }
}

RibbonCurve.prototype.addSegment = function() {

    var t = this.stepId / this.resolution;
    var p0 = this.getOffsetPoint(t, 0);
    var p3 = this.getOffsetPoint(t, this.ribbonWidth);
    this.stepId++;
    if (this.stepId > this.resolution) {
        return;
    }
    var t = this.stepId / this.resolution;
    var p1 = this.getOffsetPoint(t, 0);
    var p2 = this.getOffsetPoint(t, this.ribbonWidth);
    var q = new Quad(p0, p1, p2, p3);

    //FIXME - reuse quads
    var quad = new THREE.Mesh(q, this.material);
    quad.doubleSided = true;
    quad.autoUpdateMatrix = false;

    ribbonGroup.ribbonHolder.add(quad);
    this.quads.push(quad);

}
/**
 * Given a bezier curve defined by 3 points, an offset distance (k) and a time (t), returns a position
 */

RibbonCurve.prototype.getOffsetPoint = function(t, k) {

    //FIXME dupe vars
    var p0 = this.startPt;
    var p1 = this.controlPt;
    var p2 = this.endPt;

    var xt = (1 - t) * (1 - t) * p0.x + 2 * t * (1 - t) * p1.x + t * t * p2.x;
    var yt = (1 - t) * (1 - t) * p0.y + 2 * t * (1 - t) * p1.y + t * t * p2.y;
    var zt = (1 - t) * (1 - t) * p0.z + 2 * t * (1 - t) * p1.z + t * t * p2.z;

    var xd = t * (p0.x - 2 * p1.x + p2.x) - p0.x + p1.x;
    var yd = t * (p0.y - 2 * p1.y + p2.y) - p0.y + p1.y;
    var zd = t * (p0.z - 2 * p1.z + p2.z) - p0.z + p1.z;
    var dd = Math.pow(xd * xd + yd * yd + zd * zd, 1 / 3);

    return new THREE.Vector3(xt + (k * yd) / dd, yt - (k * xd) / dd, zt - (k * xd) / dd);

}

RibbonCurve.prototype.remove = function() {
    //TODO -cleanup
}