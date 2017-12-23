export function PostResults(render) {
    let results = '';
    render.forEach((post, index) => {
        results += `                
        <div id="${post.public_id}" class="post-card col-sm-4">
            <a class="ui card" data-toggle="modal" data-target="#Post-Page">
                <image height="260" class="ui image" src="${post.secure_url}" />
                <div class="content">
                    <div class="header">${post.title}</div>
                    <div class="meta">${post.caption}</div>
                    <div class=longitude>${post.longitude}</div>
                    <div class="latitude">${post.latitude}</div>
                    <div class="date">${post.created_at}</div>
                </div>
            </a>
        </div>
        `;
    });
    $('#pixFeed').html(results);
    console.log('post successfully rendered');
}