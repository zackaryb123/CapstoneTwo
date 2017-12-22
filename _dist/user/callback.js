// Eventually import all to this file and call ajax funtions then export to index

export function PreventModalClose(event) {
    let JWT = JSON.parse(localStorage.getItem('JWT')).token;
    if(JWT === '') {
       event.preventDefault();
       event.stopImmediatePropagation();
       return false; 
     }
}

export function RegisterSuccess(suc) {
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

export function RegisterError(err) {
    //callback
    alert(`Error: ${err.responseJSON.message}!`);
}

export function LoginSuccess(username) {
    //callback
    
    //event
    $('#loginForm').trigger('reset');
    $('#signoutBtn').prop('hidden', false);
    $("#login-joinPage").modal('hide');

    alert(`${username} successfully loged in!`);  
}

export function LoginError(err) {
    //callback
    alert(`Error: ${err.responseText}!`);
}

export function RefreshSuccess(suc) {
    //callback
    alert("Authentication has been refreshed!");
}

export function RefreshError(err) {
    //callback
    alert(`Error: ${err.responseJSON.message}!`);
}

export function SignOutSuccess(event) {
    window.location.reload(true);
}

export function UploadSuccess(event) {
    $('#Upload-Form').trigger('reset');
    $("#Upload-Page").modal();
}