// pathGenerator.js - 学习路径生成器

// 生成学习路径
async function generateLearningPath(topic, level, apiKey) {
    const prompt = `
        作为计算机底层知识专家，请为一位${level}水平的学习者创建一个关于"${topic}"的学习路径。
        
        请提供：
        1. 5-7个核心概念，按学习顺序排列
        2. 每个概念的简短描述（2-3句话）
        3. 每个概念的推荐学习资源（优先中文资源）
        4. 学习每个概念的预计时间
        
        格式要求：
        - 使用Markdown格式
        - 为每个概念创建二级标题
        - 在每个概念下使用列表项标明描述、资源和时间
    `;
    
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "你是一位专精计算机底层知识的教育专家。" },
                    { role: "user", content: prompt }
                ]
            })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || '请求失败');
        }
        
        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('生成学习路径失败:', error);
        throw error;
    }
}
