    export function initAuth() {
        $(".toggle-password").click(function () {
            const $input = $(this).closest('.input-group').find('.password-input');
            const $icon = $(this).find('i');

            if ($input.attr('type') === 'password') {
                $input.attr('type', 'text');
                $icon.attr('class', 'bi bi-eye text-danger');
            } else {
                $input.attr('type', 'password');
                $icon.attr('class', 'bi bi-eye-slash text-secondary');
            }
        });

        $('#switchToRegister').on('click', function (e) {
            e.preventDefault();
            $('#register-tab').tab('show');
        });

        $('#switchToLogin').on('click', function (e) {
            e.preventDefault();
            $('#login-tab').tab('show');
        });

        $("#regFullName").blur(function (e) {
            e.preventDefault();
            const value = $(this).val().trim();
            const $err = $('#errRegFullName');
            const regexName = /^[A-ZÀ-Ỹ][a-zà-ỹ]*(\s[A-ZÀ-Ỹ][a-zà-ỹ]*)+$/u;

            if (value === "") {
                $err.text("Họ tên không được để trống");
                $(this).addClass('is-invalid');
            } else if (!regexName.test(value)) {
                $err.text("Họ tên phải viết hoa chữ cái đầu");
                $(this).addClass('is-invalid');
            } else {
                $err.text("");
                $(this).removeClass('is-invalid').addClass('is-valid');
            }
        });

        $("#regEmail").blur(function (e) {
            e.preventDefault();
            const value = $(this).val().trim();
            const $err = $('#errRegEmail');
            const regexEmail = /^[a-zA-Z0-9._%-]+@gmail\.com$/;

            if (value === "") {
                $err.text("Email không được để trống");
                $(this).addClass('is-invalid');
            } else if (!regexEmail.test(value)) {
                $err.text("Email phải có có đuôi @gmail.com");
                $(this).addClass('is-invalid');
            } else {
                $err.text("");
                $(this).removeClass('is-invalid').addClass('is-valid');
            }
        });

        $('#regSDT').on('blur', function () {
            const value = $(this).val().replace(/[\s.-]/g, '');
            const $err = $('#errRegSDT');
            const regexSDT = /^(03|05|07|08|09)([0-9]{8})$/;

            if (value === "") {
                $err.text("Số điện thoại không được để trống");
                $(this).addClass('is-invalid');
            } else if (!regexSDT.test(value)) {
                $err.text("SĐT không hợp lệ");
                $(this).addClass('is-invalid');
            } else {
                $err.text("");
                $(this).removeClass('is-invalid').addClass('is-valid');
            }
        });

        $('#regUserName').on('blur', function () {
            const value = $(this).val().trim();
            const $err = $('#errRegUserName');

            if (value === "") {
                $err.text("Tên đăng nhập không được để trống");
                $(this).addClass('is-invalid');
            } else {
                $err.text("");
                $(this).removeClass('is-invalid').addClass('is-valid');
            }
        });

        $('#regPass').on('blur', function () {
            const pass = $(this).val();
            const $err = $('#errRegPass');

            const regexPass = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

            if (pass === "") {
                $err.text("Mật khẩu không được để trống");
                $(this).addClass('is-invalid');
            } else if (!regexPass.test(pass)) {
                $err.text("Mật khẩu phải có ít nhất 8 ký tự, bao gồm cả chữ và số");
                $(this).addClass('is-invalid');
            } else {
                $err.text("");
                $(this).removeClass('is-invalid').addClass('is-valid');
            }
        });

        $('#regConfirmPass').on('blur', function () {
            const pass = $('#regPass').val();
            const confirmPass = $(this).val();
            const $err = $('#errRegConfirmPass');

            if (confirmPass === "") {
                $err.text("Vui lòng nhập lại mật khẩu");
                $(this).addClass('is-invalid');
            } else if (confirmPass !== pass) {
                $err.text("Mật khẩu xác nhận không khớp");
                $(this).addClass('is-invalid');
            } else {
                $err.text("");
                $(this).removeClass('is-invalid').addClass('is-valid');
            }
        });

        $("#register form").submit(function (e) {
            e.preventDefault();
            $(this).find('input').trigger('blur');

            if ($(this).find('.is-invalid').length > 0) {
                alert("Vui lòng nhập đầy đủ thông tin hợp lệ");
                return;
            }

            const rawPassword = $('#regPass').val();

            const hashedPassword = CryptoJS.SHA256(rawPassword).toString();

            const newUser = {
                id: Date.now(),
                fullName: $("#regFullName").val().trim(),
                email: $('#regEmail').val().trim(),
                phone: $('#regSDT').val().trim(),
                username: $('#regUserName').val().trim(),
                password: hashedPassword,
                status: 'active',
                createAt: new Date().toISOString()
            }

            const users = JSON.parse(localStorage.getItem('users')) || [];

            if (users.some(u => u.email === newUser.email)) {
                alert("Email này đã tồn tại rồi!");
                $('#regEmail').addClass('is-invalid');
                return;
            }

            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));

            alert("Chúc mừng bạn đã đăng ký thành công tài khoản");
            $(this).trigger("reset");
            $('.form-control').removeClass('is-valid');
            $('#login-tab').tab('show');
        });

        $('#forgotPassword').on('click', function (e) {
            e.preventDefault();

            const email = prompt("Vui lòng nhập Email bạn đã đăng ký:");

            if (email) {
                const users = JSON.parse(localStorage.getItem('users')) || [];

                const userIndex = users.findIndex(u => u.email === email.trim());

                if (userIndex !== -1) {
                    const newPass = prompt("Nhập mật khẩu mới:");
                    if (newPass && newPass.length >= 8) {
                        const hashedNewPass = CryptoJS.SHA256(newPass).toString();

                        users[userIndex].password = hashedNewPass;

                        localStorage.setItem('users', JSON.stringify(users));
                        alert("Đổi mật khẩu thành công! Giờ bạn có thể đăng nhập.");
                    } else {
                        alert("Mật khẩu mới không hợp lệ hoặc quá ngắn!");
                    }
                } else {
                    alert("Email này chưa được đăng ký trong hệ thống!");
                }
            }
        });

        $('#loginForm').on('submit', function (e) {
            e.preventDefault();

            const accountInput = $('#loginUser').val().trim();
            const passwordInput = $('#loginPass').val();

            if (accountInput === "" || passwordInput === "") {
                alert("Nhập đủ tài khoản với mật khẩu đã nhé!");
                return;
            }

            const hashedLoginPass = CryptoJS.SHA256(passwordInput).toString();

            const users = JSON.parse(localStorage.getItem('users')) || [];

            const userFound = users.find(u =>
                (u.username === accountInput || u.email === accountInput) &&
                u.password === hashedLoginPass
            );

            if (userFound) {
                if (userFound.status === 'inactive') {
                    alert("Tài khoản của bạn đã bị khóa!");
                    return;
                }
                const sessionUser = {
                    id: userFound.id,
                    fullName: userFound.fullName,
                    username: userFound.username,
                    email: userFound.email,
                    phone: userFound.phone
                };
                localStorage.setItem('currentUser', JSON.stringify(sessionUser));

                alert(`Đăng nhập thành công!`);

                window.location.href = '/';
            } else {
                alert("Tài khoản hoặc mật khẩu không đúng, vui lòng kiểm tra lại!");
            }
        });
    }