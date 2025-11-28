class QuizSession {
    constructor(config) {
        this.config = config;
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.startTime = null;
        this.topicStats = {};
    }

    async initialize() {
        this.startTime = new Date();
        
        // Load questions based on selected topics
        this.questions = await app.loadQuestionsFromTopics(this.config.topics);
        
        // Shuffle questions and take the requested number
        this.questions = app.shuffleArray(this.questions).slice(0, this.config.questionCount);
        
        // Initialize user answers array
        this.userAnswers = new Array(this.questions.length).fill(undefined);
        
        // Initialize topic statistics
        this.initializeTopicStats();
        
        console.log(`Quiz initialized with ${this.questions.length} questions`);
    }

    initializeTopicStats() {
        this.questions.forEach(question => {
            if (!this.topicStats[question.topic]) {
                this.topicStats[question.topic] = {
                    correct: 0,
                    incorrect: 0,
                    total: 0
                };
            }
            this.topicStats[question.topic].total++;
        });
    }

    getQuestion(index) {
        return this.questions[index];
    }

    getTotalQuestions() {
        return this.questions.length;
    }

    recordAnswer(questionIndex, answerIndex) {
        this.userAnswers[questionIndex] = answerIndex;
        
        const question = this.getQuestion(questionIndex);
        const isCorrect = answerIndex === question.correctAnswer;
        
        if (isCorrect) {
            this.recordCorrectAnswer(question.topic);
        } else {
            this.recordIncorrectAnswer(question.topic);
        }
        
        return isCorrect;
    }

    recordCorrectAnswer(topic) {
        if (this.topicStats[topic]) {
            this.topicStats[topic].correct++;
        }
    }

    recordIncorrectAnswer(topic) {
        if (this.topicStats[topic]) {
            this.topicStats[topic].incorrect++;
        }
    }

    getCurrentQuestion() {
        return this.getQuestion(this.currentQuestionIndex);
    }

    nextQuestion() {
        if (this.currentQuestionIndex < this.questions.length - 1) {
            this.currentQuestionIndex++;
            return true;
        }
        return false;
    }

    previousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            return true;
        }
        return false;
    }

    getProgress() {
        const answered = this.userAnswers.filter(answer => answer !== undefined).length;
        return {
            current: this.currentQuestionIndex + 1,
            total: this.questions.length,
            answered: answered,
            percentage: Math.round((answered / this.questions.length) * 100)
        };
    }

    getScore() {
        const correctAnswers = this.userAnswers.filter((answer, index) => {
            return answer === this.questions[index].correctAnswer;
        }).length;
        
        return {
            correct: correctAnswers,
            total: this.questions.length,
            percentage: Math.round((correctAnswers / this.questions.length) * 100)
        };
    }

    getTopics() {
        return [...new Set(this.questions.map(q => q.topic))];
    }

    getTopicPerformance() {
        return this.topicStats;
    }

    getTimeElapsed() {
        return Math.floor((new Date() - this.startTime) / 1000);
    }

    // Calculate results for storage
    calculateResults() {
        const score = this.getScore();
        const timeSpent = this.getTimeElapsed();
        
        return {
            score: score.percentage,
            correctAnswers: score.correct,
            totalQuestions: score.total,
            topics: this.getTopics(),
            timestamp: new Date().toISOString(),
            timeSpent: timeSpent,
            userAnswers: [...this.userAnswers],
            questions: this.questions.map(q => ({
                id: q.id,
                question: q.question,
                options: q.options,
                correctAnswer: q.correctAnswer,
                explanation: q.explanation,
                topic: q.topic,
                difficulty: q.difficulty
            })),
            topicPerformance: this.topicStats
        };
    }

    // Update user progress in storage
    updateUserProgress(results) {
        storage.updateProgress(results);
    }

    // Check if all questions are answered
    isComplete() {
        return this.userAnswers.every(answer => answer !== undefined);
    }

    // Get unanswered questions
    getUnansweredQuestions() {
        return this.userAnswers
            .map((answer, index) => answer === undefined ? index + 1 : null)
            .filter(index => index !== null);
    }
}