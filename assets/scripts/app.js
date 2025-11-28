const app = {
    // Initialize the application
    async init() {
        console.log('Medical Exam Prep App Initialized');
        await this.ensureDefaultData();
        return true;
    },

    // Ensure default data structure exists
    async ensureDefaultData() {
        const progress = storage.getUserProgress();
        if (!progress) {
            storage.initializeUserProgress();
        }
    },

    // Get available subjects and topics
    getSubjects() {
        return [
            {
                name: 'Anatomy',
                icon: '🦴',
                groups: [
                    {
                        id: 'gross-anatomy',
                        name: 'Gross Anatomy',
                        icon: '📚',
                        topics: [
                            { id: 'upper-limb', name: 'Upper Limb' },
                            { id: 'lower-limb', name: 'Lower Limb' },
                            { id: 'thorax', name: 'Thorax' },
                            { id: 'abdomen', name: 'Abdomen' },
                            { id: 'head-neck', name: 'Head & Neck' },
                            { id: 'neuroanatomy', name: 'Neuroanatomy' }
                        ]
                    },
                    {
                        id: 'embryology',
                        name: 'Embryology',
                        icon: '👶',
                        topics: [
                            { id: 'general-embryology', name: 'General Embryology' },
                            { id: 'system-embryology', name: 'System Embryology' }
                        ]
                    },
                    {
                        id: 'histology',
                        name: 'Histology',
                        icon: '🔬',
                        topics: [
                            { id: 'epithelial-tissue', name: 'Epithelial Tissue' },
                            { id: 'connective-tissue', name: 'Connective Tissue' },
                            { id: 'muscle-tissue', name: 'Muscle Tissue' },
                            { id: 'nervous-tissue', name: 'Nervous Tissue' },
                            { id: 'organ-histology', name: 'Organ Histology' }
                        ]
                    }
                ]
            },
            {
                name: 'Physiology',
                icon: '❤️',
                groups: [
                    {
                        id: 'cardiovascular',
                        name: 'Cardiovascular',
                        icon: '🫀',
                        topics: [
                            { id: 'cardiac-physiology', name: 'Cardiac Physiology' },
                            { id: 'vascular-physiology', name: 'Vascular Physiology' }
                        ]
                    },
                    {
                        id: 'renal',
                        name: 'Renal',
                        icon: '🧪',
                        topics: [
                            { id: 'glomerular-function', name: 'Glomerular Function' },
                            { id: 'tubular-function', name: 'Tubular Function' }
                        ]
                    },
                    {
                        id: 'respiratory',
                        name: 'Respiratory',
                        icon: '🫁',
                        topics: [
                            { id: 'ventilation', name: 'Ventilation' },
                            { id: 'gas-exchange', name: 'Gas Exchange' }
                        ]
                    },
                    {
                        id: 'neurophysiology',
                        name: 'Neurophysiology',
                        icon: '🧠',
                        topics: [
                            { id: 'cns-physiology', name: 'CNS Physiology' },
                            { id: 'pns-physiology', name: 'PNS Physiology' }
                        ]
                    }
                ]
            },
            {
                name: 'Biochemistry',
                icon: '🧬',
                groups: [
                    {
                        id: 'metabolism',
                        name: 'Metabolism',
                        icon: '⚡',
                        topics: [
                            { id: 'carbohydrate-met', name: 'Carbohydrate Metabolism' },
                            { id: 'lipid-metabolism', name: 'Lipid Metabolism' },
                            { id: 'protein-metabolism', name: 'Protein Metabolism' },
                            { id: 'nucleic-acid-met', name: 'Nucleic Acid Metabolism' }
                        ]
                    },
                    {
                        id: 'molecular-biology',
                        name: 'Molecular Biology',
                        icon: '🔍',
                        topics: [
                            { id: 'dna-replication', name: 'DNA Replication' },
                            { id: 'transcription', name: 'Transcription' },
                            { id: 'translation', name: 'Translation' },
                            { id: 'genetic-regulation', name: 'Genetic Regulation' }
                        ]
                    },
                    {
                        id: 'clinical-biochem',
                        name: 'Clinical Biochemistry',
                        icon: '🏥',
                        topics: [
                            { id: 'lab-values', name: 'Lab Values' },
                            { id: 'disease-markers', name: 'Disease Markers' },
                            { id: 'metabolic-disorders', name: 'Metabolic Disorders' }
                        ]
                    }
                ]
            }
        ];
    },

    // Get subject files for loading
    getSubjectFiles(subject) {
        const fileMap = {
            'anatomy': [
                'gross-anatomy.json', 'upper-limb.json', 'lower-limb.json',
                'thorax.json', 'abdomen.json', 'head-neck.json', 'neuroanatomy.json',
                'embryology.json', 'general-embryology.json', 'system-embryology.json',
                'histology.json', 'epithelial-tissue.json', 'connective-tissue.json',
                'muscle-tissue.json', 'nervous-tissue.json', 'organ-histology.json'
            ],
            'physiology': [
                'cardiovascular.json', 'cardiac-physiology.json', 'vascular-physiology.json',
                'renal.json', 'glomerular-function.json', 'tubular-function.json',
                'respiratory.json', 'ventilation.json', 'gas-exchange.json',
                'neurophysiology.json', 'cns-physiology.json', 'pns-physiology.json',
                'endocrine.json', 'hormones.json', 'endocrine-organs.json',
                'gastrointestinal.json', 'digestion.json', 'absorption.json',
                'special-senses.json'
            ],
            'biochemistry': [
                'metabolism.json', 'carbohydrate-met.json', 'lipid-metabolism.json',
                'protein-metabolism.json', 'nucleic-acid-met.json',
                'molecular-biology.json', 'dna-replication.json', 'transcription.json',
                'translation.json', 'genetic-regulation.json',
                'clinical-biochem.json', 'lab-values.json', 'disease-markers.json',
                'metabolic-disorders.json', 'enzymology.json', 'enzyme-kinetics.json',
                'enzyme-regulation.json', 'nutrition.json', 'vitamins-minerals.json'
            ]
        };
        
        return fileMap[subject] || [];
    },

    // Load questions from specific topic files
    async loadQuestionsFromTopics(topicIds) {
        let allQuestions = [];
        
        for (const topicId of topicIds) {
            try {
                // Determine subject from topic ID using the corrected function
                let subject = this.getSubjectFromTopic(topicId);
                
                if (!subject) {
                    console.warn(`Could not determine subject for topic: ${topicId}`);
                    continue;
                }
                
                const questions = await this.loadJSON(`data/${subject}/${topicId}.json`);
                // Add topic metadata to each question
                questions.forEach(q => q.topic = topicId);
                allQuestions = allQuestions.concat(questions);
            } catch (error) {
                console.warn(`Could not load questions for topic: ${topicId}`, error);
                // Use sample questions as fallback
                const sampleQuestions = this.generateSampleQuestions(topicId, 10);
                allQuestions = allQuestions.concat(sampleQuestions);
            }
        }
        
        return allQuestions;
    },

    // Fix the subject detection logic
    getSubjectFromTopic(topicId) {
        // Anatomy topics
        const anatomyTopics = [
            'upper-limb', 'lower-limb', 'thorax', 'abdomen', 'head-neck', 'neuroanatomy',
            'gross-anatomy', 'embryology', 'general-embryology', 'system-embryology',
            'histology', 'epithelial-tissue', 'connective-tissue', 'muscle-tissue',
            'nervous-tissue', 'organ-histology'
        ];
        
        // Physiology topics  
        const physiologyTopics = [
            'cardiovascular', 'cardiac-physiology', 'vascular-physiology',
            'renal', 'glomerular-function', 'tubular-function',
            'respiratory', 'ventilation', 'gas-exchange',
            'neurophysiology', 'cns-physiology', 'pns-physiology',
            'endocrine', 'hormones', 'endocrine-organs',
            'gastrointestinal', 'digestion', 'absorption',
            'special-senses'
        ];
        
        // Biochemistry topics
        const biochemistryTopics = [
            'metabolism', 'carbohydrate-met', 'lipid-metabolism',
            'protein-metabolism', 'nucleic-acid-met',
            'molecular-biology', 'dna-replication', 'transcription',
            'translation', 'genetic-regulation',
            'clinical-biochem', 'lab-values', 'disease-markers',
            'metabolic-disorders', 'enzymology', 'enzyme-kinetics',
            'enzyme-regulation', 'nutrition', 'vitamins-minerals'
        ];
        
        if (anatomyTopics.includes(topicId)) {
            return 'anatomy';
        } else if (physiologyTopics.includes(topicId)) {
            return 'physiology';
        } else if (biochemistryTopics.includes(topicId)) {
            return 'biochemistry';
        }
        
        console.warn(`Unknown topic: ${topicId}`);
        return null;
    },

    // Load JSON data with fallback
    async loadJSON(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Network response was not ok');
            return await response.json();
        } catch (error) {
            console.warn(`Failed to load ${url}, using sample data`, error);
            // Generate sample data based on the URL
            const topic = url.split('/').pop().replace('.json', '');
            return this.generateSampleQuestions(topic, 20);
        }
    },

    // Generate sample questions for development
    generateSampleQuestions(topic, count) {
        const questions = [];
        const topicName = topic.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
        
        for (let i = 1; i <= count; i++) {
            questions.push({
                id: `${topic}-${i}`,
                question: `Sample question ${i} about ${topicName}?`,
                options: [
                    `Correct answer for question ${i}`,
                    `Incorrect option A for question ${i}`,
                    `Incorrect option B for question ${i}`,
                    `Incorrect option C for question ${i}`
                ],
                correctAnswer: 0,
                explanation: `This is a sample explanation for question ${i} about ${topicName}. In a real application, this would contain detailed information about why the correct answer is right and why the others are wrong.`,
                topic: topic,
                difficulty: ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)]
            });
        }
        return questions;
    },

    // Shuffle array (Fisher-Yates algorithm)
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
};