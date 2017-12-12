const REGISTER_URL = 'http://localhost:8080/users/register';
const LOGIN_URL = "http://localhost:8080/auth/login"

export function postAjax(URL, data, callback) {
    const settings = {
        url: URL,
        headers: {
            'Content-Type': 'application/json'
        },
        data: data,
        dataType: 'json',
        type: 'POST',
        error: (err) => {
            console.error(err);
        },
        success: callback
    };
    $.ajax(settings);
}

function watchRegisterBtn() {
    $('#registerBtn').on('click', event => {
        const username = $('#registerForm').find("input=[name=username]").val();
        const email = $('#registerForm').find("input=[name=email]").val();
        const firstName = $('#registerForm').find("input=[name=firstname]").val();
        const lastName = $('#registerForm').find("input=[name=lastname]").val();
        const password = $('#registerForm').find("input=[name=password]").val();

        const data = 
        {
            "username": username,
            "password": password,
            "firstName": firstName,
            "lastName": lastName,
            "email": email
        };

        postAjax(REGISTER_URL, data, callback);       
    });
}

function callback() {
    consle.log("Datta successfully sent!")
}

$(watchRegisterBtn);