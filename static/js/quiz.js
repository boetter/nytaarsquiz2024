class Quiz {
    constructor() {
        console.log('Initializing Quiz...');
        this.questions = this.generateQuestions();
        this.currentQuestion = 0;
        this.correctAnswers = 0;
        this.confetti = window.confetti;
        this.loadProgress();
        this.initializeEventListeners();
        console.log('Quiz initialized successfully');
    }

    generateQuestions() {
        console.log('Generating questions...');
        // Generate Danish questions about 2024
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
            {
                question: "Hvilket land er vært for Eurovision Song Contest 2024?",
                options: ["Sverige", "Danmark", "Norge"],
                correct: 0
            }
            // More questions will be added here
        ];
    }

    initializeEventListeners() {
        console.log('Setting up event listeners...');
        const startButton = document.getElementById('start-quiz');
        const continueButton = document.getElementById('continue-quiz');
        const restartButton = document.getElementById('restart-quiz');
        const restartCompletedButton = document.getElementById('restart-completed');

        if (startButton) {
            startButton.addEventListener('click', () => {
                console.log('Start button clicked');
                this.startQuiz();
            });
        }

        if (continueButton) {
            continueButton.addEventListener('click', () => {
                console.log('Continue button clicked');
                this.startQuiz();
            });
        }

        if (restartButton) {
            restartButton.addEventListener('click', () => {
                console.log('Restart button clicked');
                this.restartQuiz();
            });
        }

        if (restartCompletedButton) {
            restartCompletedButton.addEventListener('click', () => {
                console.log('Restart completed button clicked');
                this.restartQuiz();
            });
        }

        const options = document.querySelectorAll('.option');
        options.forEach(button => {
            button.addEventListener('click', (e) => {
                console.log('Option clicked');
                this.handleAnswer(e);
            });
        });
        console.log('Event listeners set up successfully');
    }

    startQuiz() {
        console.log('Starting quiz...');
        document.getElementById('welcome-screen').style.display = 'none';
        document.getElementById('quiz-screen').style.display = 'block';
        this.displayQuestion();
    }

    displayQuestion() {
        console.log('Displaying question:', this.currentQuestion + 1);
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
        console.log('Handling answer...');
        const selectedOption = Array.from(document.querySelectorAll('.option')).indexOf(event.target);
        const question = this.questions[this.currentQuestion];
        
        document.querySelectorAll('.option').forEach(button => button.disabled = true);
        
        if (selectedOption === question.correct) {
            event.target.classList.add('correct');
            this.correctAnswers++;
            if (this.confetti) {
                this.confetti.start();
                setTimeout(() => this.confetti.stop(), 2000);
            }
        } else {
            event.target.classList.add('incorrect');
            document.querySelectorAll('.option')[question.correct].classList.add('correct');
        }

        document.getElementById('correct-answers').textContent = this.correctAnswers;
        
        setTimeout(() => this.nextQuestion(), 1500);
    }

    nextQuestion() {
        console.log('Moving to next question...');
        this.currentQuestion++;
        
        if (this.currentQuestion < this.questions.length) {
            this.displayQuestion();
        } else {
            this.showCompletion();
        }
    }

    showCompletion() {
        console.log('Showing completion screen...');
        document.getElementById('quiz-screen').style.display = 'none';
        document.getElementById('completion-screen').style.display = 'block';
        document.querySelector('.final-score').textContent = 
            `Du fik ${this.correctAnswers} ud af ${this.questions.length} rigtige!`;
        
        if (this.confetti) {
            this.confetti.start();
            setTimeout(() => this.confetti.stop(), 5000);
        }
        localStorage.removeItem('quizProgress');
    }

    restartQuiz() {
        console.log('Restarting quiz...');
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

// Wait for DOM to be fully loaded before initializing
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing quiz...');
    try {
        window.confetti = new ConfettiEffect();
        window.quiz = new Quiz();
        console.log('Quiz application started successfully');
    } catch (error) {
        console.error('Error initializing quiz:', error);
    }
});
