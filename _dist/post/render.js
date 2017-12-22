export function PostResults(render) {
    let results = '';
    render.forEach((post, index) => {
        results += `                
        <div id="${post.public_id}" class="col-sm-4">
            <a class="ui card">
                <image height="260" class="ui image" src="${post.secure_url}" />
                <div class="content">
                    <div class="header">${post.title}</div>
                    <div class="meta">${post.caption}</div>
                    <div><span>${post.latitude}x${post.longitude}</span></div>
                    <div class="date">${post.created_at}</div>
                </div>
            </a>
        </div>
        `;
    });
    $('#pixFeed').html(results);
    console.log('post successfully rendered');
}