export function ProfileResults(render) {
    $('#Username').text(`${render.username}`);
    $('#Name > span').text(`${render.firstName} ${render.lastName}`);
    $('#Bio').text(`${render.bio}`);
    $('#Email').text(`${render.email}`);
    $('#Avatar').prop('src',`${render.avatar}`);
    //debug    
    console.log('profile successfully rendered');
}