
// 示例数据 - 在实际应用中，这些数据应从PHP后端获取
const sampleBooks = [
    {
        id: 1,
        title: "时间简史",
        author: "史蒂芬·霍金",
        description: "探索宇宙奥秘的经典之作，带你了解宇宙的起源、发展和未来。本书以通俗易懂的方式解释了复杂的物理概念，适合所有对宇宙好奇的读者。",
        cover: "cosmos.jpg",
        status: "available"
    },
    {
        id: 2,
        title: "百年孤独",
        author: "加西亚·马尔克斯",
        description: "魔幻现实主义文学代表作，讲述了布恩迪亚家族七代人的传奇故事。小说融合了神话传说、民间故事和宗教典故，展现了一个瑰丽神奇的想象世界。",
        cover: "solitude.jpg",
        status: "available"
    },
    {
        id: 3,
        title: "三体",
        author: "刘慈欣",
        description: "中国科幻文学的里程碑作品，讲述了地球文明与三体文明之间的碰撞和交流。小说以宏大的视角探讨了人类文明的未来和宇宙文明的多样性。",
        cover: "three-body.jpg",
        status: "borrowed"
    },
    {
        id: 4,
        title: "人类简史",
        author: "尤瓦尔·赫拉利",
        description: "从动物到上帝的演化历程，梳理了人类发展的关键节点。本书以全新的视角解读人类历史，探讨了人类如何成为地球的主宰以及未来的发展方向。",
        cover: "sapiens.jpg",
        status: "available"
    },
    {
        id: 5,
        title: "活着",
        author: "余华",
        description: "一个普通人的苦难与坚韧，讲述了中国农民福贵在动荡年代中经历的种种磨难。小说以朴实的语言展现了生命的顽强和人性的光辉。",
        cover: "alive.jpg",
        status: "available"
    },
    {
        id: 6,
        title: "1984",
        author: "乔治·奥威尔",
        description: "反乌托邦文学的经典之作，描绘了一个被极权主义统治的未来世界。小说对权力、自由和真理进行了深刻的思考，具有强烈的警示意义。",
        cover: "1984.jpg",
        status: "borrowed"
    }
];

const sampleBorrows = [
    {
        id: 1,
        book_id: 3,
        title: "三体",
        borrow_date: "2023-05-15",
        due_date: "2023-06-15",
        return_date: null
    },
    {
        id: 2,
        book_id: 6,
        title: "1984",
        borrow_date: "2023-05-20",
        due_date: "2023-06-20",
        return_date: null
    },
    {
        id: 3,
        book_id: 2,
        title: "百年孤独",
        borrow_date: "2023-04-10",
        due_date: "2023-05-10",
        return_date: "2023-05-05"
    },
    {
        id: 4,
        book_id: 1,
        title: "时间简史",
        borrow_date: "2023-03-22",
        due_date: "2023-04-22",
        return_date: "2023-04-20"
    }
];

// 当前用户状态
let currentUser = null;

// DOM 加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化页面
    renderBooks();
    updateBorrowHistory();
    setupEventListeners();
    
    // 检查本地存储中是否有用户信息
    const savedUser = localStorage.getItem('libraryUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUserUI();
    }
});

// 渲染书籍列表
function renderBooks() {
    const container = document.getElementById('books-container');
    container.innerHTML = '';
    
    sampleBooks.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.className = 'col-lg-4 col-md-6';
        bookCard.innerHTML = `
            <div class="book-card position-relative">
                <span class="status-badge badge ${book.status === 'available' ? 'bg-success' : 'bg-secondary'}">
                    ${book.status === 'available' ? '可借阅' : '已借出'}
                </span>
                <img src="https://via.placeholder.com/300x400/3498db/ffffff?text=Book+Cover" class="book-cover w-100" alt="${book.title}">
                <div class="book-info">
                    <h5 class="mb-1">${book.title}</h5>
                    <p class="text-muted mb-2">${book.author}</p>
                    <p class="text-truncate small mb-3">${book.description}</p>
                    <div class="d-flex justify-content-between">
                        <button class="btn btn-sm btn-outline-primary view-detail" data-id="${book.id}">
                            <i class="fas fa-info-circle me-1"></i> 详情
                        </button>
                        <button class="btn btn-sm btn-borrow ${book.status !== 'available' ? 'disabled' : ''}" data-id="${book.id}" 
                            ${book.status !== 'available' ? 'disabled' : ''}>
                            <i class="fas fa-bookmark me-1"></i> 借阅
                        </button>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(bookCard);
    });
}

// 更新借阅历史
function updateBorrowHistory() {
    // 当前借阅
    const currentBorrows = sampleBorrows.filter(record => !record.return_date);
    const currentContainer = document.getElementById('current-borrows');
    currentContainer.innerHTML = '';
    
    currentBorrows.forEach(record => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${record.title}</td>
            <td>${record.borrow_date}</td>
            <td>${record.due_date}</td>
            <td>
                <button class="btn btn-sm btn-outline-success return-book" data-id="${record.id}">
                    <i class="fas fa-undo me-1"></i> 归还
                </button>
            </td>
        `;
        currentContainer.appendChild(row);
    });
    
    document.getElementById('current-count').textContent = currentBorrows.length;
    
    // 历史记录
    const historyRecords = sampleBorrows.filter(record => record.return_date);
    const historyContainer = document.getElementById('borrow-history');
    historyContainer.innerHTML = '';
    
    historyRecords.forEach(record => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${record.title}</td>
            <td>${record.borrow_date}</td>
            <td>${record.return_date}</td>
            <td><span class="badge bg-success">已归还</span></td>
        `;
        historyContainer.appendChild(row);
    });
    
    document.getElementById('history-count').textContent = historyRecords.length;
}

// 设置事件监听器
function setupEventListeners() {
    // 导航切换
    document.querySelectorAll('.nav-link[data-page]').forEach(link => {
        link.addEventListener('click', function() {
            const page = this.getAttribute('data-page');
            showPage(page);
        });
    });
    
    // 登录按钮
    document.getElementById('login-btn').addEventListener('click', function() {
        showAuthForm('login');
    });
    
    // 退出按钮
    document.getElementById('logout-btn').addEventListener('click', logout);
    
    // 登录/注册切换
    document.getElementById('show-register').addEventListener('click', function(e) {
        e.preventDefault();
        showAuthForm('register');
    });
    
    document.getElementById('show-login').addEventListener('click', function(e) {
        e.preventDefault();
        showAuthForm('login');
    });
    
    // 登录提交
    document.getElementById('login-submit').addEventListener('click', function() {
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        
        if (username && password) {
            // 模拟登录成功
            currentUser = {
                id: 1,
                username: username,
                email: 'user@example.com'
            };
            
            // 保存到本地存储
            localStorage.setItem('libraryUser', JSON.stringify(currentUser));
            
            // 更新UI
            updateUserUI();
            
            // 关闭模态框
            const modal = bootstrap.Modal.getInstance(document.getElementById('authModal'));
            modal.hide();
            
            // 显示通知
            showNotification('登录成功！欢迎回来');
        } else {
            showNotification('请输入用户名和密码', 'error');
        }
    });
    
    // 注册提交
    document.getElementById('register-submit').addEventListener('click', function() {
        const username = document.getElementById('register-username').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirm = document.getElementById('register-confirm').value;
        
        if (password !== confirm) {
            showNotification('两次输入的密码不一致', 'error');
            return;
        }
        
        if (username && email && password) {
            // 模拟注册成功
            currentUser = {
                id: 2,
                username: username,
                email: email
            };
            
            // 保存到本地存储
            localStorage.setItem('libraryUser', JSON.stringify(currentUser));
            
            // 更新UI
            updateUserUI();
            
            // 关闭模态框
            const modal = bootstrap.Modal.getInstance(document.getElementById('authModal'));
            modal.hide();
            
            // 显示通知
            showNotification('注册成功！欢迎加入图书借阅系统');
        } else {
            showNotification('请填写所有必填字段', 'error');
        }
    });
    
    // 书籍详情按钮
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('view-detail')) {
            const bookId = e.target.getAttribute('data-id');
            showBookDetail(bookId);
        }
        
        if (e.target.classList.contains('borrow-book-btn')) {
            const bookId = document.getElementById('bookDetailModal').getAttribute('data-book-id');
            borrowBook(bookId);
        }
        
        if (e.target.classList.contains('return-book')) {
            const recordId = e.target.getAttribute('data-id');
            returnBook(recordId);
        }
    });
}

// 显示指定页面
function showPage(page) {
    if (page === 'home') {
        document.getElementById('home-page').classList.remove('d-none');
        document.getElementById('profile-page').classList.add('d-none');
        document.querySelector('.nav-link[data-page="home"]').classList.add('active');
        document.querySelector('.nav-link[data-page="profile"]').classList.remove('active');
    } else if (page === 'profile') {
        // 需要登录
        if (!currentUser) {
            showAuthForm('login');
            showNotification('请先登录以访问个人中心');
            return;
        }
        
        document.getElementById('home-page').classList.add('d-none');
        document.getElementById('profile-page').classList.remove('d-none');
        document.querySelector('.nav-link[data-page="home"]').classList.remove('active');
        document.querySelector('.nav-link[data-page="profile"]').classList.add('active');
        
        // 更新个人中心信息
        document.getElementById('profile-username').textContent = currentUser.username;
        document.getElementById('profile-email').textContent = currentUser.email;
    }
}

// 显示登录/注册表单
function showAuthForm(formType) {
    const modal = new bootstrap.Modal(document.getElementById('authModal'));
    
    if (formType === 'login') {
        document.getElementById('authModalTitle').textContent = '用户登录';
        document.getElementById('login-form').classList.remove('d-none');
        document.getElementById('register-form').classList.add('d-none');
    } else {
        document.getElementById('authModalTitle').textContent = '用户注册';
        document.getElementById('login-form').classList.add('d-none');
        document.getElementById('register-form').classList.remove('d-none');
    }
    
    modal.show();
}

// 更新用户界面状态
function updateUserUI() {
    if (currentUser) {
        document.getElementById('user-greeting').classList.remove('d-none');
        document.getElementById('username-display').textContent = currentUser.username;
        document.getElementById('logout-btn').classList.remove('d-none');
        document.getElementById('login-btn').classList.add('d-none');
    } else {
        document.getElementById('user-greeting').classList.add('d-none');
        document.getElementById('logout-btn').classList.add('d-none');
        document.getElementById('login-btn').classList.remove('d-none');
    }
}

// 退出登录
function logout() {
    currentUser = null;
    localStorage.removeItem('libraryUser');
    updateUserUI();
    showNotification('您已成功退出系统');
    
    // 如果当前在个人中心页面，则跳转回首页
    if (!document.getElementById('profile-page').classList.contains('d-none')) {
        showPage('home');
    }
}

// 显示书籍详情
function showBookDetail(bookId) {
    const book = sampleBooks.find(b => b.id == bookId);
    if (!book) return;
    
    document.getElementById('bookDetailTitle').textContent = book.title;
    document.getElementById('book-detail-title').textContent = book.title;
    document.getElementById('book-detail-author').textContent = `作者: ${book.author}`;
    document.getElementById('book-detail-status').textContent = book.status === 'available' ? '可借阅' : '已借出';
    document.getElementById('book-detail-status').className = `badge ${book.status === 'available' ? 'bg-success' : 'bg-secondary'}`;
    document.getElementById('book-detail-description').textContent = book.description;
    document.getElementById('bookDetailModal').setAttribute('data-book-id', bookId);
    
    // 更新借阅按钮状态
    const borrowBtn = document.getElementById('borrow-book-btn');
    borrowBtn.disabled = book.status !== 'available';
    borrowBtn.className = book.status === 'available' ? 'btn btn-primary me-2' : 'btn btn-secondary me-2 disabled';
    
    const modal = new bootstrap.Modal(document.getElementById('bookDetailModal'));
    modal.show();
}

// 借阅书籍
function borrowBook(bookId) {
    if (!currentUser) {
        showAuthForm('login');
        showNotification('请先登录以借阅书籍');
        return;
    }
    
    const book = sampleBooks.find(b => b.id == bookId);
    if (!book) return;
    
    if (book.status !== 'available') {
        showNotification('该书已被借出，暂时无法借阅', 'error');
        return;
    }
    
    // 模拟借阅操作
    book.status = 'borrowed';
    
    // 添加借阅记录
    const today = new Date();
    const dueDate = new Date();
    dueDate.setDate(today.getDate() + 30); // 30天后归还
    
    sampleBorrows.unshift({
        id: sampleBorrows.length + 1,
        book_id: book.id,
        title: book.title,
        borrow_date: formatDate(today),
        due_date: formatDate(dueDate),
        return_date: null
    });
    
    // 更新UI
    renderBooks();
    updateBorrowHistory();
    
    // 关闭模态框
    const modal = bootstrap.Modal.getInstance(document.getElementById('bookDetailModal'));
    modal.hide();
    
    showNotification(`成功借阅《${book.title}》，请于30日内归还`);
}

// 归还书籍
function returnBook(recordId) {
    const record = sampleBorrows.find(r => r.id == recordId);
    if (!record) return;
    
    // 更新归还日期
    record.return_date = formatDate(new Date());
    
    // 更新书籍状态
    const book = sampleBooks.find(b => b.id == record.book_id);
    if (book) {
        book.status = 'available';
    }
    
    // 更新UI
    renderBooks();
    updateBorrowHistory();
    
    showNotification(`已归还《${record.title}》，感谢您的使用`);
}

// 显示通知
function showNotification(message, type = 'success') {
    const notification = document.querySelector('.notification');
    const messageEl = document.getElementById('notification-message');
    
    messageEl.textContent = message;
    
    // 更新样式
    const alert = notification.querySelector('.alert');
    alert.className = `alert alert-${type} alert-dismissible fade show`;
    
    notification.style.display = 'block';
    
    // 5秒后自动隐藏
    setTimeout(() => {
        notification.style.display = 'none';
    }, 5000);
}

// 辅助函数：格式化日期为YYYY-MM-DD
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
// 在 setupEventListeners 函数中添加搜索事件监听
function setupEventListeners() {
    // ... 其他现有代码 ...
    
    // 搜索框事件监听
    async function searchBooks(keyword) {
        if (!keyword.trim()) {
            renderBooks(); // 如果搜索关键词为空，显示所有书籍
            return;
        }
        
        try {
            const response = await fetch(`search_books.php?keyword=${encodeURIComponent(keyword)}`);
            const data = await response.json();
            
            if (data.success) {
                renderFilteredBooks(data.books);
            } else {
                showNotification(data.message || '搜索失败', 'error');
            }
        } catch (error) {
            console.error('搜索错误:', error);
            showNotification('搜索过程中发生错误', 'error');
        }
    }
}

// 添加搜索书籍函数
function searchBooks(keyword) {
    if (!keyword.trim()) {
        renderBooks(); // 如果搜索关键词为空，显示所有书籍
        return;
    }
    
    // 在实际应用中，这里应该发送请求到后端API
    // 这里使用前端过滤作为示例
    const filteredBooks = sampleBooks.filter(book => 
        book.title.includes(keyword) || 
        book.author.includes(keyword) ||
        book.description.includes(keyword)
    );
    
    renderFilteredBooks(filteredBooks);
}

// 渲染过滤后的书籍
function renderFilteredBooks(books) {
    const container = document.getElementById('books-container');
    container.innerHTML = '';
    
    if (books.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-book-open fa-3x text-muted mb-3"></i>
                <h4 class="text-muted">没有找到匹配的书籍</h4>
                <p>请尝试其他关键词</p>
            </div>
        `;
        return;
    }
    
    books.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.className = 'col-lg-4 col-md-6';
        bookCard.innerHTML = `
            <div class="book-card position-relative">
                <span class="status-badge badge ${book.status === 'available' ? 'bg-success' : 'bg-secondary'}">
                    ${book.status === 'available' ? '可借阅' : '已借出'}
                </span>
                <img src="https://via.placeholder.com/300x400/3498db/ffffff?text=Book+Cover" class="book-cover w-100" alt="${book.title}">
                <div class="book-info">
                    <h5 class="mb-1">${book.title}</h5>
                    <p class="text-muted mb-2">${book.author}</p>
                    <p class="text-truncate small mb-3">${book.description}</p>
                    <div class="d-flex justify-content-between">
                        <button class="btn btn-sm btn-outline-primary view-detail" data-id="${book.id}">
                            <i class="fas fa-info-circle me-1"></i> 详情
                        </button>
                        <button class="btn btn-sm btn-borrow ${book.status !== 'available' ? 'disabled' : ''}" data-id="${book.id}" 
                            ${book.status !== 'available' ? 'disabled' : ''}>
                            <i class="fas fa-bookmark me-1"></i> 借阅
                        </button>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(bookCard);
    });
}