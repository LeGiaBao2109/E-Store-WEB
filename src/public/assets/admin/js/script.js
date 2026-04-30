import { initDashboardCharts } from './pages/dashboard.js';
import { initProduct } from './pages/product.js';
import { initOrderAdmin } from './pages/order.js';

$(function () {
    console.log("Admin Dashboard Ready với jQuery!");
    initDashboardCharts();
    initProduct();
    initOrderAdmin();

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
        console.log("Đang tải dữ liệu cho sản phẩm:", productId);
        const firstTabEl = document.querySelector('button[data-bs-target="#subtab-info"]');
        if (firstTabEl) {
            const firstTab = new bootstrap.Tab(firstTabEl);
            firstTab.show();
        }
    };

    window.updatePrice = function () {
        const newPrice = $('#newPrice').val();
        const reason = $('#priceReason').val();
        if (!newPrice) {
            alert("Vui lòng nhập giá mới!");
            return;
        }

        const now = new Date().toLocaleDateString('vi-VN');
        const newRow = `
            <tr>
                <td class="small">${now}</td>
                <td class="fw-bold text-danger">${Number(newPrice).toLocaleString()}đ</td>
                <td>${reason || 'Cập nhật định kỳ'}</td>
                <td class="small">Lê Gia Bảo</td>
                <td class="text-center text-success"><i class="bi bi-check-circle-fill"></i></td>
            </tr>`;
        $('#priceHistoryBody i.bi-check-circle-fill').remove();
        $('#priceHistoryBody').prepend(newRow);
        $('#newPrice').val('');
        $('#priceReason').val('');
        alert("Cập nhật giá thành công!");
    };

    window.updateWarehouse = function () {
        const type = $('#logType').val();
        const qty = $('#logQty').val();
        const note = $('#logNote').val();
        if (!qty || qty <= 0) {
            alert("Số lượng phải lớn hơn 0!");
            return;
        }

        const now = new Date().toLocaleDateString('vi-VN');
        const badgeClass = type === 'import' ? 'bg-success' : 'bg-danger';
        const typeText = type === 'import' ? 'Nhập kho' : 'Xuất kho';
        const qtyPrefix = type === 'import' ? '+' : '-';
        const qtyClass = type === 'import' ? 'text-success' : 'text-danger';

        const newLogRow = `
            <tr>
                <td class="small">${now}</td>
                <td><span class="badge ${badgeClass}">${typeText}</span></td>
                <td class="fw-bold ${qtyClass}">${qtyPrefix}${qty}</td>
                <td>${note || 'Giao dịch kho'}</td>
                <td class="small">Lê Gia Bảo</td>
            </tr>`;
        $('#warehouseHistoryBody').prepend(newLogRow);
        $('#logQty').val('');
        $('#logNote').val('');
        alert("Ghi sổ kho thành công!");
    };

    window.viewOrderDetail = function (orderId) {
        console.log("Đang xem đơn hàng:", orderId);
        $('#detailOrderId').text(orderId);
    };

    window.saveOrderChange = function () {
        const status = $('#updateStatusSelect').val();
        const isPaid = $('#paymentStatusSwitch').is(':checked');

        console.log("Cập nhật trạng thái đơn hàng:", {
            status,
            isPaid
        });

        alert("Cập nhật trạng thái đơn hàng thành công!");
        const modal = bootstrap.Modal.getInstance(document.getElementById('modalOrderDetail'));
        modal.hide();
    };

    window.printOrderBill = function () {
        const orderId = $('#detailOrderId').text();
        const customerName = "Lê Gia Bảo";
        const total = 34500000; 
        const subtotal = Math.round(total / 1.1);
        const tax = total - subtotal;

        $('#p-order-id').text(orderId);
        $('#p-date').text(new Date().toLocaleDateString('vi-VN'));
        $('#p-name').text(customerName);
        $('#p-subtotal').text(subtotal.toLocaleString() + 'đ');
        $('#p-tax').text(tax.toLocaleString() + 'đ');
        $('#p-total').text(total.toLocaleString() + 'đ');

        window.print();
    };

    $('#btnGlobalFilter').on('click', function () {
        const fromDate = $('#globalDateFrom').val();
        const toDate = $('#globalDateTo').val();
        console.log(`Đang lọc dữ liệu toàn hệ thống từ ${fromDate} đến ${toDate}`);
    });

    window.toggleUserStatus = function (userId, currentStatus) {
        const action = currentStatus === 'active' ? 'khoá' : 'mở khoá';
        if (confirm(`Bạn có chắc chắn muốn ${action} tài khoản này?`)) {
            console.log(`Đang thực hiện ${action} cho user: ${userId}`);


            alert(`Đã ${action} thành công!`);
        }
    };

    window.editCustomer = function (userId) {
        console.log("Đang lấy thông tin user ID:", userId);

        // Tạm thời set cứng dữ liệu mẫu theo Schema USERS
        $('#editUserId').val(userId);
        $('#editCustomerName').val("Lê Gia Bảo");
        $('#editCustomerPhone').val("0358356xxx");
        $('#editCustomerStatus').val("active");
        $('#editCustomerAddress').val("12 Nguyễn Văn Bảo, P.4, Gò Vấp, TP.HCM");

        const modal = new bootstrap.Modal(document.getElementById('modalEditCustomer'));
        modal.show();
    };

    window.saveCustomerEdit = function () {
        const id = $('#editUserId').val();
        const name = $('#editCustomerName').val();
        const status = $('#editCustomerStatus').val();

        if (!name) {
            alert("Tên khách hàng không được để trống!");
            return;
        }

        console.log("Gửi yêu cầu cập nhật lên Server cho User:", {
            id,
            name,
            status
        });

        alert("Cập nhật thông tin khách hàng thành công!");
        $('#modalEditCustomer').modal('hide');
    };
});