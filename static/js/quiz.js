class Quiz {
    constructor() {
        this.questions = quizQuestions.questions;
        this.currentQuestion = 0;
        this.correctAnswers = 0;
        
        // Initialize event listeners
        document.getElementById('start-quiz').addEventListener('click', () => this.startQuiz());
        document.getElementById('restart-quiz').addEventListener('click', () => this.restartQuiz());
        document.getElementById('restart-completed').addEventListener('click', () => this.restartQuiz());
    }

    startQuiz() {
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
        }

        if (isCorrect) {
            this.correctAnswers++;
            // Create and start confetti effect
            try {
                const confetti = new ConfettiEffect();
                confetti.start();
                setTimeout(() => {
                    confetti.stop();
                    // Remove the canvas after animation
                    const canvas = document.getElementById('confetti-canvas');
                    if (canvas) canvas.remove();
                }, 2000);
            } catch (error) {
                console.error('Confetti error:', error);
            }
        }

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
        this.currentQuestion = 0;
        this.correctAnswers = 0;
        document.getElementById('completion-screen').style.display = 'none';
        document.getElementById('quiz-screen').style.display = 'none';
        document.getElementById('welcome-screen').style.display = 'block';
    }
}

// Initialize quiz when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Quiz();
});
