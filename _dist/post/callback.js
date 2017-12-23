export function UploadSuccess(suc) {
    //callback
    
    //event 
    $('#Upload-Form').trigger('reset');
    $("#Upload-Page").modal('hide');

    alert(`${suc.title} successfully Uploaded!`);
}

export function OnPostClick(event) {
    let post_id = $(event.currentTarget).attr('id');
    console.log(post_id);

    let img_url = $(event.currentTarget).find('img').attr('src');
    console.log(img_url);

    let title = $(event.currentTarget).find('div .content > .header').text;
    let caption = $(event.currentTarget).find('div .content > .meta').text;
    let longitude = $(event.currentTarget).find('div .content > .longitude').text;
    let latitude = $(event.currentTarget).find('div .content > .latitude').text;
    let date = $(event.currentTarget).find('div .content > .date').text;

    console.log(`t: ${title} c: ${caption} long: ${longitude} lat: ${latitude} date: ${date}`);

    $('#Post-Card img').attr('src', img_url);
    //Set image rem to 30
}