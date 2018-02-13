export function getUploadFormData(event) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser')).username;
    let title = $(event.currentTarget).find("input[name=title]").val();
    let caption =  $(event.currentTarget).find("input[name=caption]").val();

    return {
        username: currentUser,
        title: title === "" ? "Title" : title,
        caption: caption === "" ? "Caption" : caption,
        img: $(event.currentTarget).find("input[name=image]").val() 
    }

}