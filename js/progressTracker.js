// progressTracker.js - 进度追踪

// 加载学习进度
function loadProgress() {
    const savedProgress = localStorage.getItem('learningProgress');
    if (savedProgress) {
        return JSON.parse(savedProgress);
    }
    
    // 返回默认进度对象
    return {
        completedConcepts: {},
        recentConcepts: [],
        totalLearningTime: 0
    };
}

// 保存学习进度
function saveProgress(progress) {
    localStorage.setItem('learningProgress', JSON.stringify(progress));
}

// 跟踪概念学习
function trackConceptLearning(conceptName) {
    const progress = loadProgress();
    const timestamp = new Date().toISOString();
    
    // 添加到已完成概念（如果不存在）
    if (!progress.completedConcepts[conceptName]) {
        progress.completedConcepts[conceptName] = {
            firstLearned: timestamp,
            lastReviewed: timestamp,
            reviewCount: 1
        };
    } else {
        // 更新已存在的概念
        progress.completedConcepts[conceptName].lastReviewed = timestamp;
        progress.completedConcepts[conceptName].reviewCount += 1;
    }
    
    // 添加到最近学习的概念
    const recentEntry = {
        id: conceptName.toLowerCase().replace(/\s+/g, '-'),
        title: conceptName,
        timestamp: timestamp
    };
    
    // 移除已存在的相同概念（避免重复）
    progress.recentConcepts = progress.recentConcepts.filter(c => c.id !== recentEntry.id);
    
    // 添加到最近列表的开头
    progress.recentConcepts.unshift(recentEntry);
    
    // 限制最近列表长度
    if (progress.recentConcepts.length > 10) {
        progress.recentConcepts = progress.recentConcepts.slice(0, 10);
    }
    
    // 增加学习时间（假设每次学习10分钟）
    progress.totalLearningTime += 10;
    
    // 保存更新后的进度
    saveProgress(progress);
    
    // 更新UI
    updateProgressDisplay();
    loadRecentConcepts();
}

// 标记概念为已掌握
function markConceptMastered(conceptId) {
    const progress = loadProgress();
    
    if (progress.completedConcepts[conceptId]) {
        progress.completedConcepts[conceptId].mastered = true;
        progress.completedConcepts[conceptId].masteredAt = new Date().toISOString();
    }
    
    saveProgress(progress);
    updateProgressDisplay();
}
