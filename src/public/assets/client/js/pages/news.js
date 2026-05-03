export const initNews = () => {
    const allNews = JSON.parse(localStorage.getItem('news')) || [];
    const urlParams = new URLSearchParams(window.location.search);
    const categorySlug = urlParams.get('category');

    const renderFeaturedSection = () => {
        if (allNews.length === 0) return;

        const featured = allNews[allNews.length - 1];
        const sideNews = allNews.slice(-4, -1).reverse();

        const featuredHtml = `
            <div class="main-news-card shadow-sm">
                <a href="/news/detail/${featured.id}">
                    <img src="${featured.thumbnail}" alt="${featured.title}" style="width: 100%; height: 400px; object-fit: cover;">
                </a>
                <div class="main-news-content">
                    <span class="badge bg-danger mb-2">${featured.category}</span>
                    <h3 class="fw-bold text-white">${featured.title}</h3>
                    <div class="d-flex align-items-center gap-3 mt-2 small text-white-50">
                        <span><i class="bi bi-person-circle"></i> ${featured.author}</span>
                        <span><i class="bi bi-calendar3"></i> ${featured.date}</span>
                    </div>
                </div>
            </div>
        `;
        $('.col-lg-7').html(featuredHtml);

        let sideHtml = '';
        sideNews.forEach(item => {
            sideHtml += `
                <div class="side-news-item d-flex gap-3 align-items-start border-bottom pb-3">
                    <img src="${item.thumbnail}" alt="${item.title}" style="width: 120px; height: 80px; object-fit: cover; border-radius: 8px;">
                    <div>
                        <a href="/news/detail/${item.id}" class="text-decoration-none text-dark">
                            <h6 class="fw-bold mb-1 line-clamp-2">${item.title}</h6>
                        </a>
                        <div class="news-meta small text-muted">
                            <span class="me-2"><i class="bi bi-person"></i> ${item.author}</span>
                            <span><i class="bi bi-clock"></i> ${item.date}</span>
                        </div>
                    </div>
                </div>
            `;
        });
        $('.side-news-list').html(sideHtml);
    };

    const renderNewsList = (category = null) => {
        let filteredNews = allNews;
        let title = "Tin tức mới nhất";

        if (category) {
            const categoryMap = {
                'tin-cong-nghe': 'Tin công nghệ',
                'games': 'Games',
                'meo-vat': 'Mẹo vặt',
                'tren-tay': 'Trên tay'
            };
            const categoryName = categoryMap[category];
            filteredNews = allNews.filter(n => n.category === categoryName);
            title = categoryName;
            $('section h4').first().text(categoryName);
        }

        if (category) {
            $('.row').first().html('<div class="col-12"><div class="row" id="category-list"></div></div>');
            let html = '';
            filteredNews.reverse().forEach(item => {
                html += `
                    <div class="col-md-4 mb-4">
                        <div class="card h-100 border-0 shadow-sm">
                            <a href="/news/detail/${item.id}">
                                <img src="${item.thumbnail}" class="card-img-top" alt="${item.title}" style="height: 200px; object-fit: cover;">
                            </a>
                            <div class="card-body">
                                <span class="text-danger small fw-bold text-uppercase">${item.category}</span>
                                <a href="/news/detail/${item.id}" class="text-decoration-none text-dark">
                                    <h5 class="fw-bold mt-2 line-clamp-2">${item.title}</h5>
                                </a>
                                <p class="text-muted small line-clamp-2">${item.summary}</p>
                                <div class="small text-muted mt-2">
                                    <span>${item.author}</span> • <span>${item.date}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            });
            $('#category-list').html(html || '<p class="text-center w-100">Chưa có bài viết nào trong mục này.</p>');
        } else {
            renderFeaturedSection();
        }
    };

    const updateNavLinks = () => {
        const navLinks = {
            'TRANG CHỦ': '/news',
            'TIN CÔNG NGHỆ': '/news?category=tin-cong-nghe',
            'GAMES': '/news?category=games',
            'MẸO VẶT': '/news?category=meo-vat',
            'TRÊN TAY': '/news?category=tren-tay'
        };

        $('.nav-brands .nav-link').each(function() {
            const text = $(this).text().trim();
            if (navLinks[text]) {
                $(this).attr('href', navLinks[text]);
            }
        });
    };

    updateNavLinks();
    renderNewsList(categorySlug);
};