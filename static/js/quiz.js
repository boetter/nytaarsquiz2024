class Quiz {
    constructor() {
        this.questions = window.quizQuestions.questions;
        this.currentQuestion = 0;
        this.correctAnswers = 0;

        // Initialize event listeners
        document.getElementById('start-quiz').addEventListener('click', () => this.startQuiz());
        document.getElementById('continue-quiz').addEventListener('click', () => this.continueQuiz());
        document.getElementById('restart-quiz').addEventListener('click', () => this.restartQuiz());
        document.getElementById('restart-completed').addEventListener('click', () => this.restartQuiz());

        // Load progress if exists
        this.loadProgress();
    }

    startQuiz() {
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
        } else {
            selectedOption.classList.add('incorrect');
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

    showCompletion() {
        document.getElementById('quiz-screen').style.display = 'none';
        document.getElementById('completion-screen').style.display = 'block';
        
        const finalScore = document.querySelector('.final-score');
        const score = `${this.correctAnswers} ud af ${this.questions.length}`;
        finalScore.textContent = `Du fik ${score} rigtige!`;
        
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

// Initialize quiz when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.quiz = new Quiz();
});

// Social media sharing functions
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