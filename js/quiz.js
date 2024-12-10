class Quiz {
    constructor() {
        this.questions = quizQuestions.questions;
        this.currentQuestion = 0;
        this.correctAnswers = 0;
        
        // Initialize audio synth
        this.synth = new Tone.Synth().toDestination();
        
        // Load saved progress
        const savedProgress = localStorage.getItem('quizProgress');
        if (savedProgress) {
            const progress = JSON.parse(savedProgress);
            this.currentQuestion = progress.currentQuestion;
            this.correctAnswers = progress.correctAnswers;
            // Show continue button if there's saved progress
            document.getElementById('continue-quiz').style.display = 'block';
        }
        
        // Initialize event listeners
        document.getElementById('start-quiz').addEventListener('click', () => this.startQuiz());
        document.getElementById('continue-quiz').addEventListener('click', () => this.continueQuiz());
        document.getElementById('restart-quiz').addEventListener('click', () => this.restartQuiz());
        document.getElementById('restart-completed').addEventListener('click', () => this.restartQuiz());
    }

    startQuiz() {
        // Clear any existing progress when starting fresh
        localStorage.removeItem('quizProgress');
        this.currentQuestion = 0;
        this.correctAnswers = 0;
        document.getElementById('welcome-screen').style.display = 'none';
        document.getElementById('quiz-screen').style.display = 'block';
        this.displayQuestion();
    }

    continueQuiz() {
        document.getElementById('welcome-screen').style.display = 'none';
        document.getElementById('quiz-screen').style.display = 'block';
        this.displayQuestion();
    }

    displayQuestion() {
        const question = this.questions[this.currentQuestion];
        
        // Update progress bar
        const progress = ((this.currentQuestion + 1) / this.questions.length) * 100;
        document.querySelector('.progress-bar').style.width = `${progress}%`;

        // Update question counter and score
        document.getElementById('current-question').textContent = this.currentQuestion + 1;
        document.getElementById('correct-answers').textContent = this.correctAnswers;

        // Display question
        document.getElementById('question-text').textContent = question.question;

        // Display options
        const optionButtons = document.querySelectorAll('.option');
        optionButtons.forEach((button, index) => {
            // Remove any existing event listeners by cloning and replacing the button
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
            
            // Set up the new button
            newButton.textContent = question.options[index];
            newButton.classList.remove('correct', 'incorrect');
            newButton.disabled = false;
            
            // Add click event listener
            newButton.addEventListener('click', () => this.handleAnswer(index));
        });
    }

    handleAnswer(index) {
        const question = this.questions[this.currentQuestion];
        const isCorrect = index === question.correct;
        const optionButtons = document.querySelectorAll('.option');

        // Disable all buttons after selection
        optionButtons.forEach(button => button.disabled = true);

        // Show correct/incorrect visual feedback
        optionButtons[index].classList.add(isCorrect ? 'correct' : 'incorrect');
        if (!isCorrect) {
            optionButtons[question.correct].classList.add('correct');
            // Play incorrect sound
            this.synth.triggerAttackRelease('C4', '8n');
        }

        if (isCorrect) {
            this.correctAnswers++;
            // Create and start confetti effect
            const confetti = new ConfettiEffect();
            confetti.start();
            // Play correct sound
            this.synth.triggerAttackRelease('G4', '8n');
            setTimeout(() => {
                confetti.stop();
            }, 1500);
        }

        // Save progress
        localStorage.setItem('quizProgress', JSON.stringify({
            currentQuestion: this.currentQuestion + 1,
            correctAnswers: this.correctAnswers
        }));

        // Wait before moving to next question
        setTimeout(() => {
            this.currentQuestion++;
            if (this.currentQuestion < this.questions.length) {
                this.displayQuestion();
            } else {
                this.showCompletion();
            }
        }, 1500);
    }

    showCompletion() {
        document.getElementById('quiz-screen').style.display = 'none';
        document.getElementById('completion-screen').style.display = 'block';
        const score = `${this.correctAnswers} ud af ${this.questions.length}`;
        document.querySelector('.final-score').textContent = `Du fik ${score} rigtige!`;
    }

    restartQuiz() {
        // Clear saved progress
        localStorage.removeItem('quizProgress');
        this.currentQuestion = 0;
        this.correctAnswers = 0;
        document.getElementById('completion-screen').style.display = 'none';
        document.getElementById('quiz-screen').style.display = 'none';
        document.getElementById('welcome-screen').style.display = 'block';
        // Hide continue button since progress is cleared
        document.getElementById('continue-quiz').style.display = 'none';
    }
}

// Initialize quiz when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded event fired');
    if (window.quizQuestions) {
        const quiz = new Quiz();
        // Update total questions display
        document.getElementById('total-questions').textContent = quiz.questions.length;
    } else {
        console.error('Quiz questions not loaded properly');
    }
});
