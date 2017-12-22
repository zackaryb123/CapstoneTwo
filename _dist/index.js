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

import * as init from './inital/index.js';

import * as ajax from './ajax.js';

import * as user from './user/index.js';

import * as post from './post/index.js';

import * as map from './map/index.js';

function WatchApplication() {
    // Watch Navbar buttons
    $('ul.navbar-nav').on('click', '.nav-link', event => {
        init.watchNavBtns(event);
    });

    // Prevent modal close if not logged in 
    $('#login-joinPage').on('hide.bs.modal', (event) => {
        user.callback.PreventModalClose(event);
    });

    // Watch Registeration and store user info
    $('#registerForm').submit(event => {
        event.preventDefault();
        const userData = user.data.getRegisterFormInfo(event);
        ajax.post(REGISTER_URL, userData,
            (success) => {
                let container = '#worldMapView';
                ajax.post(INIT_MAP_URL,
                    {username: userData.username, datamap: new init.Datamap(container)},
                    (success) => {
                        console.log('initialize map successful');
                    }, (error) => {
                        console.log(error);
                });
                user.callback.RegisterSuccess(success);
            }, (error) => {
                user.callback.RegisterError(error);
            });
    });

    // Watch login load user profile details, datamap, and post
    $('#loginForm').submit(event => {
        event.preventDefault();
        ajax.post(LOGIN_URL, user.data.getLoginFormCreds(event), 
            (success) => {
                const username = $(event.currentTarget).find('input[name=username]').val();
                localStorage.setItem('currentUser', JSON.stringify({username: username}));
                localStorage.setItem('JWT', JSON.stringify({token: success.authToken}));

                const currentUser = JSON.parse(localStorage.getItem('currentUser')).username;
                const JWT = JSON.parse(localStorage.getItem('JWT')).token; 

                ajax.getAuth(`${GET_POST_URL}/${username}`, JWT, username, 
                    (success) => {
                        post.render.PostResults(success);
                }, (error) => {
                    console.log(error);
                }, );
                ajax.getAuth(`${GET_PROFILE_URL}/${username}`, JWT, username, 
                    (success) =>{
                        user.render.ProfileResults(success);
                }, (error) =>{
                    console.log(error);
                });
                ajax.getAuth(`${GET_MAP_URL}/${username}`, JWT, username, 
                    (success) => {
                        new init.Datamap('#worldMapView');
                        map.render.MapResults(success);
                }, (error) => {
                    console.log(error);
                });
                user.callback.LoginSuccess(username);
            }, (error) => {
                user.callback.LoginError(error);
            });
    });

    // Watch refresh authentication button
    $('#refreshJWT').click(event => {
        let JWT = JSON.parse(localStorage.getItem('JWT')).token;
        ajax.postAuth(REFRESH_URL, JWT, {}, 
            (success) => {
                localStorage.setItem('JWT', JSON.stringify({token: success.authToken}));
                user.callback.RefreshSuccess(success);
            }, (error) => {
                user.callback.RefreshError(error);
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

        ajax.postAuthFile(POST_POST_URL, JWT, data,
        (success) =>{
            post.callback.UploadSuccess(success);
            let username = JSON.parse(localStorage.getItem('currentUser')).username;
            ajax.getAuth(`${GET_POST_URL}/${username}`, JWT, username, 
            (success) =>{
                post.render.PostResults(success);
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