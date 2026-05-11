let users = JSON.parse(localStorage.getItem('users')) || [];

export const initCustomerManagement = () => {
    renderUserTable(users);
    setupEventListeners();
};

const renderUserTable = (data) => {
    const $tbody = $('#content-customers tbody');
    if (!$tbody.length) return;

    $tbody.empty();

    if (data.length === 0) {
        $tbody.append(`
            <tr>
                <td colspan="5" class="text-center py-4 text-muted">
                    Không tìm thấy khách hàng nào phù hợp.
                </td>
            </tr>
        `);
        return;
    }

    data.forEach((user) => {
        const isBlock = user.status === 'inactive';
        
        $tbody.append(`
            <tr>
                <td>
                    <div class="d-flex align-items-center">
                        <div class="rounded-circle bg-danger text-white d-flex align-items-center justify-content-center me-3"
                            style="width: 40px; height: 40px; font-weight: bold;">
                            ${user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                            <h6 class="mb-0 fw-bold">${user.fullName}</h6>
                            <small class="text-muted">@${user.username || 'user'}</small>
                        </div>
                    </div>
                </td>
                <td>
                    <div class="small"><i class="bi bi-envelope me-1"></i> ${user.email}</div>
                    <div class="small"><i class="bi bi-phone me-1"></i> ${user.phone}</div>
                </td>
                <td>
                    <div class="text-truncate small" style="max-width: 200px;">${user.address || 'Chưa có địa chỉ'}</div>
                </td>
                <td class="text-center">
                    <span class="badge ${isBlock ? 'bg-danger-subtle text-danger' : 'bg-success-subtle text-success'} rounded-pill">
                        ${isBlock ? 'Đã khóa' : 'Đang hoạt động'}
                    </span>
                </td>
                <td class="text-end">
                    <div class="btn-group">
                        <button class="btn btn-sm btn-light border-0 btn-edit-customer" data-id="${user.id}">
                            <i class="bi bi-pencil-square text-primary"></i>
                        </button>
                        <button class="btn btn-sm btn-light border-0 btn-toggle-status" data-id="${user.id}">
                            <i class="bi ${isBlock ? 'bi-lock text-danger' : 'bi-unlock text-success'}"></i>
                        </button>
                        <button class="btn btn-sm btn-light border-0 btn-delete-customer" data-id="${user.id}">
                            <i class="bi bi-trash text-danger"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `);
    });
};

const setupEventListeners = () => {
    $('#content-customers input[type="text"]').off('input').on('input', function() {
        const keyword = $(this).val().toLowerCase().trim();
        
        const filteredUsers = users.filter(user => {
            const name = (user.fullName || '').toLowerCase();
            const email = (user.email || '').toLowerCase();
            const phone = (user.phone || '').toLowerCase();
            const username = (user.username || '').toLowerCase();

            return name.includes(keyword) || 
                   email.includes(keyword) || 
                   phone.includes(keyword) || 
                   username.includes(keyword);
        });

        renderUserTable(filteredUsers);
    });

    $(document).off('click', '.btn-edit-customer').on('click', '.btn-edit-customer', function() {
        const userId = $(this).data('id');
        const user = users.find(u => String(u.id) === String(userId));
        
        if (user) {
            $('.form-control').removeClass('is-invalid is-valid');
            $('#editUserId').val(user.id);
            $('#editCustomerEmail').val(user.email);
            $('#editCustomerName').val(user.fullName);
            $('#editCustomerPhone').val(user.phone);
            $('#editCustomerStatus').val(user.status || 'active');
            $('#editCustomerAddress').val(user.address || '');
            
            const modalEl = document.getElementById('modalEditCustomer');
            if (modalEl) {
                const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
                modal.show();
            }
        }
    });

    $(document).off('click', '.btn-toggle-status').on('click', '.btn-toggle-status', function() {
        const userId = $(this).data('id');
        const index = users.findIndex(u => String(u.id) === String(userId));
        
        if (index !== -1) {
            users[index].status = (users[index].status === 'inactive') ? 'active' : 'inactive';
            saveData();
            alert(`Đã ${users[index].status === 'active' ? 'mở khóa' : 'khóa'} tài khoản thành công!`);
        }
    });

    $(document).off('click', '.btn-delete-customer').on('click', '.btn-delete-customer', function() {
        const userId = $(this).data('id');
        if (confirm('Xác nhận xóa khách hàng này khỏi hệ thống?')) {
            users = users.filter(u => String(u.id) !== String(userId));
            saveData();
        }
    });

    $('#btnSubmitEditCustomer').off('click').on('click', function() {
        const userId = $('#editUserId').val();
        const index = users.findIndex(u => String(u.id) === String(userId));

        const name = $('#editCustomerName').val().trim();
        const email = $('#editCustomerEmail').val().trim();
        const phone = $('#editCustomerPhone').val().trim().replace(/[\s.-]/g, '');
        const status = $('#editCustomerStatus').val();
        const address = $('#editCustomerAddress').val().trim();

        const regexName = /^[A-ZÀ-Ỹ][a-zà-ỹ]*(\s[A-ZÀ-Ỹ][a-zà-ỹ]*)+$/u;
        const regexEmail = /^[a-zA-Z0-9._%-]+@gmail\.com$/;
        const regexSDT = /^(03|05|07|08|09)([0-9]{8})$/;

        let isValid = true;

        if (name === "" || !regexName.test(name)) {
            $('#editCustomerName').addClass('is-invalid');
            isValid = false;
        } else {
            $('#editCustomerName').removeClass('is-invalid').addClass('is-valid');
        }

        if (email === "" || !regexEmail.test(email)) {
            $('#editCustomerEmail').addClass('is-invalid');
            isValid = false;
        } else {
            const isEmailExist = users.some((u, i) => u.email === email && i !== index);
            if (isEmailExist) {
                alert('Email này đã được sử dụng bởi tài khoản khác!');
                $('#editCustomerEmail').addClass('is-invalid');
                isValid = false;
            } else {
                $('#editCustomerEmail').removeClass('is-invalid').addClass('is-valid');
            }
        }

        if (phone === "" || !regexSDT.test(phone)) {
            $('#editCustomerPhone').addClass('is-invalid');
            isValid = false;
        } else {
            $('#editCustomerPhone').removeClass('is-invalid').addClass('is-valid');
        }

        if (!isValid) {
            alert("Vui lòng kiểm tra lại thông tin nhập liệu!");
            return;
        }

        if (index !== -1) {
            users[index].email = email;
            users[index].fullName = name;
            users[index].phone = phone;
            users[index].status = status;
            users[index].address = address;

            saveData();
            
            const modalEl = document.getElementById('modalEditCustomer');
            const modal = bootstrap.Modal.getInstance(modalEl);
            if (modal) modal.hide();
            
            alert('Cập nhật thông tin thành công!');
        }
    });
};

const saveData = () => {
    localStorage.setItem('users', JSON.stringify(users));
    users = JSON.parse(localStorage.getItem('users')) || [];
    const keyword = $('#content-customers input[type="text"]').val().toLowerCase().trim();
    
    if (keyword) {
        const filtered = users.filter(user => 
            (user.fullName || '').toLowerCase().includes(keyword) ||
            (user.email || '').toLowerCase().includes(keyword) ||
            (user.phone || '').toLowerCase().includes(keyword)
        );
        renderUserTable(filtered);
    } else {
        renderUserTable(users);
    }
};