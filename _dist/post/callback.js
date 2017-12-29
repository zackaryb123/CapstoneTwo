export function UploadSuccess(suc) {
    //callback
    
    //event 
    $('#Upload-Form').trigger('reset');
    $("#Upload-Page").modal('hide');

    alert(`${suc.title} successfully Uploaded!`);
}

export function OnPostClick(event) {
    let img_url = $(event.currentTarget).find('img').attr('src');
    console.log(img_url);

    let title = $(event.currentTarget).find('.header').text();
    let caption = $(event.currentTarget).find('.caption').text();
    let longitude = $(event.currentTarget).find('.longitude').text();
    let latitude = $(event.currentTarget).find('.latitude').text();
    let date = $(event.currentTarget).find('.date').text();
    let public_id = $(event.currentTarget).attr('id');

    $('#Post-ID').text(public_id);
    $('#Post-Card img').attr('src', img_url);
    $('#header').text(title);
    $('#caption').text(caption);
    $('#longitude').text(longitude);
    $('#latitude').text(latitude);
    $('#date').text(date);
}