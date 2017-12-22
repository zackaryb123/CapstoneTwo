export function getRegisterFormInfo(event) {
    return {
        username: $(event.currentTarget).find("input[name=username]").val(),
        password: $(event.currentTarget).find("input[name=password]").val(),
        password2: $(event.currentTarget).find("input[name=password2]").val(),
        firstName: $(event.currentTarget).find("input[name=firstName]").val(),
        lastName: $(event.currentTarget).find("input[name=lastName]").val(),
        email: $(event.currentTarget).find("input[name=email]").val()
    };
}

export function getLoginFormCreds(event) {
    return {
        username: $(event.currentTarget).find("input[name=username]").val(),
        password: $(event.currentTarget).find("input[name=password]").val()
    };
}