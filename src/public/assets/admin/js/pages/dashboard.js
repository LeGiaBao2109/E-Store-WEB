export const initDashboardCharts = () => {
    const $dateFrom = $('#globalDateFrom');
    const $dateTo = $('#globalDateTo');
    const $btnFilter = $('#btnGlobalFilter');
    let myChart = null;

    const parseOrderDate = (dateStr) => {
        const [time, datePart] = dateStr.split(' ');
        const [day, month, year] = datePart.split('/');
        return new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${time}`);
    };

    const processDashboard = () => {
        const allOrders = JSON.parse(localStorage.getItem('order_history')) || [];
        const products = JSON.parse(localStorage.getItem('products')) || [];

        const fromDateVal = $dateFrom.val();
        const toDateVal = $dateTo.val();

        if (new Date(fromDateVal) > new Date(toDateVal)) {
            alert("Ngày bắt đầu không thể lớn hơn ngày kết thúc. Vui lòng chọn lại!");
            setDefaultDates();
            return;
        }

        const start = new Date(fromDateVal);
        start.setHours(0, 0, 0, 0);
        const end = new Date(toDateVal);
        end.setHours(23, 59, 59, 999);

        const filteredOrders = allOrders.filter(order => {
            const orderDate = parseOrderDate(order.date);
            return orderDate >= start && orderDate <= end;
        });

        const totalRevenue = filteredOrders.reduce((sum, o) => sum + o.totalAmount, 0);
        const totalStock = products.reduce((sum, p) => sum + p.stock, 0);

        $('#stat-revenue').text(totalRevenue.toLocaleString('vi-VN') + ' VND');
        $('#stat-stock').text(totalStock.toLocaleString());
        $('#stat-orders').text(filteredOrders.length);

        $('#chartRangeLabel').text(`Từ ${start.toLocaleDateString('vi-VN')} đến ${end.toLocaleDateString('vi-VN')}`);

        renderChart(filteredOrders);
    };

    const renderChart = (data) => {
        const ctx = document.getElementById('revenueChart').getContext('2d');
        if (myChart) myChart.destroy();

        const dailyData = {};
        data.forEach(o => {
            const dayLabel = o.date.split(' ')[1];
            dailyData[dayLabel] = (dailyData[dayLabel] || 0) + o.totalAmount;
        });

        const labels = Object.keys(dailyData);
        const values = Object.values(dailyData);

        myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels.length > 0 ? labels : ['Không có dữ liệu'],
                datasets: [{
                    label: 'Doanh thu',
                    data: values.length > 0 ? values : [0],
                    borderColor: '#dc3545',
                    backgroundColor: 'rgba(220, 53, 69, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 5,
                    pointBackgroundColor: '#dc3545'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { 
                        beginAtZero: true,
                        ticks: { callback: (value) => value.toLocaleString() + ' đ' }
                    }
                },
                plugins: { legend: { display: false } }
            }
        });
    };

    const setDefaultDates = () => {
        const today = new Date();
        const lastWeek = new Date();
        lastWeek.setDate(today.getDate() - 7);

        $dateTo.val(today.toISOString().split('T')[0]);
        $dateFrom.val(lastWeek.toISOString().split('T')[0]);
    };

    $btnFilter.on('click', (e) => {
        e.preventDefault();
        processDashboard();
    });

    setDefaultDates();
    processDashboard();
};