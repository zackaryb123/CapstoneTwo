export function PostResults(render) {
    let results = '';

    render.forEach((post, index) => {
        let title = post.title;
        let caption = post.caption;

        if (title > 30) {
            title = title.substring(0,29)+"...";
        }

        if (caption.length > 30) {
            caption = caption.substring(0,29)+"...";
        }

        results += `                
        <div id="${post.public_id}" class="post-card col-sm-4">
            <a class="ui card" data-toggle="modal" data-target="#Post-Page">
                <image height="260" class="ui image" src="${post.secure_url}" />
                <div class="content">
                    <div class="header"><h3>${title}</h3></div>
                    <div class="caption">${caption}</div>
                    <div class="date">${post.created_at}</div>
                </div>
            </a>
        </div>
        `;
    });
    $('#pixFeed').html(results);
    console.log('post successfully rendered');
}