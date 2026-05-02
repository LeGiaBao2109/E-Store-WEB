function renderHeader() {
    const userStr = localStorage.getItem('currentUser');
    const $cartIcon = $('#cartIcon');
    const $profileLink = $('.bi-person').parent();

    if (userStr && userStr !== "undefined" && userStr !== "null") {
        try {
            const currentUser = JSON.parse(userStr);
            $cartIcon.show();
            $profileLink.attr('href', '/user-profile');
            $profileLink.attr('title', `Chào ${currentUser?.fullName || 'bạn'}`);
        } catch (e) {
            localStorage.removeItem('currentUser');
            handleGuestHeader($cartIcon, $profileLink);
        }
    } else {
        handleGuestHeader($cartIcon, $profileLink);
    }
}

function handleGuestHeader($cartIcon, $profileLink) {
    $cartIcon.hide();
    $profileLink.attr('href', '/auth');
    $profileLink.removeAttr('title');
}

export function initHome() {
    renderHeader();
}

export function checkUserStatus() {
    const sessionUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!sessionUser) return;

    const allUsers = JSON.parse(localStorage.getItem('users')) || [];
    const userInDb = allUsers.find(u => String(u.id) === String(sessionUser.id));

    if (!userInDb) {
        handleForceLogout("Tài khoản của bạn không còn tồn tại trên hệ thống!");
        return;
    }

    if (userInDb.status === 'inactive') {
        handleForceLogout("Tài khoản của bạn đã bị khóa");
        return;
    }

    const isDataChanged = 
        userInDb.email !== sessionUser.email ||
        userInDb.fullName !== sessionUser.fullName ||
        userInDb.phone !== sessionUser.phone;

    if (isDataChanged) {
        handleForceLogout("Thông tin tài khoản đã được cập nhật. Vui lòng đăng nhập lại!");
    }
}

function handleForceLogout(message) {
    alert(message);
    localStorage.removeItem('currentUser');
    window.location.href = '/auth'; 
}