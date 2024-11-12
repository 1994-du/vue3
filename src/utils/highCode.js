const keywords = ["if", "const", "let", "var", "return", "function"];

function highlightCode(code) {
    // 转义注释
    code = code.replace(/(\/\/.*)/g, '<span class="comment">$1</span>');

    // 先转义变量名（假设变量名是关键字后的第一个单词）
    code = code.replace(/\b(const|let|var|function)\s+([a-zA-Z_$][\w$]*)/g, (match, p1, p2) => {
        return `<span class="keyword">${p1}</span> <span class="variable">${p2}</span>`;
    });

    // 再转义关键字
    keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'g');
        code = code.replace(regex, `<span class="keyword">${keyword}</span>`);
    });

    return code;
}
function highCode(){
    const codeElement = document.getElementsByTagName("pre");
    Array.from(codeElement).forEach(element => {
        element.innerHTML = highlightCode(element.innerText);
    })
}

export default highCode;
