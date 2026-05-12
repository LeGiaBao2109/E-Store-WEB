import {
    initAdminAuth
} from './pages/auth.js';
import {
    initDashboardCharts
} from './pages/dashboard.js';
import {
    initProduct
} from './pages/product.js';
import {
    initOrderAdmin
} from './pages/order.js';
import {
    initCustomerManagement
} from './pages/customer.js';
import {
    initNews
} from './pages/news.js';

$(function () {
    const path = window.location.pathname;

    if (path.includes('/admin/auth')) {
        initAdminAuth();
        return;
    }

    const currentAdmin = localStorage.getItem('currentAdmin');
    if (path.includes('/admin') && !currentAdmin) {
        window.location.href = '/admin/auth';
        return;
    }

    initAdminAuth();
    initDashboardCharts();
    initProduct();
    initOrderAdmin();
    initCustomerManagement();
    initNews();

    window.switchSubTab = function (target) {
        let tabTriggerEl;
        if (target === 'price') {
            tabTriggerEl = document.querySelector('button[data-bs-target="#subtab-price"]');
        } else if (target === 'warehouse') {
            tabTriggerEl = document.querySelector('button[data-bs-target="#subtab-warehouse"]');
        }
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

    window.viewOrderDetail = function (orderId) {
        $('#detailOrderId').text(orderId);
    };

    window.saveOrderChange = function () {
        const status = $('#updateStatusSelect').val();
        const isPaid = $('#paymentStatusSwitch').is(':checked');
        alert("Cập nhật trạng thái đơn hàng thành công!");
        const modal = bootstrap.Modal.getInstance(document.getElementById('modalOrderDetail'));
        if (modal) modal.hide();
    };

    window.printOrderBill = function () {
        const orderId = $('#detailOrderId').text();
        const customerName = "Khách hàng hệ thống";
        const total = 0;
        $('#p-order-id').text(orderId);
        $('#p-date').text(new Date().toLocaleDateString('vi-VN'));
        $('#p-name').text(customerName);
        $('#p-total').text(total.toLocaleString() + 'đ');
        window.print();
    };

    $('#btnGlobalFilter').on('click', function () {
        const fromDate = $('#globalDateFrom').val();
        const toDate = $('#globalDateTo').val();
        console.log(`Lọc dữ liệu từ ${fromDate} đến ${toDate}`);
    });

    window.saveCustomerEdit = function () {
        $('#btnSubmitEditCustomer').trigger('click');
    };

    window.adminLogout = function () {
        if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
            localStorage.removeItem('currentAdmin');
            window.location.href = '/admin/auth';
        }
    };
});