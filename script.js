// ---------- 8 ПРОСТЫХ И ИНТЕРЕСНЫХ ВОПРОСОВ С МГНОВЕННОЙ ОБРАТНОЙ СВЯЗЬЮ ----------
const QUESTIONS = [
    {   // 0 - обычный с вариантами
        type: "choice",
        text: "Что такое 'промпт' (prompt) в общении с нейросетью?",
        options: ["Запрос или инструкция, которую мы даём модели", "Скорость работы видеокарты", "Имя нейросети от OpenAI", "Ошибка в генерации текста"],
        correct: 0,
        explanation: "Промпт — это текстовая инструкция, которую пользователь даёт нейросети для получения нужного результата."
    },
    {   // 1 - перестановка слов с перемешиванием
        type: "reorder",
        text: "Собери правильный промпт для нейросети, чтобы она нарисовала КОТА В КОСМОСЕ. Кликай на слова в нужном порядке.",
        wordsBank: ["нарисуй", "милого", "кота", "в космосе", "в стиле ретро"],
        correctOrder: ["нарисуй", "милого", "кота", "в космосе", "в стиле ретро"],
        hint: "Порядок: действие → описание → объект → место → стиль",
        explanation: "Правильный порядок: нарисуй (действие) → милого (описание) → кота (объект) → в космосе (место) → в стиле ретро (стиль)"
    },
    {   // 2 - ошибка с галлюцинацией
        type: "error_case",
        text: "Был задан промт: 'Нарисуй человека с тремя руками'. Нейросеть нарисовала человека с шестью пальцами и головой кота. В чём проблема?",
        options: ["Галлюцинация — модель добавила лишние детали", "Не хватило контекста", "Слишком низкая температура", "Проблема с токенизацией"],
        correct: 0,
        explanation: "Это галлюцинация: модель неправильно интерпретировала запрос и добавила случайные элементы."
    },
    {   // 3 - написание промпта
        type: "write_prompt",
        text: "Ты хочешь, чтобы нейросеть написала стихотворение про робота, который влюбился в чайник. Напиши максимально конкретный промпт.",
        checkCriteria: (answer) => {
            let lower = answer.toLowerCase();
            return (lower.includes("робот") || lower.includes("робота")) && (lower.includes("чайник") || lower.includes("чайника")) && lower.includes("стих");
        },
        correctExample: "Напиши короткое стихотворение о роботе, который влюбился в электрический чайник.",
        explanation: "Хороший промпт должен содержать: тему (робот, чайник), жанр (стихотворение) и конкретные детали."
    },
    {   // 4 - про температуру
        type: "choice",
        text: "Параметр 'температура' (temperature) в нейросетях отвечает за...",
        options: ["Креативность и случайность ответов", "Громкость звука", "Скорость генерации картинок", "Количество пальцев на руках"],
        correct: 0,
        explanation: "Температура регулирует случайность: чем выше, тем более неожиданные и креативные ответы."
    },
    {   // 5 - few-shot
        type: "choice",
        text: "Что значит 'few-shot' промптинг?",
        options: ["Дать модели несколько примеров перед основным заданием", "Один точный запрос без примеров", "Запретить модели отвечать", "Сменить язык ответа"],
        correct: 0,
        explanation: "Few-shot — это когда ты показываешь модели 2-3 примера того, как должен выглядеть ответ, а потом даёшь основное задание."
    },
    {   // 6 - перестановка слов
        type: "reorder",
        text: "Собери промпт для объяснения сложной темы ребёнку.",
        wordsBank: ["объясни", "как работает", "искусственный интеллект", "простыми словами", "для ребенка 10 лет"],
        correctOrder: ["объясни", "как работает", "искусственный интеллект", "простыми словами", "для ребенка 10 лет"],
        explanation: "Важно указать аудиторию: 'для ребёнка' и уровень сложности 'простыми словами'."
    },
    {   // 7 - итоговый лёгкий
        type: "choice",
        text: "Что такое 'нейросеть' простыми словами?",
        options: ["Программа, которая учится на примерах и находит закономерности", "Сеть для ловли нейронов", "Новый вид социальной сети", "Бренд смартфона"],
        correct: 0,
        explanation: "Нейросеть — это математическая модель, которая обучается на данных и находит в них закономерности."
    }
];

// Состояние
let currentIndex = 0;
let userAnswers = new Array(QUESTIONS.length).fill(null);
let quizFinished = false;

const questionCardDiv = document.getElementById('questionCard');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const progressFill = document.getElementById('progressFill');
const questionCounterSpan = document.getElementById('questionCounter');
const resultContainer = document.getElementById('resultContainer');

function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function updateProgressAndCounter() {
    let answeredCount = 0;
    for (let i = 0; i < QUESTIONS.length; i++) {
        if (userAnswers[i] !== null && userAnswers[i] !== undefined && userAnswers[i] !== '') answeredCount++;
    }
    const percent = (answeredCount / QUESTIONS.length) * 100;
    progressFill.style.width = percent + '%';
    if (currentIndex < QUESTIONS.length) {
        questionCounterSpan.innerText = `ВОПРОС ${currentIndex + 1}/${QUESTIONS.length} | ОТВЕЧЕНО: ${answeredCount}`;
    } else {
        questionCounterSpan.innerText = `ФИНИШ | ОТВЕЧЕНО: ${answeredCount}`;
    }
}

// Сохранение ответов
function saveReorderAnswer(questionIdx, orderArray) {
    userAnswers[questionIdx] = { type: 'reorder', value: orderArray };
    updateProgressAndCounter();
    showInstantFeedback(questionIdx);
}

function saveWriteAnswer(questionIdx, text) {
    userAnswers[questionIdx] = { type: 'write', value: text };
    updateProgressAndCounter();
    showInstantFeedback(questionIdx);
}

function saveChoiceAnswer(questionIdx, choiceIdx) {
    userAnswers[questionIdx] = { type: 'choice', value: choiceIdx };
    updateProgressAndCounter();
    showInstantFeedback(questionIdx);
}

function saveErrorAnswer(questionIdx, choiceIdx) {
    userAnswers[questionIdx] = { type: 'error', value: choiceIdx };
    updateProgressAndCounter();
    showInstantFeedback(questionIdx);
}

// Мгновенная обратная связь
function showInstantFeedback(questionIdx) {
    const q = QUESTIONS[questionIdx];
    const answer = userAnswers[questionIdx];
    if (!answer) return;
    
    let isCorrect = false;
    let correctText = '';
    let userDisplay = '';
    let explanation = q.explanation || '';
    
    if (q.type === 'choice' || q.type === 'error_case') {
        let chosenIdx = answer.value;
        isCorrect = (chosenIdx !== undefined && chosenIdx === q.correct);
        userDisplay = q.options[chosenIdx];
        correctText = q.options[q.correct];
    } else if (q.type === 'reorder') {
        let orderArr = answer.value || [];
        let correctArr = q.correctOrder;
        isCorrect = (orderArr.length === correctArr.length && orderArr.every((v, idx) => v === correctArr[idx]));
        userDisplay = orderArr.join(' → ') || 'Не собран';
        correctText = correctArr.join(' → ');
    } else if (q.type === 'write_prompt') {
        let txt = answer.value || '';
        isCorrect = q.checkCriteria(txt);
        userDisplay = txt || 'Пусто';
        correctText = q.correctExample;
    }
    
    let feedbackDiv = document.getElementById('instantFeedback');
    if (!feedbackDiv) {
        feedbackDiv = document.createElement('div');
        feedbackDiv.id = 'instantFeedback';
        feedbackDiv.style.marginTop = '1rem';
        feedbackDiv.style.padding = '0.8rem';
        feedbackDiv.style.borderLeft = '6px solid';
        feedbackDiv.style.fontWeight = 'bold';
        questionCardDiv.appendChild(feedbackDiv);
    }
    
    if (isCorrect) {
        feedbackDiv.style.background = '#e6f4e6';
        feedbackDiv.style.borderLeftColor = '#2b5e2b';
        feedbackDiv.style.color = '#1e3a1e';
        feedbackDiv.innerHTML = `✅ <strong>ВЕРНО!</strong><br>📝 Пояснение: ${escapeHtml(explanation)}`;
    } else {
        feedbackDiv.style.background = '#ffe6e6';
        feedbackDiv.style.borderLeftColor = '#b13e3e';
        feedbackDiv.style.color = '#5e1e1e';
        feedbackDiv.innerHTML = `❌ <strong>НЕВЕРНО!</strong><br>📝 Ваш ответ: ${escapeHtml(userDisplay)}<br>✅ Правильный ответ: ${escapeHtml(correctText)}<br>💡 Пояснение: ${escapeHtml(explanation)}`;
    }
}

// Отрисовка вопроса (без удаления обратной связи)
function renderCurrentQuestion() {
    if (quizFinished) return;
    if (currentIndex >= QUESTIONS.length) {
        finishQuizAndShowResults();
        return;
    }
    
    const q = QUESTIONS[currentIndex];
    let html = `<div class="question-text">${escapeHtml(q.text)}</div>`;
    
    if (q.type === 'choice' || q.type === 'error_case') {
        let saved = userAnswers[currentIndex]?.value;
        let prefixes = ['A', 'B', 'C', 'D'];
        let optsHtml = '';
        q.options.forEach((opt, i) => {
            let isSelected = (saved === i);
            optsHtml += `<div class="option ${isSelected ? 'selected' : ''}" data-opt-index="${i}"><span class="option-prefix">${prefixes[i]}</span><span>${escapeHtml(opt)}</span></div>`;
        });
        html += `<div class="options-list" id="optionsList">${optsHtml}</div>`;
    }
    else if (q.type === 'reorder') {
        let saved = userAnswers[currentIndex]?.value || [];
        let shuffledBank = shuffleArray([...q.wordsBank]);
        let bankHtml = shuffledBank.map(word => `<div class="word-token" data-word="${word}">${escapeHtml(word)}</div>`).join('');
        let builtHtml = saved.map((word, i) => `<div class="placed-word" data-pos="${i}">${escapeHtml(word)}<span class="remove-word" data-word="${word}">✖</span></div>`).join('');
        html += `
            <div class="prompt-builder">
                <div class="word-bank" id="wordBank">${bankHtml}</div>
                <div><strong>Твой промпт (порядок):</strong></div>
                <div class="sentence-builder" id="sentenceBuilder">${builtHtml || 'Нажми на слова, чтобы собрать'}</div>
                <button id="resetReorderBtn" style="margin-top:10px;">СБРОСИТЬ ПОРЯДОК</button>
            </div>
        `;
    }
    else if (q.type === 'write_prompt') {
        let savedValue = userAnswers[currentIndex]?.value || '';
        html += `
            <div class="prompt-builder">
                <textarea id="promptUserInput" class="prompt-input" rows="3" placeholder="Напиши свой промпт...">${escapeHtml(savedValue)}</textarea>
                <button id="savePromptBtn" class="check-prompt-btn">СОХРАНИТЬ ПРОМПТ</button>
                <div class="example-area">💡 Пример хорошего промпта: ${escapeHtml(q.correctExample)}</div>
            </div>
        `;
    }
    
    questionCardDiv.innerHTML = html;
    
    // Навешиваем обработчики после вставки HTML
    if (q.type === 'choice' || q.type === 'error_case') {
        document.querySelectorAll('.option').forEach(el => {
            el.addEventListener('click', () => {
                let optIdx = parseInt(el.dataset.optIndex);
                if (q.type === 'choice') saveChoiceAnswer(currentIndex, optIdx);
                else saveErrorAnswer(currentIndex, optIdx);
                renderCurrentQuestion(); // перерисовываем для подсветки выбранного
            });
        });
    }
    else if (q.type === 'reorder') {
        const bankDiv = document.getElementById('wordBank');
        const addWord = (word) => {
            let newOrder = [...(userAnswers[currentIndex]?.value || []), word];
            saveReorderAnswer(currentIndex, newOrder);
            renderCurrentQuestion();
        };
        const removeWordAt = (wordToRemove) => {
            let newOrder = (userAnswers[currentIndex]?.value || []).filter(w => w !== wordToRemove);
            saveReorderAnswer(currentIndex, newOrder);
            renderCurrentQuestion();
        };
        if (bankDiv) {
            Array.from(bankDiv.querySelectorAll('.word-token')).forEach(token => {
                token.addEventListener('click', () => { addWord(token.dataset.word); });
            });
        }
        const builderDiv = document.getElementById('sentenceBuilder');
        if (builderDiv) {
            Array.from(builderDiv.querySelectorAll('.remove-word')).forEach(btn => {
                btn.addEventListener('click', (e) => { e.stopPropagation(); removeWordAt(btn.dataset.word); });
            });
        }
        const resetBtn = document.getElementById('resetReorderBtn');
        if (resetBtn) resetBtn.addEventListener('click', () => { 
            saveReorderAnswer(currentIndex, []); 
            renderCurrentQuestion(); 
        });
    }
    else if (q.type === 'write_prompt') {
        const saveBtn = document.getElementById('savePromptBtn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                let val = document.getElementById('promptUserInput').value.trim();
                saveWriteAnswer(currentIndex, val);
                renderCurrentQuestion();
            });
        }
    }
    
    updateProgressAndCounter();
    prevBtn.disabled = (currentIndex === 0);
    nextBtn.disabled = false;
}

function goPrev() { 
    if (!quizFinished && currentIndex > 0) {
        currentIndex--; 
        renderCurrentQuestion(); 
    }
}

function goNext() {
    if (quizFinished) return;
    if (currentIndex < QUESTIONS.length - 1) { 
        currentIndex++; 
        renderCurrentQuestion(); 
    } else if (currentIndex === QUESTIONS.length - 1) { 
        finishQuizAndShowResults(); 
    }
}

function finishQuizAndShowResults() {
    if (quizFinished) return;
    quizFinished = true;
    questionCardDiv.style.display = 'none';
    prevBtn.style.display = 'none';
    nextBtn.style.display = 'none';
    
    let score = 0;
    let details = [];
    for (let i = 0; i < QUESTIONS.length; i++) {
        const q = QUESTIONS[i];
        const answer = userAnswers[i];
        let isCorrect = false;
        let userDisplay = '';
        let correctAnswerText = '';
        
        if (q.type === 'choice' || q.type === 'error_case') {
            let chosenIdx = answer?.value;
            isCorrect = (chosenIdx !== undefined && chosenIdx === q.correct);
            userDisplay = (chosenIdx !== undefined) ? q.options[chosenIdx] : 'Нет ответа';
            correctAnswerText = q.options[q.correct];
            if (isCorrect) score++;
        } else if (q.type === 'reorder') {
            let orderArr = answer?.value || [];
            let correctArr = q.correctOrder;
            isCorrect = (orderArr.length === correctArr.length && orderArr.every((v, idx) => v === correctArr[idx]));
            userDisplay = orderArr.join(' → ') || 'Не собран';
            correctAnswerText = correctArr.join(' → ');
            if (isCorrect) score++;
        } else if (q.type === 'write_prompt') {
            let txt = answer?.value || '';
            isCorrect = q.checkCriteria(txt);
            userDisplay = txt || 'Пусто';
            correctAnswerText = q.correctExample;
            if (isCorrect) score++;
        }
        details.push({
            text: q.text,
            user: userDisplay,
            correct: isCorrect,
            correctAnswer: correctAnswerText,
            explanation: q.explanation || ''
        });
    }
    
    const percent = Math.round((score / QUESTIONS.length) * 100);
    let resultHtml = `<div class="result-area"><div class="score-block">ПРОМПТ-МАСТЕР: ${score}/${QUESTIONS.length} (${percent}%)</div><div style="max-height:300px; overflow:auto; background:#f3efdf; padding:1rem; border:2px solid #1e1b15;">`;
    details.forEach((d, i) => {
        resultHtml += `<div style="margin-bottom:1rem; border-bottom:1px solid #c7bb9b; padding-bottom:0.8rem;">
            <strong>${i + 1}. ${escapeHtml(d.text)}</strong><br>
            <span style="color:${d.correct ? '#2b5e2b' : '#b13e3e'}; font-weight:bold;">${d.correct ? '[+] ВЕРНО' : '[-] НЕВЕРНО'}</span><br>
            Ваш ответ: ${escapeHtml(d.user.substring(0, 100))}<br>
            Правильный ответ: ${escapeHtml(d.correctAnswer)}<br>
            Пояснение: ${escapeHtml(d.explanation)}
        </div>`;
    });
    resultHtml += `</div><div id="pdfDownloadZone"></div></div>`;
    resultContainer.innerHTML = resultHtml;
    resultContainer.style.display = 'block';
    
    const downloadLink = document.createElement('a');
    downloadLink.href = 'https://drive.google.com/uc?export=download&id=17kjgxvVVRkXygskbM0nWl0iIkfpF5OJg';
    downloadLink.download = 'Check-list.pdf';
    downloadLink.innerText = 'Получить чек-лист по промтингу';
    downloadLink.className = 'download-link';
    downloadLink.style.width = '100%';
    downloadLink.style.marginTop = '1rem';
    downloadLink.target = '_blank';
    document.getElementById('pdfDownloadZone').appendChild(downloadLink);
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function (m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

prevBtn.addEventListener('click', goPrev);
nextBtn.addEventListener('click', goNext);
renderCurrentQuestion();
