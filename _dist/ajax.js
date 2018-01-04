export function post(URL, data, suc, err) {
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

export function postAuth(URL, token, data, suc, err) {
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


export function postAuthFile(URL, token, data, suc, err) {
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

export function getAuth(URL, token, suc, err) {
    const settings = {
        url: URL,
        headers:{
            "Authorization": `Bearer ${token}`,
            "Content-Type": 'application/json'
        },
        dataType: 'json',
        type: 'GET',
        success: suc,
        error: err
    };
    $.ajax(settings);
}

export function deleteAuth(URL, token, suc, err) {
    const settings ={
        url: URL,
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": 'application/json'
        },
        type: 'DELETE',
        success: suc,
        error: err
    }
    $.ajax(settings);
}

export function putAuthFile(URL, token, data, suc, err) {
    const settings ={
        url: URL,
        headers: {
            "Authorization": `Bearer ${token}`
        },
        contentType: false,
        processData: false,
        data: data,
        type: 'PUT',
        success: suc,
        error: err
    }
    $.ajax(settings);
}