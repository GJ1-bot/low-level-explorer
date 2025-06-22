// conceptExplainer.js - 概念解释生成器

// 生成概念解释
async function generateConceptExplanation(concept, userLevel, apiKey) {
    const prompt = `
        请以${userLevel}级别的学习者能理解的方式，解释以下计算机底层概念：
        ${concept}
        
        请提供：
        1. 通俗易懂的解释（使用恰当的类比）
        2. 为什么这个概念重要
        3. 它与其他概念的关系
        4. 一个实际应用的例子
        5. 如果可能，提供一个简单的代码示例来展示这个概念
        
        使用Markdown格式回答。
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
        console.error('生成概念解释失败:', error);
        throw error;
    }
}
