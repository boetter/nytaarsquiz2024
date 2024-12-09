from flask import Flask, render_template, jsonify
import pandas as pd
import logging

logging.basicConfig(level=logging.DEBUG)
app = Flask(__name__)

def load_questions():
    try:
        df = pd.read_excel('quiz.xlsx')
        questions = []
        for _, row in df.iterrows():
            question = {
                'question': row['Question'],
                'options': [row['Option1'], row['Option2'], row['Option3']],
                'correct': int(row['CorrectAnswer']) - 1  # Assuming 1-based indexing in Excel
            }
            questions.append(question)
        logging.info(f"Loaded {len(questions)} questions from Excel file")
        return questions
    except Exception as e:
        logging.error(f"Error loading questions: {e}")
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
