from flask import Flask, render_template, jsonify
import logging
import pandas as pd

logging.basicConfig(level=logging.DEBUG)
app = Flask(__name__)

def load_questions():
    # Questions hardcoded from quiz.xlsx
    questions = [
        {
            'question': 'Hvilket stort sportsevent finder sted i Paris i 2024?',
            'options': ['OL', 'VM i fodbold', 'EM i håndbold'],
            'correct': 0  # Correct answer is OL (index 0)
        },
        {
            'question': 'Hvornår er der præsidentvalg i USA i 2024?',
            'options': ['5. november', '4. juli', '1. januar'],
            'correct': 0  # Correct answer is 5. november (index 0)
        },
        {
            'question': 'Hvilket land er vært for Eurovision Song Contest 2024?',
            'options': ['Sverige', 'Danmark', 'Norge'],
            'correct': 0  # Correct answer is Sverige (index 0)
        },
        {
            'question': 'Hvad er den forventede inflation i Danmark i 2024?',
            'options': ['2.8%', '3.5%', '4.2%'],
            'correct': 0  # Correct answer is 2.8% (index 0)
        },
        {
            'question': 'Hvilken dansk by er udnævnt til Europæisk Kulturhovedstad 2024?',
            'options': ['Bodø', 'Tartu', 'Bad Ischl'],
            'correct': 0  # Correct answer is Bodø (index 0)
        }
    ]
    logging.info(f"Loaded {len(questions)} hardcoded questions")
    return questions

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/questions')
def get_questions():
    questions = load_questions()
    return jsonify(questions)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
