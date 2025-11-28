const storage = {
    // User progress data structure
    initializeUserProgress() {
        const defaultProgress = {
            subjects: {
                anatomy: { attempted: 0, correct: 0, accuracy: 0 },
                physiology: { attempted: 0, correct: 0, accuracy: 0 },
                biochemistry: { attempted: 0, correct: 0, accuracy: 0 }
            },
            topics: {},
            weakAreas: [],
            quizHistory: [],
            totalQuizzes: 0,
            totalQuestionsAttempted: 0,
            overallAccuracy: 0,
            lastActive: new Date().toISOString()
        };
        
        localStorage.setItem('medExamProgress', JSON.stringify(defaultProgress));
        return defaultProgress;
    },

    // Get user progress
    getUserProgress() {
        const progress = localStorage.getItem('medExamProgress');
        return progress ? JSON.parse(progress) : null;
    },

    // Save user progress
    saveUserProgress(progress) {
        localStorage.setItem('medExamProgress', JSON.stringify(progress));
    },

    // Update progress after quiz
    updateProgress(quizResults) {
        let progress = this.getUserProgress();
        if (!progress) {
            progress = this.initializeUserProgress();
        }

        // Update subject statistics
        quizResults.topics.forEach(topic => {
            const subject = this.getSubjectFromTopic(topic);
            if (!progress.subjects[subject]) {
                progress.subjects[subject] = { attempted: 0, correct: 0, accuracy: 0 };
            }
            
            progress.subjects[subject].attempted += quizResults.totalQuestions;
            progress.subjects[subject].correct += quizResults.correctAnswers;
            progress.subjects[subject].accuracy = Math.round(
                (progress.subjects[subject].correct / progress.subjects[subject].attempted) * 100
            );
        });

        // Update topic statistics
        const topicPerformance = {};
        quizResults.questions.forEach((question, index) => {
            const topic = question.topic;
            if (!topicPerformance[topic]) {
                topicPerformance[topic] = { attempted: 0, correct: 0 };
            }
            
            topicPerformance[topic].attempted++;
            if (quizResults.userAnswers[index] === question.correctAnswer) {
                topicPerformance[topic].correct++;
            }
        });

        Object.entries(topicPerformance).forEach(([topic, stats]) => {
            if (!progress.topics[topic]) {
                progress.topics[topic] = { attempted: 0, correct: 0, accuracy: 0 };
            }
            
            progress.topics[topic].attempted += stats.attempted;
            progress.topics[topic].correct += stats.correct;
            progress.topics[topic].accuracy = Math.round(
                (progress.topics[topic].correct / progress.topics[topic].attempted) * 100
            );
        });

        // Update weak areas
        this.updateWeakAreas(progress);

        // Update overall statistics
        progress.totalQuizzes++;
        progress.totalQuestionsAttempted += quizResults.totalQuestions;
        progress.overallAccuracy = Math.round(
            (Object.values(progress.subjects).reduce((sum, subject) => sum + subject.correct, 0) /
             Object.values(progress.subjects).reduce((sum, subject) => sum + subject.attempted, 0)) * 100
        );
        progress.lastActive = new Date().toISOString();

        // Add to quiz history
        progress.quizHistory.push({
            timestamp: quizResults.timestamp,
            score: quizResults.score,
            correctAnswers: quizResults.correctAnswers,
            totalQuestions: quizResults.totalQuestions,
            topics: quizResults.topics,
            timeSpent: quizResults.timeSpent
        });

        // Keep only last 50 quiz records
        if (progress.quizHistory.length > 50) {
            progress.quizHistory = progress.quizHistory.slice(-50);
        }

        this.saveUserProgress(progress);
        return progress;
    },

    // Update weak areas based on performance
    updateWeakAreas(progress) {
        const weakAreas = [];
        
        Object.entries(progress.topics).forEach(([topic, stats]) => {
            if (stats.attempted >= 5) { // Only consider topics with sufficient attempts
                let priority = 'low';
                if (stats.accuracy < 50) priority = 'high';
                else if (stats.accuracy < 70) priority = 'medium';
                
                if (priority !== 'low') {
                    weakAreas.push({
                        topic: topic,
                        accuracy: stats.accuracy,
                        priority: priority
                    });
                }
            }
        });

        // Sort by accuracy (lowest first) and priority
        progress.weakAreas = weakAreas.sort((a, b) => {
            if (a.priority === b.priority) {
                return a.accuracy - b.accuracy;
            }
            const priorityOrder = { high: 0, medium: 1, low: 2 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        }).slice(0, 10); // Keep top 10 weak areas
    },

    // Get subject from topic ID
    getSubjectFromTopic(topicId) {
        if (topicId.includes('anatomy') || topicId.includes('embryology') || topicId.includes('histology')) {
            return 'anatomy';
        } else if (topicId.includes('physiology')) {
            return 'physiology';
        } else {
            return 'biochemistry';
        }
    },

    // Quiz configuration storage
    saveQuizConfig(config) {
        localStorage.setItem('medExamQuizConfig', JSON.stringify(config));
    },

    getQuizConfig() {
        const config = localStorage.getItem('medExamQuizConfig');
        return config ? JSON.parse(config) : null;
    },

    // Quiz results storage
    saveQuizResults(results) {
        localStorage.setItem('medExamQuizResults', JSON.stringify(results));
    },

    getQuizResults() {
        const results = localStorage.getItem('medExamQuizResults');
        return results ? JSON.parse(results) : null;
    },

    // Quiz history
    getQuizHistory() {
        const progress = this.getUserProgress();
        return progress ? progress.quizHistory : [];
    },

    // Clear all progress data
    clearUserProgress() {
        localStorage.removeItem('medExamProgress');
        localStorage.removeItem('medExamQuizConfig');
        localStorage.removeItem('medExamQuizResults');
        this.initializeUserProgress();
    }
};