import { getCartItems } from '../utils/cart.js';

export const initUserProfile = () => {
    const renderData = () => {
        const userStr = localStorage.getItem('currentUser');
        
        if (!userStr || userStr === "null") {
            window.location.replace("/");
            return;
        }

        try {
            const currentUser = JSON.parse(userStr);

            $('#display-name').text(currentUser.fullName || "Chưa cập nhật");
            $('#u-username').text(currentUser.username || "Chưa cập nhật");
            $('#u-email').text(currentUser.email || "Chưa cập nhật");
            $('#u-phone').text(currentUser.phone || "Chưa cập nhật");
            $('#u-address').text(currentUser.address || "Chưa cập nhật");

            $('#editName').val(currentUser.fullName || "");
            $('#editEmail').val(currentUser.email || "");
            $('#editPhone').val(currentUser.phone || "");
            $('#editAddress').val(currentUser.address || "");

            const allOrders = JSON.parse(localStorage.getItem('order_history')) || [];
            const currentId = currentUser.id || currentUser._id;
            const myOrders = allOrders.filter(order => String(order.userId) === String(currentId));

            $('.badge.bg-danger').text(`${myOrders.length} đơn hàng`);

            const $tbody = $('table tbody');
            $tbody.empty();

            if (myOrders.length === 0) {
                $tbody.append('<tr><td colspan="6" class="text-center py-4 text-muted">Bạn chưa có đơn hàng nào.</td></tr>');
            } else {
                myOrders.forEach((order, index) => {
                    const firstItem = (order.items && order.items[0]) ? order.items[0] : { title: 'Sản phẩm' };
                    const otherItemsCount = (order.items) ? order.items.length - 1 : 0;
                    
                    const productDisplay = otherItemsCount > 0 ?
                        `${firstItem.title} <br> <small class="text-muted">+ ${otherItemsCount} sản phẩm khác</small>` :
                        firstItem.title;

                    const statusMap = {
                        'Chờ xác nhận': 'bg-warning text-dark',
                        'Đang giao': 'bg-info text-white',
                        'Hoàn thành': 'bg-success text-white',
                        'Đã hủy': 'bg-secondary text-white'
                    };
                    const statusClass = statusMap[order.status] || 'bg-light text-dark';

                    const row = `
                        <tr>
                            <td>${index + 1}</td>
                            <td>
                                <div class="d-flex align-items-center">
                                    <div>
                                        <div class="fw-bold small">${productDisplay}</div>
                                        <div class="text-muted" style="font-size: 10px;">Mã đơn: ${order.orderId}</div>
                                    </div>
                                </div>
                            </td>
                            <td><span class="badge ${statusClass} rounded-pill px-3" style="font-size: 11px;">${order.status}</span></td>
                            <td class="small">${order.date || ''}</td>
                            <td class="fw-bold text-danger">${(order.totalAmount || 0).toLocaleString('vi-VN')} đ</td>
                            <td class="text-center">
                                <button class="btn btn-sm btn-light border rounded-pill px-3" onclick="viewOrderDetail('${order.orderId}')">Chi tiết</button>
                            </td>
                        </tr>
                    `;
                    $tbody.append(row);
                });
            }
        } catch (error) {
            console.error("Lỗi render dữ liệu profile:", error);
            window.location.replace("/");
        }
    };

    $('#btnLogout').off('click').on('click', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        
        if (confirm("Bạn có chắc muốn đăng xuất không?")) {
            localStorage.removeItem('currentUser');
            window.location.replace("/");
        }
    });

    $("#editName").off('blur').on('blur', function () {
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

    // Validation số điện thoại
    $('#editPhone').off('blur').on('blur', function () {
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

    // Cập nhật thông tin cá nhân
    $('#modalUpdate .btn-danger').off('click').on('click', function (e) {
        e.preventDefault();
        $('#editName, #editPhone').trigger('blur');

        if ($('#modalUpdate').find('.is-invalid').length > 0) {
            alert("Vui lòng nhập đầy đủ và đúng định dạng thông tin!");
            return;
        }

        const userStr = localStorage.getItem('currentUser');
        if (userStr) {
            let currentUser = JSON.parse(userStr);
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const updatedData = {
                fullName: $('#editName').val().trim(),
                phone: $('#editPhone').val().trim(),
                address: $('#editAddress').val().trim()
            };

            const currentId = currentUser.id || currentUser._id;
            const userIndex = users.findIndex(u => String(u.id || u._id) === String(currentId));
            
            if (userIndex !== -1) {
                users[userIndex] = { ...users[userIndex], ...updatedData };
                localStorage.setItem('users', JSON.stringify(users));
            }

            currentUser = { ...currentUser, ...updatedData };
            localStorage.setItem('currentUser', JSON.stringify(currentUser));

            alert("Thông tin cá nhân đã được lưu thành công!");
            $('.form-control').removeClass('is-valid is-invalid');
            
            // Đóng modal bằng Bootstrap API
            const modalEl = document.getElementById('modalUpdate');
            const modalInstance = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
            modalInstance.hide();
            
            renderData();
        }
    });

    // Validation đổi mật khẩu
    $('#currentPass').off('blur').on('blur', function () {
        const $err = $('#errCurrentPass');
        if ($(this).val() === "") {
            $err.text("Mật khẩu hiện tại không được để trống");
            $(this).removeClass('is-valid').addClass('is-invalid');
        } else {
            $err.text("");
            $(this).removeClass('is-invalid').addClass('is-valid');
        }
    });

    $('#newPass').off('blur').on('blur', function () {
        const pass = $(this).val();
        const currentPass = $('#currentPass').val();
        const $err = $('#errNewPass');
        const regexPass = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

        if (pass === "") {
            $err.text("Mật khẩu mới không được để trống");
            $(this).removeClass('is-valid').addClass('is-invalid');
        } else if (!regexPass.test(pass)) {
            $err.text("Mật khẩu phải từ 8 ký tự, gồm cả chữ và số");
            $(this).removeClass('is-valid').addClass('is-invalid');
        } else if (pass === currentPass) {
            $err.text("Mật khẩu mới không được trùng mật khẩu cũ");
            $(this).removeClass('is-valid').addClass('is-invalid');
        } else {
            $err.text("");
            $(this).removeClass('is-invalid').addClass('is-valid');
        }
    });

    $('#confirmPass').off('blur').on('blur', function () {
        const $err = $('#errConfirmPass');
        if ($(this).val() === "") {
            $err.text("Vui lòng nhập lại mật khẩu mới");
            $(this).removeClass('is-valid').addClass('is-invalid');
        } else if ($(this).val() !== $('#newPass').val()) {
            $err.text("Mật khẩu xác nhận không khớp");
            $(this).removeClass('is-valid').addClass('is-invalid');
        } else {
            $err.text("");
            $(this).removeClass('is-invalid').addClass('is-valid');
        }
    });

    // Xử lý đổi mật khẩu
    $('#modalPass .btn-danger').off('click').on('click', function (e) {
        e.preventDefault();
        $('#currentPass, #newPass, #confirmPass').trigger('blur');

        if ($('#modalPass').find('.is-invalid').length > 0) return;

        const sessionUser = JSON.parse(localStorage.getItem('currentUser'));
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const currentId = sessionUser.id || sessionUser._id;
        const userIndex = users.findIndex(u => String(u.id || u._id) === String(currentId));

        if (userIndex !== -1) {
            const hashedCurrentPass = CryptoJS.SHA256($('#currentPass').val()).toString();
            if (users[userIndex].password !== hashedCurrentPass) {
                $('#errCurrentPass').text("Mật khẩu hiện tại không đúng");
                $('#currentPass').addClass('is-invalid');
                return;
            }

            users[userIndex].password = CryptoJS.SHA256($('#newPass').val()).toString();
            localStorage.setItem('users', JSON.stringify(users));

            alert("Đổi mật khẩu thành công!");
            $('#currentPass, #newPass, #confirmPass').val('').removeClass('is-valid is-invalid');
            
            const modalEl = document.getElementById('modalPass');
            const modalInstance = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
            modalInstance.hide();
        }
    });

    renderData();
};

window.viewOrderDetail = (orderId) => {
    sessionStorage.setItem('viewingOrderId', orderId);
    window.location.href = "/user-profile/order-history"; 
};