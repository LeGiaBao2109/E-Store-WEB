export const initUserProfile = () => {
    const userStr = localStorage.getItem('currentUser');
    
    if (userStr) {
        const currentUser = JSON.parse(userStr);

        $('#display-name').text(currentUser.fullName || "Chưa cập nhật");
        $('#u-username').text(currentUser.username || "Chưa cập nhật");
        $('#u-email').text(currentUser.email || "Chưa cập nhật");
        $('#u-phone').text(currentUser.phone || "Chưa cập nhật");
        $('#u-address').text(currentUser.address || "Chưa cập nhật");

        $('#editName').val(currentUser.fullName || "");
        $('#editEmail').val(currentUser.email || "");
        
        $('#editEmail').prop('readonly', true).addClass('bg-light text-muted'); 

        $('#editPhone').val(currentUser.phone || "");
        $('#editAddress').val(currentUser.address || "");
    }

    $('#btnLogout').on('click', function(e) {
        e.preventDefault();
        if (confirm("Bạn có chắc muốn đăng xuất không?")) {
            localStorage.removeItem('currentUser');
            window.location.href = "/";
        }
    });

    $("#editName").blur(function (e) {
        const value = $(this).val().trim();
        const $err = $('#errEditName');
        const regexName = /^[A-ZÀ-Ỹ][a-zà-ỹ]*(\s[A-ZÀ-Ỹ][a-zà-ỹ]*)+$/u;

        if (value === "") {
            $err.text("Họ tên không được để trống");
            $(this).removeClass('is-valid').addClass('is-invalid');
        } else if (!regexName.test(value)) {
            $err.text("Họ tên phải viết hoa chữ cái đầu");
            $(this).removeClass('is-valid').addClass('is-invalid');
        } else {
            $err.text("");
            $(this).removeClass('is-invalid').addClass('is-valid');
        }
    });

    $('#editPhone').on('blur', function () {
        const value = $(this).val().replace(/[\s.-]/g, '');
        const $err = $('#errEditPhone');
        const regexSDT = /^(03|05|07|08|09)([0-9]{8})$/;

        if (value === "") {
            $err.text("Số điện thoại không được để trống");
            $(this).removeClass('is-valid').addClass('is-invalid');
        } else if (!regexSDT.test(value)) {
            $err.text("SĐT không hợp lệ");
            $(this).removeClass('is-valid').addClass('is-invalid');
        } else {
            $err.text("");
            $(this).removeClass('is-invalid').addClass('is-valid');
        }
    });

    $('#editAddress').on('blur', function () {
        const value = $(this).val().trim();
        const $err = $('#errEditAddress');

        if (value === "") {
            $err.text("Địa chỉ không được để trống");
            $(this).removeClass('is-valid').addClass('is-invalid');
        } else {
            $err.text("");
            $(this).removeClass('is-invalid').addClass('is-valid');
        }
    });

    $('#modalUpdate .btn-danger').on('click', function(e) {
        e.preventDefault();

        $('#editName, #editPhone, #editAddress').trigger('blur');

        if ($('#modalUpdate').find('.is-invalid').length > 0) {
            alert("Vui lòng nhập đầy đủ và đúng định dạng thông tin!");
            return;
        }

        const updatedData = {
            fullName: $('#editName').val().trim(),
            email: $('#editEmail').val(),
            phone: $('#editPhone').val().trim(),
            address: $('#editAddress').val().trim()
        };

        if (userStr) {
            let currentUser = JSON.parse(userStr);
            const users = JSON.parse(localStorage.getItem('users')) || [];
            
            const userIndex = users.findIndex(u => u.id === currentUser.id);
            if (userIndex !== -1) {
                users[userIndex] = { ...users[userIndex], ...updatedData };
                localStorage.setItem('users', JSON.stringify(users));
            }

            currentUser = { ...currentUser, ...updatedData };
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            $('#display-name').text(currentUser.fullName);
            $('#u-phone').text(currentUser.phone);
            $('#u-address').text(currentUser.address);
            
            alert("Thông tin cá nhân đã được lưu thành công!");
            $('.form-control').removeClass('is-valid is-invalid');
            $('#modalUpdate').modal('hide');
        }
    });

    $('#currentPass').on('blur', function () {
        const pass = $(this).val();
        const $err = $('#errCurrentPass');

        if (pass === "") {
            $err.text("Mật khẩu hiện tại không được để trống");
            $(this).removeClass('is-valid').addClass('is-invalid');
        } else {
            $err.text("");
            $(this).removeClass('is-invalid').addClass('is-valid');
        }
    });

    $('#newPass').on('blur', function () {
        const pass = $(this).val();
        const $err = $('#errNewPass');
        const regexPass = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

        if (pass === "") {
            $err.text("Mật khẩu mới không được để trống");
            $(this).removeClass('is-valid').addClass('is-invalid');
        } else if (!regexPass.test(pass)) {
            $err.text("Mật khẩu phải từ 8 ký tự, gồm cả chữ và số");
            $(this).removeClass('is-valid').addClass('is-invalid');
        } else {
            $err.text("");
            $(this).removeClass('is-invalid').addClass('is-valid');
        }
    });

    $('#confirmPass').on('blur', function () {
        const pass = $('#newPass').val();
        const confirmPass = $(this).val();
        const $err = $('#errConfirmPass');

        if (confirmPass === "") {
            $err.text("Vui lòng nhập lại mật khẩu mới");
            $(this).removeClass('is-valid').addClass('is-invalid');
        } else if (confirmPass !== pass) {
            $err.text("Mật khẩu xác nhận không khớp");
            $(this).removeClass('is-valid').addClass('is-invalid');
        } else {
            $err.text("");
            $(this).removeClass('is-invalid').addClass('is-valid');
        }
    });

    $('#modalPass .btn-danger').off('click').on('click', function(e) {
        e.preventDefault();

        $('#currentPass, #newPass, #confirmPass').trigger('blur');

        if ($('#modalPass').find('.is-invalid').length > 0) {
            return; 
        }

        const currentPass = $('#currentPass').val();
        const newPass = $('#newPass').val();

        const sessionUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!sessionUser) {
            alert("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!");
            window.location.href = "/";
            return;
        }

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(u => u.id === sessionUser.id);

        if (userIndex !== -1) {
            const hashedCurrentPass = CryptoJS.SHA256(currentPass).toString();

            if (users[userIndex].password !== hashedCurrentPass) {
                $('#errCurrentPass').text("Mật khẩu hiện tại không đúng");
                $('#currentPass').removeClass('is-valid').addClass('is-invalid');
                return;
            }

            const hashedNewPass = CryptoJS.SHA256(newPass).toString();
            users[userIndex].password = hashedNewPass;

            localStorage.setItem('users', JSON.stringify(users));

            alert("Đổi mật khẩu thành công!");

            $('#currentPass, #newPass, #confirmPass').val('').removeClass('is-valid is-invalid');
            $('#modalPass').modal('hide');
        } else {
            alert("Lỗi: Không tìm thấy dữ liệu tài khoản trong hệ thống!");
        }
    });
};