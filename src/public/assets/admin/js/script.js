import { initDashboardCharts } from './pages/dashboard.js';
import { initProduct } from './pages/product.js';
import { initOrderAdmin } from './pages/order.js';

$(function () {
    initDashboardCharts();
    initProduct();
    initOrderAdmin();

    // const getCurrentAdminName = () => {
    //     const user = JSON.parse(localStorage.getItem('currentUser'));
    //     return user ? user.fullName : 'Quản trị viên';
    // };

    window.switchSubTab = function (target) {
        let tabTarget = target === 'price' ? '#subtab-price' : '#subtab-warehouse';
        const tabTriggerEl = document.querySelector(`button[data-bs-target="${tabTarget}"]`);
        if (tabTriggerEl) {
            const tab = new bootstrap.Tab(tabTriggerEl);
            tab.show();
        }
    };

    window.viewProductDetail = function (productId) {
        const firstTabEl = document.querySelector('button[data-bs-target="#subtab-info"]');
        if (firstTabEl) {
            const firstTab = new bootstrap.Tab(firstTabEl);
            firstTab.show();
        }
    };

    $('#btnGlobalFilter').on('click', function () {
        const fromDate = $('#globalDateFrom').val();
        const toDate = $('#globalDateTo').val();
        console.log(`Đang lọc dữ liệu toàn hệ thống từ ${fromDate} đến ${toDate}`);
    });

    window.toggleUserStatus = function (userId, currentStatus) {
        const action = currentStatus === 'active' ? 'khoá' : 'mở khoá';
        if (confirm(`Bạn có chắc chắn muốn ${action} tài khoản này?`)) {
            alert(`Đã ${action} thành công!`);
        }
    };

    window.editCustomer = function (userId) {
        const allUsers = JSON.parse(localStorage.getItem('users')) || [];
        const user = allUsers.find(u => String(u.id) === String(userId));

        if (user) {
            $('#editUserId').val(user.id);
            $('#editCustomerName').val(user.fullName);
            $('#editCustomerPhone').val(user.phone);
            $('#editCustomerStatus').val(user.status || 'active');
            $('#editCustomerAddress').val(user.address || '');
        }

        const modal = new bootstrap.Modal(document.getElementById('modalEditCustomer'));
        modal.show();
    };

    window.saveCustomerEdit = function () {
        const name = $('#editCustomerName').val();
        if (!name) {
            alert("Tên khách hàng không được để trống!");
            return;
        }
        alert("Cập nhật thông tin khách hàng thành công!");
        $('#modalEditCustomer').modal('hide');
    };
});