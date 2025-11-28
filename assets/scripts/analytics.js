const analytics = {
    // Track user performance and generate insights
    trackQuestionPerformance(questionId, isCorrect, timeSpent, difficulty) {
        const performance = storage.getQuestionPerformance() || {};
        
        if (!performance[questionId]) {
            performance[questionId] = {
                attempts: 0,
                correct: 0,
                totalTime: 0,
                averageTime: 0
            };
        }
        
        performance[questionId].attempts++;
        performance[questionId].totalTime += timeSpent;
        performance[questionId].averageTime = performance[questionId].totalTime / performance[questionId].attempts;
        
        if (isCorrect) {
            performance[questionId].correct++;
        }
        
        performance[questionId].accuracy = (performance[questionId].correct / performance[questionId].attempts) * 100;
        
        storage.saveQuestionPerformance(performance);
        this.updateWeakAreas();
    },
    
    // Identify weak areas based on performance
    updateWeakAreas() {
        const progress = storage.getUserProgress();
        const weakAreas = [];
        
        // Analyze topic performance
        Object.entries(progress.topics || {}).forEach(([topic, stats]) => {
            if (stats.attempted >= 5) { // Minimum attempts for meaningful data
                const accuracy = stats.accuracy || 0;
                let priority = 'low';
                
                if (accuracy < 50) priority = 'high';
                else if (accuracy < 70) priority = 'medium';
                
                if (priority !== 'low') {
                    weakAreas.push({
                        topic: topic,
                        accuracy: Math.round(accuracy),
                        priority: priority,
                        lastPracticed: stats.lastActive
                    });
                }
            }
        });
        
        // Sort by priority and accuracy
        weakAreas.sort((a, b) => {
            const priorityOrder = { high: 0, medium: 1, low: 2 };
            if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            }
            return a.accuracy - b.accuracy;
        });
        
        progress.weakAreas = weakAreas.slice(0, 10); // Keep top 10 weak areas
        storage.saveUserProgress(progress);
    },
    
    // Generate study recommendations
    getStudyRecommendations() {
        const progress = storage.getUserProgress();
        const recommendations = [];
        
        // High priority weak areas
        const highPriority = progress.weakAreas.filter(area => area.priority === 'high');
        if (highPriority.length > 0) {
            recommendations.push({
                type: 'high_priority',
                message: `Focus on ${highPriority.map(a => this.formatTopicName(a.topic)).join(', ')}`,
                topics: highPriority.map(a => a.topic)
            });
        }
        
        // Least practiced topics
        const allTopics = this.getAllTopics();
        const practicedTopics = new Set(Object.keys(progress.topics || {}));
        const unpracticed = allTopics.filter(topic => !practicedTopics.has(topic));
        
        if (unpracticed.length > 0) {
            recommendations.push({
                type: 'unpracticed',
                message: `Try these new topics: ${unpracticed.slice(0, 3).map(this.formatTopicName).join(', ')}`,
                topics: unpracticed.slice(0, 3)
            });
        }
        
        // Review old topics
        const oldTopics = this.getTopicsForReview();
        if (oldTopics.length > 0) {
            recommendations.push({
                type: 'review',
                message: `Review ${oldTopics.slice(0, 3).map(this.formatTopicName).join(', ')}`,
                topics: oldTopics.slice(0, 3)
            });
        }
        
        return recommendations;
    },
    
    // Get all available topics
    getAllTopics() {
        const subjects = app.getSubjects();
        const allTopics = [];
        
        subjects.forEach(subject => {
            subject.groups.forEach(group => {
                group.topics.forEach(topic => {
                    allTopics.push(topic.id);
                });
            });
        });
        
        return allTopics;
    },
    
    // Get topics that need review (not practiced recently)
    getTopicsForReview() {
        const progress = storage.getUserProgress();
        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        
        return Object.entries(progress.topics || {})
            .filter(([topic, stats]) => {
                if (!stats.lastActive) return true;
                return new Date(stats.lastActive) < oneWeekAgo;
            })
            .map(([topic]) => topic)
            .slice(0, 5);
    },
    
    // Format topic name for display
    formatTopicName(topicId) {
        return topicId.split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    },
    
    // Generate progress report
    generateProgressReport() {
        const progress = storage.getUserProgress();
        const quizHistory = storage.getQuizHistory();
        
        return {
            overall: {
                totalQuizzes: progress.totalQuizzes || 0,
                totalQuestions: progress.totalQuestionsAttempted || 0,
                overallAccuracy: progress.overallAccuracy || 0,
                weakAreas: progress.weakAreas || []
            },
            recentPerformance: this.getRecentPerformance(quizHistory),
            studyRecommendations: this.getStudyRecommendations(),
            goals: this.generateStudyGoals(progress)
        };
    },
    
    // Get recent quiz performance
    getRecentPerformance(quizHistory) {
        const recent = quizHistory.slice(-5); // Last 5 quizzes
        return {
            averageScore: recent.reduce((sum, quiz) => sum + quiz.score, 0) / recent.length,
            trend: this.calculateTrend(recent),
            bestSubject: this.getBestSubject(recent)
        };
    },
    
    // Calculate performance trend
    calculateTrend(quizzes) {
        if (quizzes.length < 2) return 'stable';
        const first = quizzes[0].score;
        const last = quizzes[quizzes.length - 1].score;
        return last > first ? 'improving' : last < first ? 'declining' : 'stable';
    },
    
    // Get best performing subject
    getBestSubject(quizzes) {
        // Implementation would analyze topic performance across quizzes
        return 'anatomy'; // Placeholder
    },
    
    // Generate personalized study goals
    generateStudyGoals(progress) {
        const goals = [];
        
        if (progress.totalQuizzes < 5) {
            goals.push({
                type: 'consistency',
                target: 5,
                current: progress.totalQuizzes,
                message: 'Complete 5 quizzes to establish baseline'
            });
        }
        
        if (progress.overallAccuracy < 70) {
            goals.push({
                type: 'accuracy',
                target: 70,
                current: Math.round(progress.overallAccuracy),
                message: 'Achieve 70% overall accuracy'
            });
        }
        
        const weakAreaCount = progress.weakAreas.filter(a => a.priority === 'high').length;
        if (weakAreaCount > 0) {
            goals.push({
                type: 'weak_areas',
                target: 0,
                current: weakAreaCount,
                message: 'Address all high-priority weak areas'
            });
        }
        
        return goals;
    }
};