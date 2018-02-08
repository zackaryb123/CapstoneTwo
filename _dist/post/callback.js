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
    let date = $(event.currentTarget).find('.date').text();
    let public_id = $(event.currentTarget).attr('id');

    $('#Post-ID').text(public_id);
    $('#Post-Card img').attr('src', img_url);
    $('#header').text(title);
    $('#caption').text(caption);
    $('#date').text(date);
}