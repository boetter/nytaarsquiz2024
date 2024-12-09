class Quiz {
    constructor() {
        this.questions = this.generateQuestions();
        this.currentQuestion = 0;
        this.correctAnswers = 0;
        this.confetti = confetti;
        this.initializeEventListeners();
        this.loadProgress();
    }

    generateQuestions() {
        // Generate 100 Danish questions about 2024
        return [
            {
                question: "Hvilket stort sportsevent finder sted i Paris i 2024?",
                options: ["OL", "VM i fodbold", "EM i håndbold"],
                correct: 0
            },
            {
                question: "Hvornår er der præsidentvalg i USA i 2024?",
                options: ["5. november", "4. juli", "1. januar"],
                correct: 0
            },
            // ... more questions would be added here
        ];
    }

    initializeEventListeners() {
        document.getElementById('start-quiz').addEventListener('click', () => this.startQuiz());
        document.getElementById('continue-quiz').addEventListener('click', () => this.startQuiz());
        document.getElementById('restart-quiz').addEventListener('click', () => this.restartQuiz());
        document.getElementById('restart-completed').addEventListener('click', () => this.restartQuiz());

        document.querySelectorAll('.option').forEach(button => {
            button.addEventListener('click', (e) => this.handleAnswer(e));
        });
    }

    startQuiz() {
        document.getElementById('welcome-screen').style.display = 'none';
        document.getElementById('quiz-screen').style.display = 'block';
        this.displayQuestion();
    }

    displayQuestion() {
        const question = this.questions[this.currentQuestion];
        document.getElementById('question-text').textContent = question.question;
        
        const options = document.querySelectorAll('.option');
        options.forEach((button, index) => {
            button.textContent = question.options[index];
            button.className = 'option btn btn-outline-light';
            button.disabled = false;
        });

        document.getElementById('current-question').textContent = this.currentQuestion + 1;
        document.querySelector('.progress-bar').style.width = `${(this.currentQuestion / this.questions.length) * 100}%`;
        
        this.saveProgress();
    }

    handleAnswer(event) {
        const selectedOption = Array.from(document.querySelectorAll('.option')).indexOf(event.target);
        const question = this.questions[this.currentQuestion];
        
        document.querySelectorAll('.option').forEach(button => button.disabled = true);
        
        if (selectedOption === question.correct) {
            event.target.classList.add('correct');
            this.correctAnswers++;
            this.confetti.start();
            setTimeout(() => this.confetti.stop(), 2000);
        } else {
            event.target.classList.add('incorrect');
            document.querySelectorAll('.option')[question.correct].classList.add('correct');
        }

        document.getElementById('correct-answers').textContent = this.correctAnswers;
        
        setTimeout(() => this.nextQuestion(), 1500);
    }

    nextQuestion() {
        this.currentQuestion++;
        
        if (this.currentQuestion < this.questions.length) {
            this.displayQuestion();
        } else {
            this.showCompletion();
        }
    }

    showCompletion() {
        document.getElementById('quiz-screen').style.display = 'none';
        document.getElementById('completion-screen').style.display = 'block';
        document.querySelector('.final-score').textContent = 
            `Du fik ${this.correctAnswers} ud af ${this.questions.length} rigtige!`;
        this.confetti.start();
        setTimeout(() => this.confetti.stop(), 5000);
        localStorage.removeItem('quizProgress');
    }

    restartQuiz() {
        this.currentQuestion = 0;
        this.correctAnswers = 0;
        document.getElementById('completion-screen').style.display = 'none';
        document.getElementById('quiz-screen').style.display = 'block';
        document.getElementById('correct-answers').textContent = '0';
        this.displayQuestion();
        localStorage.removeItem('quizProgress');
    }

    saveProgress() {
        const progress = {
            currentQuestion: this.currentQuestion,
            correctAnswers: this.correctAnswers
        };
        localStorage.setItem('quizProgress', JSON.stringify(progress));
    }

    loadProgress() {
        const saved = localStorage.getItem('quizProgress');
        if (saved) {
            const progress = JSON.parse(saved);
            this.currentQuestion = progress.currentQuestion;
            this.correctAnswers = progress.correctAnswers;
            document.getElementById('continue-quiz').style.display = 'block';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    confetti.initialize();
    new Quiz();
});
