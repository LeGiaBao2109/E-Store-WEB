export const initProduct = () => {
    const $productTableBody = $('#productTableBody');

    const renderProductTable = () => {
        const products = JSON.parse(localStorage.getItem('products')) || [];

        $productTableBody.empty();

        if (products.length === 0) {
            $productTableBody.append('<tr><td colspan="6" class="text-center p-4 text-muted">Chưa có sản phẩm nào trong hệ thống.</td></tr>');
            return;
        }

        products.forEach((product) => {
            const statusClass = product.status === 'inactive' ? 'bg-secondary-subtle text-secondary' : 'bg-success-subtle text-success';
            const statusText = product.status === 'inactive' ? 'Inactive' : 'Active';

            $productTableBody.append(`
                <tr>
                    <td>
                        <div class="d-flex align-items-center">
                            <img src="${product.image}" 
                                 class="rounded-3 me-3" 
                                 style="width: 45px; height: 45px; object-fit: cover;"
                                 onerror="this.src='https://via.placeholder.com/45'">
                            <div>
                                <h6 class="mb-0 fw-bold">${product.title}</h6>
                                <small class="text-muted">ID: ${product.id}</small>
                            </div>
                        </div>
                    </td>
                    <td class="text-center">${product.brand || 'No Brand'}</td>
                    <td class="text-center fw-bold text-danger">${product.price.toLocaleString('vi-VN')}đ</td>
                    <td class="text-center">
                        <span class="badge bg-light text-dark border">${product.stock} chiếc</span>
                    </td>
                    <td class="text-center">
                        <span class="badge ${statusClass}">${statusText}</span>
                    </td>
                    <td class="text-end">
                        <button class="btn btn-sm btn-light border-0" 
                                onclick="viewProductDetail('${product.id}')" 
                                data-bs-toggle="modal" 
                                data-bs-target="#modalProductDetail">
                            <i class="bi bi-pencil-square"></i> Sửa/Chi tiết
                        </button>
                    </td>
                </tr>
            `);
        });
    };

    renderProductTable();
};