export function watchNavBtns(event) {
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
                $('#Jumbo-Header').text('Profile');
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
                $('#Jumbo-Header').text('Locate Your Pictures on the Map');
            }
            break;
    }
}