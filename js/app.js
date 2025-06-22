// app.js - 主应用逻辑

// 全局状态
const state = {
    apiKey: localStorage.getItem('apiKey') || '',
    currentPage: 'dashboard',
    userProfile: {
        learningGoal: localStorage.getItem('learningGoal') || '',
        knowledgeLevel: localStorage.getItem('knowledgeLevel') || 'beginner',
    },
    learningPath: null,
    conceptExplanation: null,
    exercises: null,
    progress: loadProgress()
};

// 初始化应用
function initApp() {
    // 检查API密钥
    if (!state.apiKey) {
        showApiKeyModal();
    }
    
    // 设置页面导航
    setupNavigation();
    
    // 设置事件监听器
    setupEventListeners();
    
    // 加载仪表板数据
    loadDashboardData();
}

// 设置页面导航
function setupNavigation() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetPage = e.target.getAttribute('data-page');
            navigateToPage(targetPage);
        });
    });
}

// 页面导航
function navigateToPage(pageName) {
    // 更新当前页面
    state.currentPage = pageName;
    
    // 更新导航链接状态
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('data-page') === pageName) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // 显示对应页面内容
    document.querySelectorAll('.page-content').forEach(page => {
        if (page.id === `${pageName}-page`) {
            page.classList.add('active');
        } else {
            page.classList.remove('active');
        }
    });
}

// 设置事件监听器
function setupEventListeners() {
    // API密钥保存
    document.getElementById('save-api-key').addEventListener('click', saveApiKey);
    
    // 学习目标更新
    document.getElementById('update-goal-btn').addEventListener('click', updateLearningGoal);
    
    // 学习路径生成
    document.getElementById('generate-path-btn').addEventListener('click', handleGeneratePath);
    
    // 概念解释
    document.getElementById('explain-concept-btn').addEventListener('click', handleExplainConcept);
    
    // 练习题生成
    document.getElementById('generate-exercises-btn').addEventListener('click', handleGenerateExercises);
}

// 加载仪表板数据
function loadDashboardData() {
    // 填充用户资料
    document.getElementById('learning-goal').value = state.userProfile.learningGoal;
    document.getElementById('knowledge-level').value = state.userProfile.knowledgeLevel;
    
    // 更新进度显示
    updateProgressDisplay();
    
    // 加载推荐概念
    loadRecommendedConcepts();
    
    // 加载最近学习的概念
    loadRecentConcepts();
}

// 更新进度显示
function updateProgressDisplay() {
    const progress = state.progress;
    const completedCount = Object.keys(progress.completedConcepts).length;
    const totalCount = 20; // 假设总概念数
    
    // 更新进度条
    const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
    document.getElementById('progress-bar').style.width = `${progressPercent}%`;
    document.getElementById('progress-bar').textContent = `${Math.round(progressPercent)}%`;
    
    // 更新统计数字
    document.getElementById('completed-concepts').textContent = completedCount;
    document.getElementById('total-concepts').textContent = totalCount;
    document.getElementById('learning-time').textContent = (progress.totalLearningTime / 60).toFixed(1);
}

// 加载推荐概念
function loadRecommendedConcepts() {
    // 这里应该基于用户进度和兴趣推荐概念
    // 简化版本中，我们使用静态推荐
    const recommendedConcepts = [
        { id: 'virtual-memory', title: '虚拟内存', category: 'os' },
        { id: 'cache-coherence', title: '缓存一致性', category: 'architecture' },
        { id: 'pipelining', title: '指令流水线', category: 'architecture' }
    ];
    
    const recommendedList = document.getElementById('recommended-concepts');
    recommendedList.innerHTML = '';
    
    recommendedConcepts.forEach(concept => {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
        listItem.innerHTML = `
            <div>
                <strong>${concept.title}</strong>
                <span class="badge bg-primary ms-2">${getCategoryName(concept.category)}</span>
            </div>
            <button class="btn btn-sm btn-outline-primary explore-concept-btn" data-concept="${concept.id}">
                探索
            </button>
        `;
        recommendedList.appendChild(listItem);
    });
    
    // 添加探索按钮事件
    document.querySelectorAll('.explore-concept-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const conceptId = e.target.getAttribute('data-concept');
            navigateToPage('concept-explorer');
            document.getElementById('concept-search').value = conceptId;
            handleExplainConcept();
        });
    });
}

// 加载最近学习的概念
function loadRecentConcepts() {
    const progress = state.progress;
    const recentConcepts = progress.recentConcepts.slice(0, 3);
    
    const recentList = document.getElementById('recent-concepts');
    recentList.innerHTML = '';
    
    if (recentConcepts.length === 0) {
        recentList.innerHTML = '<li class="list-group-item">暂无学习记录</li>';
        return;
    }
    
    recentConcepts.forEach(concept => {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item';
        listItem.innerHTML = `
            <div>
                <strong>${concept.title}</strong>
                <small class="d-block text-muted">
                    学习于 ${formatDate(concept.timestamp)}
                </small>
            </div>
        `;
        recentList.appendChild(listItem);
    });
}

// 保存API密钥
function saveApiKey() {
    const apiKey = document.getElementById('api-key-input').value.trim();
    if (apiKey) {
        state.apiKey = apiKey;
        localStorage.setItem('apiKey', apiKey);
        
        // 关闭模态框
        const modal = bootstrap.Modal.getInstance(document.getElementById('api-key-modal'));
        modal.hide();
    }
}

// 显示API密钥模态框
function showApiKeyModal() {
    const modal = new bootstrap.Modal(document.getElementById('api-key-modal'));
    modal.show();
}

// 更新学习目标
function updateLearningGoal() {
    const learningGoal = document.getElementById('learning-goal').value.trim();
    const knowledgeLevel = document.getElementById('knowledge-level').value;
    
    state.userProfile.learningGoal = learningGoal;
    state.userProfile.knowledgeLevel = knowledgeLevel;
    
    localStorage.setItem('learningGoal', learningGoal);
    localStorage.setItem('knowledgeLevel', knowledgeLevel);
    
    // 显示成功消息
    alert('学习目标已更新！');
}

// 处理生成学习路径
async function handleGeneratePath() {
    const topic = document.getElementById('path-topic').value.trim();
    if (!topic) {
        alert('请输入学习主题');
        return;
    }
    
    if (!state.apiKey) {
        showApiKeyModal();
        return;
    }
    
    try {
        // 显示加载状态
        document.getElementById('generate-path-btn').disabled = true;
        document.getElementById('generate-path-btn').textContent = '生成中...';
        
        // 生成学习路径
        const path = await generateLearningPath(
            topic, 
            state.userProfile.knowledgeLevel,
            state.apiKey
        );
        
        // 更新状态
        state.learningPath = path;
        
        // 显示学习路径
        displayLearningPath(path);
    } catch (error) {
        console.error('生成学习路径失败:', error);
        alert('生成学习路径失败: ' + error.message);
    } finally {
        // 恢复按钮状态
        document.getElementById('generate-path-btn').disabled = false;
        document.getElementById('generate-path-btn').textContent = '生成学习路径';
    }
}

// 显示学习路径
function displayLearningPath(path) {
    const container = document.getElementById('learning-path-container');
    const content = document.getElementById('path-content');
    
    // 显示容器
    container.classList.remove('d-none');
    
    // 渲染Markdown内容
    content.innerHTML = marked.parse(path);
    
    // 高亮代码
    Prism.highlightAll();
}

// 处理解释概念
async function handleExplainConcept() {
    const concept = document.getElementById('concept-search').value.trim();
    if (!concept) {
        alert('请输入要探索的概念');
        return;
    }
    
    if (!state.apiKey) {
        showApiKeyModal();
        return;
    }
    
    try {
        // 显示加载状态
        document.getElementById('explain-concept-btn').disabled = true;
        document.getElementById('explain-concept-btn').textContent = '解释中...';
        
        // 生成概念解释
        const explanation = await generateConceptExplanation(
            concept, 
            state.userProfile.knowledgeLevel,
            state.apiKey
        );
        
        // 更新状态
        state.conceptExplanation = explanation;
        
        // 显示概念解释
        displayConceptExplanation(concept, explanation);
        
        // 记录学习进度
        trackConceptLearning(concept);
    } catch (error) {
        console.error('解释概念失败:', error);
        alert('解释概念失败: ' + error.message);
    } finally {
        // 恢复按钮状态
        document.getElementById('explain-concept-btn').disabled = false;
        document.getElementById('explain-concept-btn').textContent = '解释概念';
    }
}

// 显示概念解释
function displayConceptExplanation(concept, explanation) {
    const container = document.getElementById('concept-explanation-container');
    const content = document.getElementById('concept-content');
    
    // 显示容器
    container.classList.remove('d-none');
    
    // 渲染Markdown内容
    content.innerHTML = `<h3>${concept}</h3>` + marked.parse(explanation);
    
    // 高亮代码
    Prism.highlightAll();
}

// 处理生成练习题
async function handleGenerateExercises() {
    const concept = document.getElementById('exercise-concept').value.trim();
    if (!concept) {
        alert('请输入要练习的概念');
        return;
    }
    
    if (!state.apiKey) {
        showApiKeyModal();
        return;
    }
    
    try {
        // 显示加载状态
        document.getElementById('generate-exercises-btn').disabled = true;
        document.getElementById('generate-exercises-btn').textContent = '生成中...';
        
        // 生成练习题
        const exercises = await generateExercises(
            concept, 
            state.userProfile.knowledgeLevel,
            state.apiKey
        );
        
        // 更新状态
        state.exercises = exercises;
        
        // 显示练习题
        displayExercises(exercises);
    } catch (error) {
        console.error('生成练习题失败:', error);
        alert('生成练习题失败: ' + error.message);
    } finally {
        // 恢复按钮状态
        document.getElementById('generate-exercises-btn').disabled = false;
        document.getElementById('generate-exercises-btn').textContent = '生成练习题';
    }
}

// 显示练习题
function displayExercises(exercises) {
    const container = document.getElementById('exercises-container');
    const content = document.getElementById('exercises-content');
    
    // 显示容器
    container.classList.remove('d-none');
    
    // 渲染Markdown内容
    content.innerHTML = marked.parse(exercises);
    
    // 高亮代码
    Prism.highlightAll();
}

// 初始化应用
document.addEventListener('DOMContentLoaded', initApp);
