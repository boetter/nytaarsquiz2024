from flask import Flask, render_template, jsonify
import logging
import json

logging.basicConfig(level=logging.DEBUG)
app = Flask(__name__)

def load_questions():
    try:
        with open('questions.json', 'r', encoding='utf-8') as f:
            data = json.loads(f.read())
            questions = data['questions']
            logging.info(f"Loaded {len(questions)} questions from questions.json")
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
