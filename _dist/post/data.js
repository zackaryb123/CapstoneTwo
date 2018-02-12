export function getUploadFormData(event) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser')).username;
    let title = $(event.currentTarget).find("input[name=title]").val();
    let caption =  $(event.currentTarget).find("input[name=caption]").val();

    if (title === null){
        title = " ";
    }

    if (caption == null) {
        caption = " ";
    }

    return {
        username: currentUser,
        title: title,
        caption: caption,
        img: $(event.currentTarget).find("input[name=image]").val() 
    }

}