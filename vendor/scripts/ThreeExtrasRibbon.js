// ThreeExtras.js r32 - http://github.com/mrdoob/three.js
var THREE = THREE || {};
THREE.Color = function(a) {
    this.autoUpdate = !0;
    this.setHex(a)
};
THREE.Color.prototype = {
    setRGB: function(a, b, c) {
        this.r = a;
        this.g = b;
        this.b = c;
        if (this.autoUpdate) {
            this.updateHex();
            this.updateStyleString()
        }
    },
    setHSV: function(a, b, c) {
        var d, f, g, h, k, j;
        if (c == 0) d = f = g = 0;
        else {
            h = Math.floor(a * 6);
            k = a * 6 - h;
            a = c * (1 - b);
            j = c * (1 - b * k);
            b = c * (1 - b * (1 - k));
            switch (h) {
                case 1:
                    d = j;
                    f = c;
                    g = a;
                    break;
                case 2:
                    d = a;
                    f = c;
                    g = b;
                    break;
                case 3:
                    d = a;
                    f = j;
                    g = c;
                    break;
                case 4:
                    d = b;
                    f = a;
                    g = c;
                    break;
                case 5:
                    d = c;
                    f = a;
                    g = j;
                    break;
                case 6:
                case 0:
                    d = c;
                    f = b;
                    g = a
            }
        }
        this.r = d;
        this.g = f;
        this.b = g;
        if (this.autoUpdate) {
            this.updateHex();
            this.updateStyleString()
        }
    },
    setHex: function(a) {
        this.hex = ~~a & 16777215;
        if (this.autoUpdate) {
            this.updateRGBA();
            this.updateStyleString()
        }
    },
    updateHex: function() {
        this.hex = ~~ (this.r * 255) << 16 ^ ~~ (this.g * 255) << 8 ^ ~~ (this.b * 255)
    },
    updateRGBA: function() {
        this.r = (this.hex >> 16 & 255) / 255;
        this.g = (this.hex >> 8 & 255) / 255;
        this.b = (this.hex & 255) / 255
    },
    updateStyleString: function() {
        this.__styleString = "rgb(" + ~~ (this.r * 255) + "," + ~~ (this.g * 255) + "," + ~~ (this.b * 255) + ")"
    },
    clone: function() {
        return new THREE.Color(this.hex)
    },
    toString: function() {
        return "THREE.Color ( r: " + this.r + ", g: " + this.g + ", b: " + this.b + ", hex: " + this.hex + " )"
    }
};

THREE.Ribbon = function(a, b) {
    THREE.Object3D.call(this);
    this.geometry = a;
    this.materials = b instanceof Array ? b : [b];
    this.flipSided = !1;
    this.doubleSided = !1
};
THREE.Ribbon.prototype = new THREE.Object3D;
THREE.Ribbon.prototype.constructor = THREE.Ribbon;
