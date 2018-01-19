const prefix = "https://itracku-app.herokuapp.com/";
//const prefix = "http://localhost:8080/";
// Auth Urls
const REGISTER_URL = "users/register";
const LOGIN_URL = "auth/login";
const REFRESH_URL = "auth/refresh";

// GET Urls
const GET_POST_URL = "post/protected";
const GET_PROFILE_URL = "users/protected";

// POST Urls
const POST_POST_URL = "post/protected/uploads";

// PUT Urls
const PUT_PROFILE_URL = "users/protected"

// DELETE Urls
const DELETE_POST_URL = "post/protected/delete";
//const DELETE_PROFILE_URL = "user/protected/delete";

import * as init from './inital/index.js';

import * as ajax from './ajax.js';

import * as user from './user/index.js';

import * as post from './post/index.js';

let datamap = new init.Datamap();

function WatchApplication() {
    // $(window).on('resize', function() {
    //     map.resize();
    // });

    // Watch Navbar buttons
    $('ul.navbar-nav').on('click', '.nav-link', event => {
        init.watchNavBtns(event);
    });

    // Prevent modal close if not logged in
    // $('#login-joinPage').on('hide.bs.modal', (event) => {
    //
    // });

    // Watch Registeration and store user info
    $('#registerForm').submit(event => {
        event.preventDefault();
        const userData = user.data.getRegisterFormInfo(event);
        ajax.post(`${prefix}${REGISTER_URL}`, userData,
            (success) => {
                user.callback.RegisterSuccess(success);
            }, (error) => {
                console.log(error);
                user.callback.RegisterError(error);
            });
    });

    // Watch login load user profile details, datamap, and post
    $('#loginForm').submit(event => {
        event.preventDefault();

        const username = $(event.currentTarget).find('input[name=username]').val();
        localStorage.setItem('currentUser', JSON.stringify({username: username}));

        ajax.post(`${prefix}${LOGIN_URL}`, user.data.getLoginFormCreds(event),
            (success) => {
                localStorage.setItem('JWT', JSON.stringify({token: success.authToken}));
                const username = JSON.parse(localStorage.getItem('currentUser')).username;
                const JWT = JSON.parse(localStorage.getItem('JWT')).token;

                ajax.getAuth(`${prefix}${GET_POST_URL}/${username}`, JWT,
                    (success) => {
                        if (success.length > 0){
                            datamap.instance.bubbles(success,{
                                popupTemplate: (geo, data) => {
                                    return ['<div class="hoverinfo">' + data.title,
                                        '<br/><image width="100px" src="' + data.secure_url + '"/>' + '',
                                        '</div>'].join('');
                                }
                            });
                        }
                        post.render.PostResults(success);
                    }, (error) => {
                        console.log(error);
                    });
                ajax.getAuth(`${prefix}${GET_PROFILE_URL}/${username}`, JWT,
                    (success) =>{
                        user.render.ProfileResults(success);
                    }, (error) =>{
                        console.log(error);
                    });
                user.callback.LoginSuccess(username);
            }, (error) => {
                user.callback.LoginError(error);
            });
    });

    // Watch refresh authentication button
    $('#refreshJWT').click(() => {
        let JWT = JSON.parse(localStorage.getItem('JWT')).token;
        ajax.postAuth(`${prefix}${REFRESH_URL}`, JWT, {},
            (success) => {
                localStorage.setItem('JWT', JSON.stringify({token: success.authToken}));
                user.callback.RefreshSuccess(success);
            }, (error) => {
                user.callback.RefreshError(error);
            });
    });

    $('#Delete-Post').click(() => {
        let post_id = $('#Post-ID').text();
        let JWT = JSON.parse(localStorage.getItem('JWT')).token;
        let username = JSON.parse(localStorage.getItem('currentUser')).username;
        ajax.deleteAuth(`${prefix}${DELETE_POST_URL}/${post_id}`, JWT,
            (success) => {
                ajax.getAuth(`${prefix}${GET_POST_URL}/${username}`, JWT,
                    (success) => {
                        if (success.length > 0) {
                            datamap.instance.bubbles(success, {
                                popupTemplate: (geo, data) => {
                                    return ['<div class="hoverinfo">' + data.title,
                                        '<br/><image width="50px" src="' + data.secure_url + '"/>' + '',
                                        '</div>'].join('');
                                }
                            });
                        }
                        post.render.PostResults(success);
                    },  (error) => {
                        console.log(error);
                    });
            },
            (error) => {
                console.log(error);
            });
    });

    $('#uploadBtn').click(() => {
        navigator.geolocation.getCurrentPosition(function(pos){
            localStorage.setItem('geo', JSON.stringify({long: pos.coords.longitude, lat: pos.coords.latitude}));
        });
    });

    $('#Upload-Form').submit(event => {
        event.preventDefault();

        let latitude = JSON.parse(localStorage.getItem('geo')).lat;
        let longitude = JSON.parse(localStorage.getItem('geo')).long;
        console.log(latitude);
        let JWT = JSON.parse(localStorage.getItem('JWT')).token;
        let username = JSON.parse(localStorage.getItem('currentUser')).username;

        let formData = new FormData($('#Upload-Form')[0]);
        formData.set('longitude', longitude);
        formData.set('latitude', latitude);
        formData.set('username', username);

        ajax.postAuthFile(`${prefix}${POST_POST_URL}`, JWT, formData,
            (success) => {
                ajax.getAuth(`${prefix}${GET_POST_URL}/${username}`, JWT,
                    (success) => {
                        if (success.length > 0){
                            datamap.instance.bubbles(success,{
                                popupTemplate: (geo, data) => {
                                    return ['<div class="hoverinfo">' + data.title,
                                        '<br/><image width="100px" src="' + data.secure_url + '"/>' + '',
                                        '</div>'].join('');
                                }
                            });
                        }
                        post.render.PostResults(success);
                    }, (error) => {
                        console.log(error);
                    });
                post.callback.UploadSuccess(success);
            }, (error) => {
                console.log(error);
            });
    });

    $('#pixFeed').on('click', '.post-card', (event) => {
        post.callback.OnPostClick(event);
    });

    $('#Update-Form').submit(event => {
        event.preventDefault();
        let JWT = JSON.parse(localStorage.getItem('JWT')).token;
        let username = JSON.parse(localStorage.getItem('currentUser')).username;
        let formData = new FormData($('#Update-Form')[0]);
        formData.set('username', username);

        ajax.putAuthFile(`${prefix}${PUT_PROFILE_URL}/${username}`, JWT, formData,
            (success) =>{
                console.log(success);
                alert(`${username} profile has been updated`);
                ajax.getAuth(`${prefix}${GET_PROFILE_URL}/${username}`, JWT,
                    (success) =>{
                        console.log(success);
                        $('#Bio').text(`${success.bio}`);
                        $('#Avatar').prop('src',`${success.avatar}`);
                        //user.render.ProfileResults(success);
                    }, (error) =>{
                        console.log(error);
                    });
            }, (error) => {
                console.log(error);
            });
    });

    // Watch sign out buttons
    $('#signoutBtn').click((event) => {
        user.callback.SignOutSuccess(event);
    });
}

$(WatchApplication);