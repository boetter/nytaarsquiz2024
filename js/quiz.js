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
            // Play incorrect sound - descending notes
            this.synth.triggerAttackRelease('A4', '16n');
            setTimeout(() => this.synth.triggerAttackRelease('E4', '16n'), 100);
            setTimeout(() => this.synth.triggerAttackRelease('C4', '8n'), 200);
        }

        if (isCorrect) {
            this.correctAnswers++;
            // Create and start confetti effect
            const confetti = new ConfettiEffect();
            confetti.start();
            // Play correct sound - ascending victory melody
            this.synth.triggerAttackRelease('C4', '16n');
            setTimeout(() => this.synth.triggerAttackRelease('E4', '16n'), 100);
            setTimeout(() => this.synth.triggerAttackRelease('G4', '16n'), 200);
            setTimeout(() => this.synth.triggerAttackRelease('C5', '8n'), 300);
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
        
        // Add share button functionality
        const shareButton = document.getElementById('share-results');
        shareButton.addEventListener('click', () => this.shareResults());
    }

    async shareResults() {
        const score = `${this.correctAnswers} ud af ${this.questions.length}`;
        const text = `🎉 Jeg fik ${score} rigtige i Nytårs Quiz 2024! Prøv selv at teste din viden om året der gik!`;
        
        try {
            if (navigator.share) {
                await navigator.share({
                    title: 'Nytårs Quiz 2024',
                    text: text,
                    url: window.location.href
                });
            } else {
                // Fallback to clipboard
                await navigator.clipboard.writeText(text + '\n' + window.location.href);
                alert('Resultat kopieret til udklipsholder! 📋');
            }
        } catch (error) {
            console.error('Error sharing results:', error);
            alert('Kunne ikke dele resultat. Prøv igen senere.');
        }
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
