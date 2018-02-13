export function getUploadFormData(event) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser')).username;
    let title = $(event.currentTarget).find("input[name=title]").val();
    let caption =  $(event.currentTarget).find("input[name=caption]").val();

    console.log(title);
    console.log(caption);

    if (title === ''){
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