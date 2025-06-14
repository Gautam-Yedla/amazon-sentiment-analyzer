from flask import Flask, request, jsonify
import joblib
from flask_cors import CORS
import os

# Load model and vectorizer
model = joblib.load('model/sentiment_model.pkl')
vectorizer = joblib.load('model/vectorizer.pkl')

app = Flask(__name__)
CORS(app)  

@app.route('/ping', methods=['GET'])
def ping():
    return jsonify({'message': 'Sentiment API is live!'})

@app.route('/predict', methods=['GET'])
def predict():
    text = request.args.get('text')
    if not text:
        return jsonify({'error': 'No text provided'}), 400

    # Transform text
    X = vectorizer.transform([text])
    pred = model.predict(X)[0]
    prob = model.predict_proba(X)[0].max()

    label = 'Positive' if pred == 1 else 'Negative'

    return jsonify({
        'text': text,
        'prediction': label,
        'confidence': round(float(prob), 4)
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
