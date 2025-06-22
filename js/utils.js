// utils.js - 工具函数

// 格式化日期
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// 获取分类名称
function getCategoryName(category) {
    const categories = {
        'os': '操作系统',
        'architecture': '计算机体系结构',
        'compiler': '编译原理',
        'networking': '计算机网络',
        'hardware': '硬件基础'
    };
    
    return categories[category] || category;
}

// 获取难度标签
function getDifficultyLabel(difficulty) {
    const labels = {
        'foundational': '基础',
        'intermediate': '中级',
        'advanced': '高级'
    };
    
    return labels[difficulty] || difficulty;
}

// 获取难度颜色
function getDifficultyColor(difficulty) {
    const colors = {
        'foundational': 'green',
        'intermediate': 'blue',
        'advanced': 'red'
    };
    
    return colors[difficulty] || 'default';
}
