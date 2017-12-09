//Application navigation event watchers
function watchNavBtns() {
    $('ul.navbar-nav').on('click', '.nav-link', event => {
        let btn = $(event.currentTarget).attr('id');
        switch(btn) {
            case 'profileBtn':
                let isProfileActive = $(event.currentTarget).parent().hasClass('active');
                if (isProfileActive) {return;}
                if (!isProfileActive) {
                    $('li.nav-item.active').removeClass('active');
                    $(event.currentTarget).parent().addClass('active');
                    $('#worldMapView').attr('hidden', true);
                    $('#profileView').attr('hidden', false);
                }
                break;
            case 'globeBtn':
                let isGlobeActive = $(event.currentTarget).parent().hasClass('active');
                if (isGlobeActive) {return;}
                if (!isGlobeActive) {
                    $('li.nav-item.active').removeClass('active');
                    $(event.currentTarget).parent().addClass('active');
                    $('#profileView').attr('hidden', true);
                    $('#worldMapView').attr('hidden', false);
                }
                break;
        }
    });
}

$(watchNavBtns);