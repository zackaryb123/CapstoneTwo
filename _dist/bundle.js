/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
module.exports = __webpack_require__(2);


/***/ }),
/* 1 */
/***/ (function(module, exports) {

//Application navigation event watchers
function watchNavBtns() {
    $('ul.navbar-nav').on('click', '.nav-link', event => {
        let btn = $(event.currentTarget).attr('id');
        switch(btn) {
            case 'profileBtn':
                let isProfileActive = $(event.currentTarget).parent().hasClass('active');
                if (isProfileActive) {return;}
                if (!isProfileActive) {
                    $('li.nav-item.active').removeClass('active');
                    $(event.currentTarget).parent().addClass('active');
                    $('#worldMapView').attr('hidden', true);
                    $('#profileView').attr('hidden', false);
                }
                break;
            case 'globeBtn':
                let isGlobeActive = $(event.currentTarget).parent().hasClass('active');
                if (isGlobeActive) {return;}
                if (!isGlobeActive) {
                    $('li.nav-item.active').removeClass('active');
                    $(event.currentTarget).parent().addClass('active');
                    $('#profileView').attr('hidden', true);
                    $('#worldMapView').attr('hidden', false);
                }
                break;
        }
    });
}

$(watchNavBtns);

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__zoom_js__ = __webpack_require__(3);


function Datamap() {
    this.$container = $("#worldMapView");
    this.instance = new Datamaps({
    scope: 'world',
    element: this.$container.get(0),
    projection: 'mercator',
    done: this._handleMapReady.bind(this),
    });
}

Datamap.prototype._handleMapReady = function(datamap) {
    this.zoom = new __WEBPACK_IMPORTED_MODULE_0__zoom_js__["a" /* Zoom */]({
        $container: this.$container,
        datamap: datamap
    });
};

new Datamap();

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Zoom; });
function Zoom(args) {
    $.extend(this, {
      $buttons:   $(".zoom-button"),
      $info:      $("#zoom-info"),
      scale:      { max: 50, currentShift: 0 },
      $container: args.$container,
      datamap:    args.datamap
    });
  
    this.init();
  }
  
  Zoom.prototype.init = function() {
    var paths = this.datamap.svg.selectAll("path"),
        subunits = this.datamap.svg.selectAll(".datamaps-subunit");
  
    // preserve stroke thickness
    paths.style("vector-effect", "non-scaling-stroke");
  
    // disable click on drag end
    subunits.call(
      d3.behavior.drag().on("dragend", function() {
        d3.event.sourceEvent.stopPropagation();
      })
    );
  
    this.scale.set = this._getScalesArray();
    this.d3Zoom = d3.behavior.zoom().scaleExtent([ 1, this.scale.max ]);
  
    this._displayPercentage(1);
    this.listen();
  };
  
  Zoom.prototype.listen = function() {
    this.$buttons.off("click").on("click", this._handleClick.bind(this));
  
    this.datamap.svg
      .call(this.d3Zoom.on("zoom", this._handleScroll.bind(this)))
      .on("dblclick.zoom", null); // disable zoom on double-click
  };
  
  Zoom.prototype.reset = function() {
    this._shift("reset");
  };
  
  Zoom.prototype._handleScroll = function() {
    var translate = d3.event.translate,
        scale = d3.event.scale,
        limited = this._bound(translate, scale);
  
    this.scrolled = true;
  
    this._update(limited.translate, limited.scale);
  };
  
  Zoom.prototype._handleClick = function(event) {
    var direction = $(event.target).data("zoom");
  
    this._shift(direction);
  };
  
  Zoom.prototype._shift = function(direction) {
    var center = [ this.$container.width() / 2, this.$container.height() / 2 ],
        translate = this.d3Zoom.translate(), translate0 = [], l = [],
        view = {
          x: translate[0],
          y: translate[1],
          k: this.d3Zoom.scale()
        }, bounded;
  
    translate0 = [
      (center[0] - view.x) / view.k,
      (center[1] - view.y) / view.k
    ];
  
      if (direction == "reset") {
        view.k = 1;
      this.scrolled = true;
    } else {
        view.k = this._getNextScale(direction);
    }
  
    l = [ translate0[0] * view.k + view.x, translate0[1] * view.k + view.y ];
  
    view.x += center[0] - l[0];
    view.y += center[1] - l[1];
  
    bounded = this._bound([ view.x, view.y ], view.k);
  
    this._animate(bounded.translate, bounded.scale);
  };
  
  Zoom.prototype._bound = function(translate, scale) {
    var width = this.$container.width(),
        height = this.$container.height();
  
    translate[0] = Math.min(
      (width / height)  * (scale - 1),
      Math.max( width * (1 - scale), translate[0] )
    );
  
    translate[1] = Math.min(0, Math.max(height * (1 - scale), translate[1]));
  
    return { translate: translate, scale: scale };
  };
  
  Zoom.prototype._update = function(translate, scale) {
    this.d3Zoom
      .translate(translate)
      .scale(scale);
  
    this.datamap.svg.selectAll("g")
      .attr("transform", "translate(" + translate + ")scale(" + scale + ")");
  
    this._displayPercentage(scale);
  };
  
  Zoom.prototype._animate = function(translate, scale) {
    var _this = this,
        d3Zoom = this.d3Zoom;
  
    d3.transition().duration(350).tween("zoom", function() {
      var iTranslate = d3.interpolate(d3Zoom.translate(), translate),
          iScale = d3.interpolate(d3Zoom.scale(), scale);
  
          return function(t) {
        _this._update(iTranslate(t), iScale(t));
      };
    });
  };
  
  Zoom.prototype._displayPercentage = function(scale) {
    var value;
  
    value = Math.round(Math.log(scale) / Math.log(this.scale.max) * 100);
    this.$info.text(value + "%");
  };
  
  Zoom.prototype._getScalesArray = function() {
    var array = [],
        scaleMaxLog = Math.log(this.scale.max);
  
    for (var i = 0; i <= 10; i++) {
      array.push(Math.pow(Math.E, 0.1 * i * scaleMaxLog));
    }
  
    return array;
  };
  
Zoom.prototype._getNextScale = function(direction) {
var scaleSet = this.scale.set,
    currentScale = this.d3Zoom.scale(),
    lastShift = scaleSet.length - 1,
    shift, temp = [];

if (this.scrolled) {

    for (shift = 0; shift <= lastShift; shift++) {
    temp.push(Math.abs(scaleSet[shift] - currentScale));
    }

    shift = temp.indexOf(Math.min.apply(null, temp));

    if (currentScale >= scaleSet[shift] && shift < lastShift) {
    shift++;
    }

    if (direction == "out" && shift > 0) {
    shift--;
    }

    this.scrolled = false;

} else {

    shift = this.scale.currentShift;

    if (direction == "out") {
    shift > 0 && shift--;
    } else {
    shift < lastShift && shift++;
    }
}

this.scale.currentShift = shift;

return scaleSet[shift];
};
  



/***/ })
/******/ ]);