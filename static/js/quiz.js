class Quiz {
    constructor() {
        console.log('Initializing Quiz...');
        try {
            if (!window.quizQuestions || !window.quizQuestions.questions) {
                throw new Error('Quiz questions not loaded');
            }
            
            this.questions = window.quizQuestions.questions;
            this.currentQuestion = 0;
            this.correctAnswers = 0;
            this.confetti = window.confetti;
            this.correctSound = document.getElementById('correct-sound');
            this.incorrectSound = document.getElementById('incorrect-sound');

            if (!this.questions || this.questions.length === 0) {
                throw new Error('No questions available');
            }
            
            console.log(`Loaded ${this.questions.length} questions successfully`);

        console.log('Setting up event listeners...');
        // Initialize event listeners
        const startButton = document.getElementById('start-quiz');
        if (startButton) {
            startButton.addEventListener('click', () => {
                console.log('Start button clicked');
                this.startQuiz();
            });
            console.log('Start button listener attached');
        }

        const continueButton = document.getElementById('continue-quiz');
        if (continueButton) {
            continueButton.addEventListener('click', () => this.continueQuiz());
        }

        const restartButton = document.getElementById('restart-quiz');
        if (restartButton) {
            restartButton.addEventListener('click', () => this.restartQuiz());
        }

        const restartCompletedButton = document.getElementById('restart-completed');
        if (restartCompletedButton) {
            restartCompletedButton.addEventListener('click', () => this.restartQuiz());
        }

        console.log('Quiz initialized with:', this.questions.length, 'questions');
        // Load progress if exists
        this.loadProgress();
    }

    startQuiz() {
        console.log('Starting quiz...');
        document.getElementById('welcome-screen').style.display = 'none';
        document.getElementById('quiz-screen').style.display = 'block';
        this.displayQuestion();
        console.log('Quiz started successfully');
    }

    continueQuiz() {
        console.log('Continuing quiz...');
        document.getElementById('welcome-screen').style.display = 'none';
        document.getElementById('quiz-screen').style.display = 'block';
        this.displayQuestion();
    }

    displayQuestion() {
        const question = this.questions[this.currentQuestion];
        if (!question) {
            console.error('No question found at index:', this.currentQuestion);
            return;
        }

        // Update progress bar
        const progress = ((this.currentQuestion + 1) / this.questions.length) * 100;
        document.querySelector('.progress-bar').style.width = `${progress}%`;

        // Update question counter
        document.getElementById('current-question').textContent = this.currentQuestion + 1;
        document.getElementById('correct-answers').textContent = this.correctAnswers;

        // Display question
        document.getElementById('question-text').textContent = question.question;

        // Display options
        const optionButtons = document.querySelectorAll('.option');
        optionButtons.forEach((button, index) => {
            button.textContent = question.options[index];
            button.classList.remove('correct', 'incorrect');
            button.disabled = false;
            button.onclick = () => this.handleAnswer(index);
        });
    }

    handleAnswer(index) {
        const question = this.questions[this.currentQuestion];
        const selectedOption = document.querySelectorAll('.option')[index];
        const isCorrect = index === question.correct;

        if (isCorrect) {
            this.correctAnswers++;
            selectedOption.classList.add('correct');
            this.celebrateCorrectAnswer();
        } else {
            selectedOption.classList.add('incorrect');
            this.playIncorrectSound();
            // Show correct answer
            document.querySelectorAll('.option')[question.correct].classList.add('correct');
        }

        // Disable all options after selection
        document.querySelectorAll('.option').forEach(option => option.disabled = true);

        // Save progress
        this.saveProgress();

        // Move to next question after delay
        setTimeout(() => {
            this.currentQuestion++;
            if (this.currentQuestion < this.questions.length) {
                this.displayQuestion();
            } else {
                this.showCompletion();
            }
        }, 1500);
    }

    celebrateCorrectAnswer() {
        if (this.confetti) {
            this.confetti.start();
            setTimeout(() => this.confetti.stop(), 1000);
        }
        if (this.correctSound) {
            this.correctSound.play().catch(e => console.log('Error playing sound:', e));
        }
    }

    playIncorrectSound() {
        if (this.incorrectSound) {
            this.incorrectSound.play().catch(e => console.log('Error playing sound:', e));
        }
    }

    showCompletion() {
        document.getElementById('quiz-screen').style.display = 'none';
        document.getElementById('completion-screen').style.display = 'block';
        
        const finalScore = document.querySelector('.final-score');
        const score = `${this.correctAnswers} ud af ${this.questions.length}`;
        if (finalScore) {
            finalScore.textContent = `Du fik ${score} rigtige!`;
        }
        
        // Celebration confetti effect
        if (this.confetti) {
            this.confetti.start();
            setTimeout(() => {
                this.confetti.stop();
                setTimeout(() => {
                    this.confetti.start();
                    setTimeout(() => this.confetti.stop(), 2000);
                }, 500);
            }, 3000);
        }
        
        // Store score for social media sharing
        window.shareScore = score;
        localStorage.removeItem('quizProgress');
    }

    restartQuiz() {
        this.currentQuestion = 0;
        this.correctAnswers = 0;
        document.getElementById('completion-screen').style.display = 'none';
        document.getElementById('quiz-screen').style.display = 'none';
        document.getElementById('welcome-screen').style.display = 'block';
        document.getElementById('correct-answers').textContent = '0';
        document.querySelector('.progress-bar').style.width = '0%';
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

// Social Media Sharing Functions
function shareOnFacebook() {
    const text = `Jeg fik ${window.shareScore} rigtige i Nytårs Quiz 2024! 🎉 Prøv selv at teste din viden!`;
    const url = window.location.href;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`, 
                '_blank', 'width=600,height=400');
}

function shareOnTwitter() {
    const text = `Jeg fik ${window.shareScore} rigtige i Nytårs Quiz 2024! 🎉 Prøv selv at teste din viden!`;
    const url = window.location.href;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
                '_blank', 'width=600,height=400');
}

function shareOnLinkedIn() {
    const text = `Jeg fik ${window.shareScore} rigtige i Nytårs Quiz 2024! 🎉`;
    const url = window.location.href;
    window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent('Nytårs Quiz 2024')}&summary=${encodeURIComponent(text)}`,
                '_blank', 'width=600,height=400');
}

// Initialize quiz when DOM is loaded
function initializeQuizWhenReady() {
    const initialize = () => {
        // Wait for a short delay to ensure all scripts are loaded
        setTimeout(() => {
            console.log('Attempting to initialize quiz...');
            if (!window.quiz) {
                try {
                    window.quiz = new Quiz();
                    console.log('Quiz initialized successfully');
                } catch (error) {
                    console.error('Error initializing quiz:', error);
                    // Retry initialization after a delay if it fails
                    setTimeout(initialize, 500);
                }
            }
        }, 100);
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            console.log('DOM Content Loaded event fired');
            initialize();
        });
    } else {
        console.log('DOM already loaded, initializing immediately');
        initialize();
    }
}

initializeQuizWhenReady();

function initializeQuiz() {
    console.log('DOM loaded, initializing quiz...');
    if (!window.quiz) {
        try {
            window.quiz = new Quiz();
            console.log('Quiz initialized successfully');
        } catch (error) {
            console.error('Error initializing quiz:', error);
        }
    }
}