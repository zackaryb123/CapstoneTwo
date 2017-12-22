export function getUploadFormData(event) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser')).username;
    return {
        username: currentUser,
        title: $(event.currentTarget).find("input[name=title]").val(),
        caption: $(event.currentTarget).find("input[name=caption]").val(),
        longitude: $(event.currentTarget).find("input[name=longitude]").val(),
        latitude: $(event.currentTarget).find("input[name=latitude]").val(),
        img: $(event.currentTarget).find("input[name=image]").val() 
    }

}