from flask import Flask, render_template, jsonify
import logging

logging.basicConfig(level=logging.DEBUG)
app = Flask(__name__)

def load_questions():
    try:
        import pandas as pd
        df = pd.read_csv('quiz.xlsx')
        questions = []
        for _, row in df.iterrows():
            question = {
                'question': row['Question'],
                'options': [row['Option1'], row['Option2'], row['Option3']],
                'correct': int(row['CorrectAnswer']) - 1  # Convert 1-based index to 0-based
            }
            questions.append(question)
        logging.info(f"Loaded {len(questions)} questions from quiz.xlsx")
        return questions
    except Exception as e:
        logging.error(f"Error loading questions: {str(e)}")
        return []

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/questions')
def get_questions():
    questions = load_questions()
    return jsonify(questions)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
