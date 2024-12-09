class Quiz {
    constructor() {
        console.log('Initializing Quiz...');
        this.currentQuestion = 0;
        this.correctAnswers = 0;
        this.confetti = window.confetti;
        this.questions = [];
        this.initializeEventListeners();
        this.loadProgress();
        this.initialize();
    }

    async initialize() {
        this.questions = await this.generateQuestions();
        console.log('Quiz initialized with:', this.questions.length, 'questions');
    }

    async generateQuestions() {
        try {
            const response = await fetch('/api/questions');
            if (!response.ok) {
                throw new Error('Failed to fetch questions');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching questions:', error);
            return [];
        }
    }

    initializeEventListeners() {
        console.log('Setting up event listeners...');
        
        // Start Quiz button
        const startButton = document.getElementById('start-quiz');
        if (startButton) {
            startButton.addEventListener('click', () => {
                console.log('Start button clicked');
                this.startQuiz();
            });
            console.log('Start button listener attached');
        } else {
            console.error('Start button not found!');
        }

        // Continue Quiz button
        const continueButton = document.getElementById('continue-quiz');
        if (continueButton) {
            continueButton.addEventListener('click', () => {
                console.log('Continue button clicked');
                this.startQuiz();
            });
        }

        // Restart buttons
        document.getElementById('restart-quiz')?.addEventListener('click', () => this.restartQuiz());
        document.getElementById('restart-completed')?.addEventListener('click', () => this.restartQuiz());

        // Answer options
        const options = document.querySelectorAll('.option');
        options.forEach(button => {
            button.addEventListener('click', (e) => {
                console.log('Option clicked:', e.target.textContent);
                this.handleAnswer(e);
            });
        });
    }

    startQuiz() {
        console.log('Starting quiz...');
        const welcomeScreen = document.getElementById('welcome-screen');
        const quizScreen = document.getElementById('quiz-screen');
        
        if (welcomeScreen && quizScreen) {
            welcomeScreen.style.display = 'none';
            quizScreen.style.display = 'block';
            this.displayQuestion();
            console.log('Quiz started successfully');
        } else {
            console.error('Required screens not found!');
        }
    }

    displayQuestion() {
        console.log('Displaying question:', this.currentQuestion + 1);
        const questionText = document.getElementById('question-text');
        const options = document.querySelectorAll('.option');
        
        if (!questionText || options.length === 0) {
            console.error('Question elements not found!');
            return;
        }

        const question = this.questions[this.currentQuestion];
        questionText.textContent = question.question;
        
        options.forEach((button, index) => {
            button.textContent = question.options[index];
            button.className = 'option btn btn-outline-light';
            button.disabled = false;
        });

        document.getElementById('current-question').textContent = this.currentQuestion + 1;
        document.querySelector('.progress-bar').style.width = 
            `${(this.currentQuestion / this.questions.length) * 100}%`;
        
        this.saveProgress();
    }

    handleAnswer(event) {
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
        
        const finalScore = document.querySelector('.final-score');
        if (finalScore) {
            finalScore.textContent = 
                `Du fik ${this.correctAnswers} ud af ${this.questions.length} rigtige!`;
        }
        
        if (this.confetti) {
            this.confetti.start();
            setTimeout(() => this.confetti.stop(), 5000);
        }
        
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

// Initialize quiz when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing quiz...');
    try {
        window.quiz = new Quiz();
        console.log('Quiz initialized successfully');
    } catch (error) {
        console.error('Error initializing quiz:', error);
    }
});
