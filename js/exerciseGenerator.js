// exerciseGenerator.js - 练习题生成器

// 生成练习题
async function generateExercises(concept, userLevel, apiKey) {
    const prompt = `
        请为学习"${concept}"的${userLevel}级别学习者创建3个练习题。
        
        请创建以下类型的练习：
        1. 一道多选概念题，测试对核心原理的理解
        2. 一道代码分析题，包含一段与${concept}相关的代码，要求分析其工作原理或找出问题
        3. 一道开放式设计题，要求应用${concept}的原理解决一个实际问题
        
        对于每道题，请提供：
        - 题目描述
        - 选项（如适用）
        - 正确答案
        - 详细解释（包括为什么其他选项不正确）
        
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
        console.error('生成练习题失败:', error);
        throw error;
    }
}
