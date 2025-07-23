// 测试Claude AI助手是否正常工作
// 1. 在这个文件中输入注释，然后按Tab键看是否有代码建议
// 2. 或者选中代码后按Ctrl+K（Windows）或Cmd+K（Mac）来测试AI对话

// TODO: 写一个函数来计算两个数字的和
function addNumbers(a, b) {
    return a + b;
}

// TODO: 写一个函数来验证邮箱格式
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// 测试函数
console.log("2 + 3 =", addNumbers(2, 3));
console.log("test@example.com 是否有效:", validateEmail("test@example.com"));

export { addNumbers, validateEmail }; 