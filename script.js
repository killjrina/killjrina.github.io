// ---------- ВОПРОСЫ (15 штук, адаптированные) ----------
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
        hint: "Порядок: глагол → прилагательное → объект → место → стиль",
        explanation: "Правильный порядок: нарисуй (действие) → милого (описание) → кота (объект) → в космосе (место) → в стиле ретро (стиль)"
    },
    {   // 2 - промт + неправильный результат (ошибка)
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
    {   // 4 - обычный про temperature
        type: "choice",
        text: "Параметр 'температура' (temperature) в нейросетях отвечает за...",
        options: ["Креативность и случайность ответов", "Громкость звука", "Скорость генерации картинок", "Количество пальцев на руках"],
        correct: 0,
        explanation: "Температура регулирует случайность: чем выше, тем более неожиданные и креативные ответы."
    },
    {   // 5 - ошибка с фактами
        type: "error_case",
        text: "Промт: 'Объясни теорию струн'. Ответ нейросети: 'Смешай муку, томатный соус и сыр, запекай 20 минут'. Что случилось?",
        options: ["Галлюцинация — модель выдала рецепт вместо физики", "Переобучение на кулинарных данных", "Слишком высокая температура", "Не хватило токенов"],
        correct: 0,
        explanation: "Модель 'галлюцинировала' — сгенерировала правдоподобный, но неверный ответ, не связанный с запросом."
    },
    {   // 6 - перестановка слов с перемешиванием
        type: "reorder",
        text: "Составь промпт для генерации видео: 'робот танцует брейк-данс на Марсе'",
        wordsBank: ["сгенерируй", "видео", "робот", "танцует", "брейк-данс", "на Марсе"],
        correctOrder: ["сгенерируй", "видео", "робот", "танцует", "брейк-данс", "на Марсе"],
        explanation: "Логичный порядок: действие → тип контента → субъект → действие субъекта → стиль → место"
    },
    {   // 7 - выбор про промпт-инжиниринг
        type: "choice",
        text: "Что значит 'few-shot' промптинг?",
        options: ["Дать модели несколько примеров перед основным заданием", "Один точный запрос без примеров", "Запретить модели отвечать", "Сменить язык ответа"],
        correct: 0,
        explanation: "Few-shot — это когда ты показываешь модели 2-3 примера того, как должен выглядеть ответ, а потом даёшь основное задание."
    },
    {   // 8 - написание промпта
        type: "write_prompt",
        text: "Придумай промпт для нейросети, чтобы она сгенерировала историю про 'робота-учителя и двоечника'. Используй ключевые слова: 'история', 'робот-учитель', 'двоечник'.",
        checkCriteria: (ans) => {
            let low = ans.toLowerCase();
            return low.includes("история") && low.includes("робот-учитель") && low.includes("двоечник");
        },
        correctExample: "Напиши короткую историю про робота-учителя, который пытается помочь двоечнику сдать экзамен.",
        explanation: "Чем конкретнее промпт, тем лучше результат: указывай жанр, персонажей и контекст."
    },
    {   // 9 - ошибка с контекстом
        type: "error_case",
        text: "Промт: 'Кот в сапогах'. Нейросеть нарисовала кота, у которого сапоги надеты на уши. В чём проблема?",
        options: ["Модель неправильно поняла предлог 'в'", "Слишком низкая температура", "Не хватило примера (few-shot)", "Переобучение на мемах"],
        correct: 0,
        explanation: "Модель буквально поняла 'в сапогах' как 'внутри обуви', а не как 'одетый в сапоги'. Нужен более точный промпт."
    },
    {   // 10 - про уточнение промпта
        type: "choice",
        text: "Если нейросеть дала странный ответ, лучшая стратегия:",
        options: ["Переформулировать промпт, добавить детали/примеры", "Выключить компьютер", "Повторить тот же запрос 10 раз", "Сменить шрифт"],
        correct: 0,
        explanation: "Всегда уточняй промпт: добавляй примеры, детали, уточняй формат ответа."
    },
    {   // 11 - перестановка слов
        type: "reorder",
        text: "Собери промпт для объяснения сложной темы ребёнку.",
        wordsBank: ["объясни", "как работает", "искусственный интеллект", "простыми словами", "для ребенка 10 лет"],
        correctOrder: ["объясни", "как работает", "искусственный интеллект", "простыми словами", "для ребенка 10 лет"],
        explanation: "Важно указать аудиторию: 'для ребёнка' и уровень сложности 'простыми словами'."
    },
    {   // 12 - ошибка с фактами
        type: "error_case",
        text: "Промт: 'Кто написал \"Войну и мир\"?' Ответ: 'Марк Цукерберг'. Что это за ошибка?",
        options: ["Галлюцинация — выдумка фактов", "Правильный ответ", "Сбой базы данных", "Слишком высокая температура"],
        correct: 0,
        explanation: "Модель может выдумывать факты, если не уверена в ответе. Всегда проверяйте информацию!"
    },
    {   // 13 - написание промпта
        type: "write_prompt",
        text: "Придумай промпт для ИИ, который поможет придумать сценарий для видео про школу будущего. Используй слово 'робот-учитель'.",
        checkCriteria: (ans) => ans.toLowerCase().includes("робот-учитель") && ans.length > 10,
        correctExample: "Придумай сценарий для короткого видео: школа будущего, где робот-учитель ведёт урок физики.",
        explanation: "Указывай жанр (сценарий), контекст (школа будущего) и ключевых персонажей."
    },
    {   // 14 - лёгкий финал
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

function saveReorderAnswer(questionIdx, orderArray) {
    userAnswers[questionIdx] = { type: 'reorder', value: orderArray };
    updateProgressAndCounter();
}

function saveWriteAnswer(questionIdx, text) {
    userAnswers[questionIdx] = { type: 'write', value: text };
    updateProgressAndCounter();
}

function saveChoiceAnswer(questionIdx, choiceIdx) {
    userAnswers[questionIdx] = { type: 'choice', value: choiceIdx };
    updateProgressAndCounter();
}

function saveErrorAnswer(questionIdx, choiceIdx) {
    userAnswers[questionIdx] = { type: 'error', value: choiceIdx };
    updateProgressAndCounter();
}

function renderCurrentQuestion() {
    if (quizFinished) return;
    if (currentIndex >= QUESTIONS.length) {
        finishQuizAndShowResults();
        return;
    }
    const q = QUESTIONS[currentIndex];
    if (q.type === 'choice') renderChoiceQuestion(q, currentIndex);
    else if (q.type === 'reorder') renderReorderQuestion(q, currentIndex);
    else if (q.type === 'error_case') renderErrorQuestion(q, currentIndex);
    else if (q.type === 'write_prompt') renderWritePromptQuestion(q, currentIndex);
    updateProgressAndCounter();
    prevBtn.disabled = (currentIndex === 0);
}

function renderChoiceQuestion(q, idx) {
    let saved = userAnswers[idx]?.value;
    let optsHtml = '';
    let prefixes = ['A', 'B', 'C', 'D'];
    q.options.forEach((opt, i) => {
        let isSelected = (saved === i);
        optsHtml += `<div class="option ${isSelected ? 'selected' : ''}" data-opt-index="${i}"><span class="option-prefix">${prefixes[i]}</span><span>${escapeHtml(opt)}</span></div>`;
    });
    questionCardDiv.innerHTML = `<div class="question-text">${escapeHtml(q.text)}</div><div class="options-list" id="optionsList">${optsHtml}</div>`;
    document.querySelectorAll('.option').forEach(el => {
        el.addEventListener('click', () => {
            let optIdx = parseInt(el.dataset.optIndex);
            saveChoiceAnswer(idx, optIdx);
            renderCurrentQuestion();
        });
    });
}

function renderErrorQuestion(q, idx) {
    let saved = userAnswers[idx]?.value;
    let optsHtml = '';
    let prefixes = ['A', 'B', 'C', 'D'];
    q.options.forEach((opt, i) => {
        let isSelected = (saved === i);
        optsHtml += `<div class="option ${isSelected ? 'selected' : ''}" data-opt-index="${i}"><span class="option-prefix">${prefixes[i]}</span><span>${escapeHtml(opt)}</span></div>`;
    });
    questionCardDiv.innerHTML = `<div class="question-text">${escapeHtml(q.text)}</div><div class="options-list" id="optionsList">${optsHtml}</div>`;
    document.querySelectorAll('.option').forEach(el => {
        el.addEventListener('click', () => {
            let optIdx = parseInt(el.dataset.optIndex);
            saveErrorAnswer(idx, optIdx);
            renderCurrentQuestion();
        });
    });
}

function renderReorderQuestion(q, idx) {
    let saved = userAnswers[idx]?.value || [];
    let shuffledBank = shuffleArray([...q.wordsBank]);
    let bankHtml = shuffledBank.map(word => `<div class="word-token" data-word="${word}">${escapeHtml(word)}</div>`).join('');
    let builtHtml = saved.map((word, i) => `<div class="placed-word" data-pos="${i}">${escapeHtml(word)}<span class="remove-word" data-word="${word}">✖</span></div>`).join('');
    questionCardDiv.innerHTML = `
        <div class="question-text">${escapeHtml(q.text)}</div>
        <div class="prompt-builder"><div class="word-bank" id="wordBank">${bankHtml}</div>
        <div><strong>Твой промпт (порядок):</strong></div><div class="sentence-builder" id="sentenceBuilder">${builtHtml || 'Нажми на слова, чтобы собрать'}</div>
        <button id="resetReorderBtn" style="margin-top:10px;">СБРОСИТЬ ПОРЯДОК</button></div>
    `;
    const bankDiv = document.getElementById('wordBank');
    const addWord = (word) => {
        let newOrder = [...saved, word];
        saveReorderAnswer(idx, newOrder);
        renderCurrentQuestion();
    };
    const removeWordAt = (wordToRemove) => {
        let newOrder = saved.filter(w => w !== wordToRemove);
        saveReorderAnswer(idx, newOrder);
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
    if (resetBtn) resetBtn.addEventListener('click', () => { saveReorderAnswer(idx, []); renderCurrentQuestion(); });
}

function renderWritePromptQuestion(q, idx) {
    let savedValue = userAnswers[idx]?.value || '';
    questionCardDiv.innerHTML = `
        <div class="question-text">${escapeHtml(q.text)}</div>
        <div class="prompt-builder"><textarea id="promptUserInput" class="prompt-input" rows="3" placeholder="Напиши свой промпт...">${escapeHtml(savedValue)}</textarea>
        <button id="savePromptBtn" class="check-prompt-btn">СОХРАНИТЬ ПРОМПТ</button>
        <div class="example-area">💡 Пример хорошего промпта: ${escapeHtml(q.correctExample)}</div></div>
    `;
    const textarea = document.getElementById('promptUserInput');
    const saveBtn = document.getElementById('savePromptBtn');
    saveBtn.addEventListener('click', () => {
        let val = textarea.value.trim();
        saveWriteAnswer(idx, val);
        renderCurrentQuestion();
    });
}

function goPrev() { if (!quizFinished && currentIndex > 0) { currentIndex--; renderCurrentQuestion(); animateCard(); } }

function goNext() {
    if (quizFinished) return;
    if (currentIndex < QUESTIONS.length - 1) { currentIndex++; renderCurrentQuestion(); animateCard(); }
    else if (currentIndex === QUESTIONS.length - 1) { currentIndex++; finishQuizAndShowResults(); }
}

function animateCard() {
    questionCardDiv.style.opacity = '0.7';
    questionCardDiv.style.transform = 'translateX(5px)';
    setTimeout(() => {
        if (questionCardDiv) {
            questionCardDiv.style.opacity = '1';
            questionCardDiv.style.transform = 'translateX(0)';
        }
    }, 100);
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
    generatePdfReport(score, QUESTIONS.length, percent, details);
}

function generatePdfReport(correct, total, percent, details) {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    script.onload = () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ unit: 'mm', format: 'a4' });
        doc.setFont("courier");
        doc.setFontSize(16);
        doc.text("Check-list.pdf", 20, 20);
        doc.setFontSize(12);
        doc.text(`Результат квиза: ${correct} / ${total} (${percent}%)`, 20, 35);
        let y = 50;
        for (let i = 0; i < details.length; i++) {
            let status = details[i].correct ? "+" : "-";
            let shortQ = details[i].text.length > 55 ? details[i].text.slice(0, 52) + "..." : details[i].text;
            doc.text(`${status} ${i + 1}. ${shortQ}`, 20, y);
            y += 6;
            let userTxt = (details[i].user.length > 65) ? details[i].user.slice(0, 62) + "..." : details[i].user;
            doc.text(`   Ваш ответ: ${userTxt}`, 22, y);
            y += 5;
            let correctTxt = (details[i].correctAnswer.length > 65) ? details[i].correctAnswer.slice(0, 62) + "..." : details[i].correctAnswer;
            doc.text(`   Правильно: ${correctTxt}`, 22, y);
            y += 7;
            if (y > 270) { doc.addPage(); y = 20; }
        }
        const blob = doc.output('blob');
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Check-list.pdf';
        a.className = 'download-link';
        a.innerText = 'Скачать чек-лист по промтингу';
        document.getElementById('pdfDownloadZone').appendChild(a);
        URL.revokeObjectURL(url);
    };
    document.head.appendChild(script);
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
