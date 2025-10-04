// Инициализация теста
document.addEventListener('DOMContentLoaded', function() {
    // Элементы DOM
    const questionElement = document.querySelector('.question');
    const answersElement = document.querySelector('.answers');
    const nextButton = document.querySelector('.next-btn');
    const restartButton = document.querySelector('.restart-btn');
    const quizContainer = document.querySelector('.quiz-container');
    const resultContainer = document.querySelector('.result-container');
    const resultDescription = document.querySelector('.result-description');
    const progressElement = document.querySelector('.progress');
    const questionCountElement = document.querySelector('.question-count');
    const currentQuestionElement = document.querySelector('.current');
    const totalQuestionsElement = document.querySelector('.total');

    // Переменные состояния
    let currentQuestionIndex = 0;
    let userAnswers = {};
    const totalQuestions = quiz.length;

    // Инициализация теста
    function initTest() {
        totalQuestionsElement.textContent = totalQuestions;
        showQuestion();
        updateProgress();
    }

    // Показать текущий вопрос
    function showQuestion() {
        const currentQuestion = quiz[currentQuestionIndex];
        
        // Обновляем номер вопроса
        currentQuestionElement.textContent = currentQuestionIndex + 1;
        
        // Показываем вопрос
        questionElement.textContent = currentQuestion.q;
        
        // Очищаем предыдущие ответы
        answersElement.innerHTML = '';
        
        // Создаем варианты ответов
        for (const [key, answerText] of Object.entries(currentQuestion.a)) {
            const answerItem = document.createElement('li');
            answerItem.className = 'answer-item';
            answerItem.innerHTML = `
                <span class="answer-text">${answerText}</span>
            `;
            
            // Обработчик выбора ответа
            answerItem.addEventListener('click', function() {
                selectAnswer(key, answerItem);
            });
            
            answersElement.appendChild(answerItem);
        }
        
        // Сбрасываем состояние кнопки "Далее"
        nextButton.disabled = true;
    }

    // Выбор ответа
    function selectAnswer(answerKey, answerElement) {
        // Снимаем выделение со всех ответов
        document.querySelectorAll('.answer-item').forEach(item => {
            item.classList.remove('selected');
        });
        
        // Выделяем выбранный ответ
        answerElement.classList.add('selected');
        
        // Сохраняем ответ пользователя
        userAnswers[currentQuestionIndex] = answerKey;
        
        // Активируем кнопку "Далее"
        nextButton.disabled = false;
    }

    // Обновление прогресс-бара
    function updateProgress() {
        const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
        progressElement.style.width = `${progress}%`;
    }

    // Обработчик кнопки "Далее"
    nextButton.addEventListener('click', function() {
        if (nextButton.disabled) return;
        
        // Переходим к следующему вопросу или показываем результат
        if (currentQuestionIndex < totalQuestions - 1) {
            currentQuestionIndex++;
            showQuestion();
            updateProgress();
        } else {
            showResult();
        }
    });

    // Показать результат
    function showResult() {
        // Подсчитываем результаты
        const resultCounts = {};
        
        // Инициализируем все направления нулями
        const allDirections = ['s', 'e', 'cul', 'med', 'ev'];
        allDirections.forEach(direction => {
            resultCounts[direction] = 0;
        });
        
        // Считаем голоса
        for (const answerKey of Object.values(userAnswers)) {
            if (resultCounts[answerKey] !== undefined) {
                resultCounts[answerKey]++;
            }
        }
        
        // Находим максимальное количество баллов
        const maxCount = Math.max(...Object.values(resultCounts));
        
        // Находим все направления с максимальным количеством баллов
        const topResults = Object.entries(resultCounts)
            .filter(([_, count]) => count === maxCount)
            .map(([direction]) => direction);
        
        // Формируем HTML для отображения результатов
        let resultsHTML = '';
        
        if (topResults.length === 1) {
            // Если только один результат
            const result = answers[topResults[0]];
            resultsHTML = `
                <div class="single-result">
                    <div class="result-emoji">🎯</div>
                    <div class="result-text">${result.description}</div>
                </div>
            `;
        } else {
            // Если несколько результатов с одинаковым количеством баллов
            resultsHTML = `
                <div class="multiple-results">
                    <div class="results-header">
                        <div class="result-emoji">🎊</div>
                        <h3>У вас несколько подходящих направлений! 🚀</h3>
                        <p>Каждое из этих направлений набрало одинаковое количество баллов:</p>
                    </div>
                    <div class="results-list">
                        ${topResults.map(direction => {
                            const result = answers[direction];
                            return `
                                <div class="result-item">
                                    <div class="result-item-content">
                                        ${result.description}
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                    <div class="results-footer">
                        <p>Выберите то, что вам больше по душе! 💫</p>
                    </div>
                </div>
            `;
        }
        
        // Показываем статистику (опционально)
        const statsHTML = `
            <div class="results-stats">
                <h4>Статистика ваших ответов:</h4>
                <div class="stats-bars">
                    ${Object.entries(resultCounts)
                        .sort(([,a], [,b]) => b - a)
                        .map(([direction, count]) => {
                            const percentage = (count / totalQuestions * 100).toFixed(0);
                            const resultName = getDirectionName(direction);
                            return `
                                <div class="stat-item">
                                    <div class="stat-info">
                                        <span class="stat-name">${resultName}</span>
                                        <span class="stat-count">${count} баллов (${percentage}%)</span>
                                    </div>
                                    <div class="stat-bar">
                                        <div class="stat-bar-fill" style="width: ${percentage}%"></div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                </div>
            </div>
        `;
        
        // Объединяем результаты и статистику
        resultDescription.innerHTML = resultsHTML + statsHTML;
        
        // Переключаемся на экран результатов
        quizContainer.classList.add('hidden');
        resultContainer.classList.remove('hidden');
    }

    // Функция для получения названия направления
    function getDirectionName(direction) {
        const names = {
            's': '🤝 Социальное волонтерство',
            'e': '🌱 Экологическое волонтерство', 
            'cul': '🎨 Культурное волонтерство',
            'med': '⚕️ Медицинское волонтерство',
            'ev': '🎪 Событийное волонтерство'
        };
        return names[direction] || direction;
    }

    // Обработчик кнопки перезапуска
    restartButton.addEventListener('click', function() {
        // Сбрасываем состояние
        currentQuestionIndex = 0;
        userAnswers = {};
        
        // Переключаемся на экран теста
        resultContainer.classList.add('hidden');
        quizContainer.classList.remove('hidden');
        
        // Запускаем тест заново
        initTest();
    });

    // Запускаем тест
    initTest();
});