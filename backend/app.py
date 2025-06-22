from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import joblib
import os

# Load model and vectorizer
model = joblib.load('model/sentiment_model.pkl')
vectorizer = joblib.load('model/vectorizer.pkl')

app = Flask(__name__)
CORS(app)  

@cross_origin()
@app.route('/github-webhook/', methods=['GET', 'POST'])
def github_webhook():
    if request.method == 'POST':
        payload = request.json
        print("✅ Received webhook:", payload)
        return '', 200
    else:
        return '👋 Webhook endpoint is active!', 200


@cross_origin()
@app.route('/ping', methods=['GET'])
def ping():
    return jsonify({'message': 'Sentiment API is live!'})

@cross_origin()
@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    text = data.get('text', '')
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

# if __name__ == '__main__':
#     app.run(debug=True, host='0.0.0.0')

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 10000))
    app.run(debug=False, host='0.0.0.0', port=port)
