from flask import Flask, render_template, jsonify, send_from_directory
import logging
import json

logging.basicConfig(level=logging.DEBUG)
app = Flask(__name__)

def load_questions():
    try:
        with open('questions.json', 'r', encoding='utf-8') as f:
            content = f.read()
            logging.debug(f"Reading JSON content length: {len(content)}")
            data = json.loads(content)
            questions = data.get('questions', [])
            logging.info(f"Successfully loaded {len(questions)} questions from questions.json")
            
            # Validate question format
            for i, q in enumerate(questions):
                if not isinstance(q, dict) or \
                   'question' not in q or \
                   'options' not in q or \
                   'correct' not in q or \
                   len(q['options']) != 3:
                    logging.error(f"Invalid question format at index {i}: {q}")
                    continue
            return questions
    except json.JSONDecodeError as e:
        logging.error(f"JSON parsing error: {str(e)}")
        return []
    except Exception as e:
        logging.error(f"Unexpected error loading questions: {str(e)}")
        return []

@app.route('/')
def index():
    try:
        logging.info("Serving index.html template")
        return render_template('index.html')
    except Exception as e:
        logging.error(f"Error serving index.html: {str(e)}")
        return str(e), 500

@app.route('/static/<path:filename>')
def serve_static(filename):
    try:
        logging.info(f"Serving static file: {filename}")
        return send_from_directory('static', filename)
    except Exception as e:
        logging.error(f"Error serving static file {filename}: {str(e)}")
        return str(e), 404

@app.route('/api/questions')
def get_questions():
    questions = load_questions()
    return jsonify(questions)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
