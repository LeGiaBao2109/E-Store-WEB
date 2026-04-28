function renderHeader() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const $cartIcon = $('#cartIcon');
    const $profileLink = $('.bi-person').parent();

    if (currentUser) {
        $cartIcon.show();
        $profileLink.attr('href', '/user-profile');
        $profileLink.attr('title', `Chào ${currentUser.fullName}`);
    } else {
        $cartIcon.hide();
        $profileLink.attr('href', '/auth');
    }
}

export function initHome() {
    renderHeader();
}