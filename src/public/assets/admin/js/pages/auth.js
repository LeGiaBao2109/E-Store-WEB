export const initAdminAuth = () => {
    const adminData = JSON.parse(localStorage.getItem('currentAdmin'));
    if (adminData && $('#adminDisplayName').length) {
        $('#adminDisplayName').text(adminData.fullName);
    }

    $(".toggle-password").click(function () {
        const $input = $(this).closest('.input-group').find('input');
        const $icon = $(this).find('i');
        if ($input.attr('type') === 'password') {
            $input.attr('type', 'text');
            $icon.attr('class', 'bi bi-eye text-danger');
        } else {
            $input.attr('type', 'password');
            $icon.attr('class', 'bi bi-eye-slash text-secondary');
        }
    });

    $("#adminCode").on('blur', function () {
        const value = $(this).val().trim();
        if (value === "") {
            $(this).addClass('is-invalid');
        } else {
            $(this).removeClass('is-invalid').addClass('is-valid');
        }
    });

    $("#password").on('blur', function () {
        const pass = $(this).val();
        const regexPass = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
        if (pass === "" || !regexPass.test(pass)) {
            $(this).addClass('is-invalid');
        } else {
            $(this).removeClass('is-invalid').addClass('is-valid');
        }
    });

    $('#adminLoginForm').on('submit', function (e) {
        e.preventDefault();
        $(this).find('input').trigger('blur');

        if ($(this).find('.is-invalid').length > 0) {
            alert("Vui lòng nhập đúng định dạng mã nhân viên và mật khẩu!");
            return;
        }

        const adminCode = $('#adminCode').val().trim();
        const passwordInput = $('#password').val();
        const admins = JSON.parse(localStorage.getItem('admins')) || [];

        const currentAdmin = admins.find(ad => ad.adminCode === adminCode && ad.password === passwordInput);

        if (currentAdmin) {
            localStorage.setItem('currentAdmin', JSON.stringify({
                adminCode: currentAdmin.adminCode,
                fullName: currentAdmin.fullName,
                loginTime: new Date().getTime()
            }));

            alert(`Đăng nhập thành công!`);
            window.location.href = '/admin';
        } else {
            alert('Mã nhân viên hoặc mật khẩu không chính xác!');
        }
    });

    $(document).on('click', '#btnLogout', function (e) {
        e.preventDefault();
        if (confirm('Bạn có chắc chắn muốn đăng xuất khỏi hệ thống quản trị?')) {
            localStorage.removeItem('currentAdmin');
            window.location.href = '/admin/auth';
        }
    });

    $(document).on('click', '#forgotPasswordAdmin', function (e) {
        e.preventDefault();

        const adminCode = prompt("Vui lòng nhập Mã nhân viên để xác thực:");

        if (adminCode) {
            const admins = JSON.parse(localStorage.getItem('admins')) || [];
            const adminIndex = admins.findIndex(ad => ad.adminCode === adminCode.trim());

            if (adminIndex !== -1) {
                const newPass = prompt("Nhập mật khẩu mới cho tài khoản " + adminCode + ":");

                const regexPass = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

                if (newPass && regexPass.test(newPass)) {
                    admins[adminIndex].password = newPass;
                    localStorage.setItem('admins', JSON.stringify(admins));
                    alert("Đổi mật khẩu thành công! Bạn có thể đăng nhập ngay.");
                } else {
                    alert("Mật khẩu mới không hợp lệ! (Phải có ít nhất 8 ký tự, gồm cả chữ và số)");
                }
            } else {
                alert("Mã nhân viên này không tồn tại trong hệ thống!");
            }
        }
    });
};