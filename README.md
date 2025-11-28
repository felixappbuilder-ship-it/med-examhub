# Medical Exam Prep App

A comprehensive web-based medical examination preparation application featuring 2,500+ high-quality questions across Anatomy, Physiology, and Biochemistry. Built with modern web technologies for optimal learning experience.

## 🎯 Features

- **2,500+ Medical Questions** - Comprehensive coverage of medical subjects
- **Adaptive Quiz System** - Multiple quiz modes (Practice, Timed, Exam)
- **Progress Tracking** - Detailed analytics and performance insights
- **Topic Selection** - Hierarchical subject and topic organization
- **Review System** - Complete answer explanations and weak area identification
- **Responsive Design** - Works on desktop, tablet, and mobile devices
- **Offline Capable** - Progress saved locally in browser

## 📁 File Structure
## 📁 EXPANDED FILE STRUCTURE

```
med-exam-app/
├── index.html
├── subject-select.html
├── quiz.html
├── results.html
├── review.html
├── profile.html
├── data/
│   ├── anatomy/
│   │   ├── gross-anatomy.json          # 200 questions
│   │   ├── upper-limb.json             # 80 questions
│   │   ├── lower-limb.json             # 80 questions
│   │   ├── thorax.json                 # 60 questions
│   │   ├── abdomen.json                # 60 questions
│   │   ├── head-neck.json              # 60 questions
│   │   ├── neuroanatomy.json           # 60 questions
│   │   ├── embryology.json             # 200 questions
│   │   ├── general-embryology.json     # 80 questions
│   │   ├── system-embryology.json      # 120 questions
│   │   ├── histology.json              # 200 questions
│   │   ├── epithelial-tissue.json      # 40 questions
│   │   ├── connective-tissue.json      # 40 questions
│   │   ├── muscle-tissue.json          # 40 questions
│   │   ├── nervous-tissue.json         # 40 questions
│   │   └── organ-histology.json        # 40 questions
│   ├── physiology/
│   │   ├── cardiovascular.json         # 120 questions
│   │   ├── cardiac-physiology.json     # 60 questions
│   │   ├── vascular-physiology.json    # 60 questions
│   │   ├── renal.json                  # 100 questions
│   │   ├── glomerular-function.json    # 50 questions
│   │   ├── tubular-function.json       # 50 questions
│   │   ├── respiratory.json            # 80 questions
│   │   ├── ventilation.json            # 40 questions
│   │   ├── gas-exchange.json           # 40 questions
│   │   ├── neurophysiology.json        # 100 questions
│   │   ├── cns-physiology.json         # 50 questions
│   │   ├── pns-physiology.json         # 50 questions
│   │   ├── endocrine.json              # 80 questions
│   │   ├── hormones.json               # 40 questions
│   │   ├── endocrine-organs.json       # 40 questions
│   │   ├── gastrointestinal.json       # 60 questions
│   │   ├── digestion.json              # 30 questions
│   │   ├── absorption.json             # 30 questions
│   │   └── special-senses.json         # 60 questions
│   ├── biochemistry/
│   │   ├── metabolism.json             # 200 questions
│   │   ├── carbohydrate-met.json       # 70 questions
│   │   ├── lipid-metabolism.json       # 50 questions
│   │   ├── protein-metabolism.json     # 50 questions
│   │   ├── nucleic-acid-met.json       # 30 questions
│   │   ├── molecular-biology.json      # 150 questions
│   │   ├── dna-replication.json        # 40 questions
│   │   ├── transcription.json          # 40 questions
│   │   ├── translation.json            # 40 questions
│   │   ├── genetic-regulation.json     # 30 questions
│   │   ├── clinical-biochem.json       # 100 questions
│   │   ├── lab-values.json             # 40 questions
│   │   ├── disease-markers.json        # 30 questions
│   │   ├── metabolic-disorders.json    # 30 questions
│   │   ├── enzymology.json             # 30 questions
│   │   ├── enzyme-kinetics.json        # 15 questions
│   │   ├── enzyme-regulation.json      # 15 questions
│   │   ├── nutrition.json              # 20 questions
│   │   └── vitamins-minerals.json      # 20 questions
│   └── user-progress.json
└── assets/
    └── scripts/
        ├── app.js
        ├── quiz-engine.js
        ├── analytics.js
        └── storage.js
```