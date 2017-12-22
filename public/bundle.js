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

module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__inital_index_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ajax_js__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__user_index_js__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__post_index_js__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__map_index_js__ = __webpack_require__(15);
// Auth Urls
const REGISTER_URL = "http://localhost:8080/users/register";
const LOGIN_URL = "http://localhost:8080/auth/login";
const REFRESH_URL = "http://localhost:8080/auth/refresh";
const INIT_MAP_URL = "http://localhost:8080/map/initial";

// GET Urls
const GET_POST_URL = "http://localhost:8080/post/protected"; 
const GET_PROFILE_URL = "http://localhost:8080/users/protected";
const GET_MAP_URL = "http://localhost:8080/map/protected";

// POST Urls
const POST_POST_URL = "http://localhost:8080/post/protected/uploads";











function WatchApplication() {
    // Watch Navbar buttons
    $('ul.navbar-nav').on('click', '.nav-link', event => {
        __WEBPACK_IMPORTED_MODULE_0__inital_index_js__["b" /* watchNavBtns */](event);
    });

    // Prevent modal close if not logged in 
    $('#login-joinPage').on('hide.bs.modal', (event) => {
        __WEBPACK_IMPORTED_MODULE_2__user_index_js__["a" /* callback */].PreventModalClose(event);
    });

    // Watch Registeration and store user info
    $('#registerForm').submit(event => {
        event.preventDefault();
        const userData = __WEBPACK_IMPORTED_MODULE_2__user_index_js__["b" /* data */].getRegisterFormInfo(event);
        __WEBPACK_IMPORTED_MODULE_1__ajax_js__["b" /* post */](REGISTER_URL, userData,
            (success) => {
                let container = '#worldMapView';
                __WEBPACK_IMPORTED_MODULE_1__ajax_js__["b" /* post */](INIT_MAP_URL,
                    {username: userData.username, datamap: new __WEBPACK_IMPORTED_MODULE_0__inital_index_js__["a" /* Datamap */](container)},
                    (success) => {
                        console.log('initialize map successful');
                    }, (error) => {
                        console.log(error);
                });
                __WEBPACK_IMPORTED_MODULE_2__user_index_js__["a" /* callback */].RegisterSuccess(success);
            }, (error) => {
                __WEBPACK_IMPORTED_MODULE_2__user_index_js__["a" /* callback */].RegisterError(error);
            });
    });

    // Watch login load user profile details, datamap, and post
    $('#loginForm').submit(event => {
        event.preventDefault();
        __WEBPACK_IMPORTED_MODULE_1__ajax_js__["b" /* post */](LOGIN_URL, __WEBPACK_IMPORTED_MODULE_2__user_index_js__["b" /* data */].getLoginFormCreds(event), 
            (success) => {
                const username = $(event.currentTarget).find('input[name=username]').val();
                localStorage.setItem('currentUser', JSON.stringify({username: username}));
                localStorage.setItem('JWT', JSON.stringify({token: success.authToken}));

                const currentUser = JSON.parse(localStorage.getItem('currentUser')).username;
                const JWT = JSON.parse(localStorage.getItem('JWT')).token; 

                __WEBPACK_IMPORTED_MODULE_1__ajax_js__["a" /* getAuth */](`${GET_POST_URL}/${username}`, JWT, username, 
                    (success) => {
                        __WEBPACK_IMPORTED_MODULE_3__post_index_js__["b" /* render */].PostResults(success);
                }, (error) => {
                    console.log(error);
                }, );
                __WEBPACK_IMPORTED_MODULE_1__ajax_js__["a" /* getAuth */](`${GET_PROFILE_URL}/${username}`, JWT, username, 
                    (success) =>{
                        __WEBPACK_IMPORTED_MODULE_2__user_index_js__["c" /* render */].ProfileResults(success);
                }, (error) =>{
                    console.log(error);
                });
                __WEBPACK_IMPORTED_MODULE_1__ajax_js__["a" /* getAuth */](`${GET_MAP_URL}/${username}`, JWT, username, 
                    (success) => {
                        new __WEBPACK_IMPORTED_MODULE_0__inital_index_js__["a" /* Datamap */]('#worldMapView');
                        __WEBPACK_IMPORTED_MODULE_4__map_index_js__["a" /* render */].MapResults(success);
                }, (error) => {
                    console.log(error);
                });
                __WEBPACK_IMPORTED_MODULE_2__user_index_js__["a" /* callback */].LoginSuccess(username);
            }, (error) => {
                __WEBPACK_IMPORTED_MODULE_2__user_index_js__["a" /* callback */].LoginError(error);
            });
    });

    // Watch refresh authentication button
    $('#refreshJWT').click(event => {
        let JWT = JSON.parse(localStorage.getItem('JWT')).token;
        __WEBPACK_IMPORTED_MODULE_1__ajax_js__["c" /* postAuth */](REFRESH_URL, JWT, {}, 
            (success) => {
                localStorage.setItem('JWT', JSON.stringify({token: success.authToken}));
                __WEBPACK_IMPORTED_MODULE_2__user_index_js__["a" /* callback */].RefreshSuccess(success);
            }, (error) => {
                __WEBPACK_IMPORTED_MODULE_2__user_index_js__["a" /* callback */].RefreshError(error);
            });
    });

    $('#uploadBtn').on('click', () => {
        navigator.geolocation.getCurrentPosition(function(pos){
            localStorage.setItem('geo', JSON.stringify({long: pos.coords.longitude, lat: pos.coords.latitude}));
        });
    })
    $('#Upload-Form').submit((event) => {
        event.preventDefault();

        let latitude = JSON.parse(localStorage.getItem('geo')).lat;
        let longitude = JSON.parse(localStorage.getItem('geo')).long;
        let JWT = JSON.parse(localStorage.getItem('JWT')).token;
        let username = JSON.parse(localStorage.getItem('currentUser')).username;

        let data = new FormData($('#Upload-Form')[0]);
        data.set('longitude', longitude);
        data.set('latitude', latitude);
        data.set('username', username);

        __WEBPACK_IMPORTED_MODULE_1__ajax_js__["d" /* postAuthFile */](POST_POST_URL, JWT, data,
        (success) =>{
            __WEBPACK_IMPORTED_MODULE_3__post_index_js__["a" /* callback */].UploadSuccess(success);
            let username = JSON.parse(localStorage.getItem('currentUser')).username;
            __WEBPACK_IMPORTED_MODULE_1__ajax_js__["a" /* getAuth */](`${GET_POST_URL}/${username}`, JWT, username, 
            (success) =>{
                __WEBPACK_IMPORTED_MODULE_3__post_index_js__["b" /* render */].PostResults(success);
            }, (error) =>{
                console.log(error);
            });
        }, (error) => {
            console.log(error);
        });
    });

    // Watch sign out buttons
    $('#signoutBtn').click((event) => {
        __WEBPACK_IMPORTED_MODULE_2__user_index_js__["a" /* callback */].SignOutSuccess(event);
    });
}

$(WatchApplication);


/* function GeoUpload(position) {
    let JWT = JSON.parse(localStorage.getItem('JWT')).token;
    let currentUser = JSON.parse(localStorage.getItem('currentUser')).username;
    let data = new FormData($('#Upload-Form')[0]);

    data.set('longitude', position.coords.longitude);
    data.set('latitude', position.coords.latitude);

    data.set('username', `${currentUser}`);
    console.log(data);

    ajax.postAuthFile(POST_POST_URL, JWT, data,
    (success) =>{
        post.callback.UploadSuccess(success);
        ajax.getAuth(`${GET_PROFILE_URL}/${username}`, JWT, username, 
        (success) =>{
            user.render.ProfileResults(success);
        }, (error) =>{
            console.log(error);
        });
    }, (error) => {
        console.log(error);
    });
}

function ManualUpload() {
    let JWT = JSON.parse(localStorage.getItem('JWT')).token;
    let currentUser = JSON.parse(localStorage.getItem('currentUser')).username;
    let data = new FormData($('#Upload-Form')[0]);

    let geo = navigator.geolocation.getCurrentPosition()
    data.set('username', `${currentUser}`);
    console.log(data);

    ajax.postAuthFile(POST_POST_URL, JWT, data,
    (success) =>{
        post.callback.UploadSuccess(success);
        ajax.getAuth(`${GET_PROFILE_URL}/${username}`, JWT, username, 
        (success) =>{
            user.render.ProfileResults(success);
        }, (error) =>{
            console.log(error);
        });
    }, (error) => {
        console.log(error);
    });
} */

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__datamap_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__nav_js__ = __webpack_require__(5);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__datamap_js__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_1__nav_js__["a"]; });






/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Datamap; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__zoom_js__ = __webpack_require__(4);


function Datamap(container) {
    this.container = $(container);
    this.instance = new Datamaps({
    scope: 'world',
    element: this.container.get(0),
    projection: 'mercator',
    done: this._handleMapReady.bind(this)
    });
}

Datamap.prototype._handleMapReady = function(datamap) {
    this.zoom = new __WEBPACK_IMPORTED_MODULE_0__zoom_js__["a" /* Zoom */]({
        container: this.container,
        datamap: datamap
    });
};



/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Zoom; });
function Zoom(args) {
    $.extend(this, {
      buttons:   $(".zoom-button"),
      info:      $("#zoom-info"),
      scale:      { max: 50, currentShift: 0 },
      container: args.container,
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
    this.buttons.off("click").on("click", this._handleClick.bind(this));
  
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
    var center = [ this.container.width() / 2, this.container.height() / 2 ],
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
    var width = this.container.width(),
        height = this.container.height();
  
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
    this.info.text(value + "%");
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
  



/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = watchNavBtns;
function watchNavBtns(event) {
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
}

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = post;
/* harmony export (immutable) */ __webpack_exports__["c"] = postAuth;
/* harmony export (immutable) */ __webpack_exports__["d"] = postAuthFile;
/* harmony export (immutable) */ __webpack_exports__["a"] = getAuth;
function post(URL, data, suc, err) {
    const settings = {
        url: URL,
        headers:{
            "Content-Type": 'application/json'
        },
        data: JSON.stringify(data),
        dataType: 'json',
        type: 'POST',
        success: suc,
        error: err
    };
    $.ajax(settings);
}

function postAuth(URL, token, data, suc, err) {
    const settings = {
        url: URL,
        headers:{
            "Authorization": `Bearer ${token}`,
            "Content-Type": 'application/json'
        },
        data: JSON.stringify(data),
        dataType: 'json',
        type: 'POST',
        success: suc,
        error: err
    };
    $.ajax(settings);
}


function postAuthFile(URL, token, data, suc, err) {
    const settings = {
        url: URL,
        headers:{
            "Authorization": `Bearer ${token}`,
        },
        contentType: false,
        processData: false,
        data: data,
        type: 'POST',
        success: suc,
        error: err
    };
    $.ajax(settings);
}

function getAuth(URL, token, data, suc, err) {
    const settings = {
        url: URL,
        headers:{
            "Authorization": `Bearer ${token}`,
            "Content-Type": 'application/json'
        },
        data: JSON.stringify(data),
        dataType: 'json',
        type: 'GET',
        success: suc,
        error: err
    };
    $.ajax(settings);
}

/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__data_js__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__callback_js__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__render_js__ = __webpack_require__(10);
/* harmony reexport (module object) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_0__data_js__; });
/* harmony reexport (module object) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_1__callback_js__; });
/* harmony reexport (module object) */ __webpack_require__.d(__webpack_exports__, "c", function() { return __WEBPACK_IMPORTED_MODULE_2__render_js__; });








/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["getRegisterFormInfo"] = getRegisterFormInfo;
/* harmony export (immutable) */ __webpack_exports__["getLoginFormCreds"] = getLoginFormCreds;
function getRegisterFormInfo(event) {
    return {
        username: $(event.currentTarget).find("input[name=username]").val(),
        password: $(event.currentTarget).find("input[name=password]").val(),
        password2: $(event.currentTarget).find("input[name=password2]").val(),
        firstName: $(event.currentTarget).find("input[name=firstName]").val(),
        lastName: $(event.currentTarget).find("input[name=lastName]").val(),
        email: $(event.currentTarget).find("input[name=email]").val()
    };
}

function getLoginFormCreds(event) {
    return {
        username: $(event.currentTarget).find("input[name=username]").val(),
        password: $(event.currentTarget).find("input[name=password]").val()
    };
}

/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["PreventModalClose"] = PreventModalClose;
/* harmony export (immutable) */ __webpack_exports__["RegisterSuccess"] = RegisterSuccess;
/* harmony export (immutable) */ __webpack_exports__["RegisterError"] = RegisterError;
/* harmony export (immutable) */ __webpack_exports__["LoginSuccess"] = LoginSuccess;
/* harmony export (immutable) */ __webpack_exports__["LoginError"] = LoginError;
/* harmony export (immutable) */ __webpack_exports__["RefreshSuccess"] = RefreshSuccess;
/* harmony export (immutable) */ __webpack_exports__["RefreshError"] = RefreshError;
/* harmony export (immutable) */ __webpack_exports__["SignOutSuccess"] = SignOutSuccess;
/* harmony export (immutable) */ __webpack_exports__["UploadSuccess"] = UploadSuccess;
// Eventually import all to this file and call ajax funtions then export to index

function PreventModalClose(event) {
    let JWT = JSON.parse(localStorage.getItem('JWT')).token;
    if(JWT === '') {
       event.preventDefault();
       event.stopImmediatePropagation();
       return false; 
     }
}

function RegisterSuccess(suc) {
    //callback
    
    //event 
    $('#registerForm').trigger('reset');

    $('#nav-register-tab').attr("aria-selected",'false');
    $("#nav-register-tab").removeClass("active");
    $('#nav-register').removeClass('show active');

    $("#nav-login-tab").addClass("active show");
    $('#nav-login-tab').attr("aria-selected","true");
    $("#nav-login").addClass("show active");

    alert(`${suc.username} successfully registerd!`);
}

function RegisterError(err) {
    //callback
    alert(`Error: ${err.responseJSON.message}!`);
}

function LoginSuccess(username) {
    //callback
    
    //event
    $('#loginForm').trigger('reset');
    $('#signoutBtn').prop('hidden', false);
    $("#login-joinPage").modal('hide');

    alert(`${username} successfully loged in!`);  
}

function LoginError(err) {
    //callback
    alert(`Error: ${err.responseText}!`);
}

function RefreshSuccess(suc) {
    //callback
    alert("Authentication has been refreshed!");
}

function RefreshError(err) {
    //callback
    alert(`Error: ${err.responseJSON.message}!`);
}

function SignOutSuccess(event) {
    window.location.reload(true);
}

function UploadSuccess(event) {
    $('#Upload-Form').trigger('reset');
    $("#Upload-Page").modal();
}

/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["ProfileResults"] = ProfileResults;
function ProfileResults(render) {
    $('#Username').text(`${render.username}`);
    $('#Name > span').text(`${render.firstName} ${render.lastName}`);
    $('#Bio').text(`${render.bio}`);
    $('#Email').text(`${render.email}`);
    $('#Avatar').prop('src',`${render.avatar}`);
    //debug    
    console.log('profile successfully rendered');
}

/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__render_js__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__data_js__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__callback_js__ = __webpack_require__(14);
/* harmony reexport (module object) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_0__render_js__; });
/* unused harmony reexport data */
/* harmony reexport (module object) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_2__callback_js__; });








/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["PostResults"] = PostResults;
function PostResults(render) {
    let results = '';
    render.forEach((post, index) => {
        results += `                
        <div id="${post.public_id}" class="col-sm-4">
            <a class="ui card">
                <image height="260" class="ui image" src="${post.secure_url}" />
                <div class="content">
                    <div class="header">${post.title}</div>
                    <div class="meta">${post.caption}</div>
                    <div><span>${post.latitude}x${post.longitude}</span></div>
                    <div class="date">${post.created_at}</div>
                </div>
            </a>
        </div>
        `;
    });
    $('#pixFeed').html(results);
    console.log('post successfully rendered');
}

/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export getUploadFormData */
function getUploadFormData(event) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser')).username;
    return {
        username: currentUser,
        title: $(event.currentTarget).find("input[name=title]").val(),
        caption: $(event.currentTarget).find("input[name=caption]").val(),
        longitude: $(event.currentTarget).find("input[name=longitude]").val(),
        latitude: $(event.currentTarget).find("input[name=latitude]").val(),
        img: $(event.currentTarget).find("input[name=image]").val() 
    }

}

/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["UploadSuccess"] = UploadSuccess;
function UploadSuccess(suc) {
    //callback
    
    //event 
    $('#Upload-Form').trigger('reset');
    $("#Upload-Page").modal('hide');

    alert(`${suc.title} successfully Uploaded!`);
}

/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__render_js__ = __webpack_require__(16);
/* harmony reexport (module object) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__render_js__; });


//import * as callback from './render.js';

//import * as data from './data.js';



/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["MapResults"] = MapResults;
function MapResults(render) {
    //debug
    console.log('mapp successfully rendered');
}



/// /HOW TO LOAD THE MAP OVER AND OVER


/***/ })
/******/ ]);