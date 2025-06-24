from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from sqlalchemy import create_engine, Column, Integer, String, Float, BigInteger
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import joblib
import os
import time
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Database setup: PostgreSQL for production, SQLite fallback for local
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///history.db")
engine = create_engine(DATABASE_URL, pool_pre_ping=True)
Base = declarative_base()

# Flask app initialization
app = Flask(__name__)
CORS(app)

# Load ML model and vectorizer
model = joblib.load('model/sgdclassifier_full/model.pkl')
vectorizer = joblib.load('model/sgdclassifier_full/vectorizer.pkl')

# Define History table
class History(Base):
    __tablename__ = 'history'
    id = Column(Integer, primary_key=True)
    text = Column(String)
    prediction = Column(String)
    confidence = Column(Float)
    timestamp = Column(BigInteger)

Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)


# Optional: GitHub webhook route (safe to ignore for app usage)
@cross_origin()
@app.route('/github-webhook/', methods=['GET', 'POST'])
def github_webhook():
    if request.method == 'POST':
        payload = request.json
        print("✅ Received webhook:", payload)
        return '', 200
    else:
        return '👋 Webhook endpoint is active!', 200

# Predict sentiment
@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    text = data.get('text', '').strip()
    if not text:
        return jsonify({'error': 'No text provided'}), 400

    # Vectorize and predict
    X = vectorizer.transform([text])
    pred = model.predict(X)[0]
    prob = float(model.predict_proba(X)[0].max())

    # Label mapping
    label = {0: 'negative', 1: 'neutral', 2: 'positive'}.get(pred, str(pred))

    # Create result with timestamp
    result = {
        'text': text,
        'prediction': label,
        'confidence': round(prob, 4),
        'timestamp': int(time.time() * 1000)
    }

    # Save to DB
    session = Session()
    session.add(History(**result))
    session.commit()
    session.close()

    return jsonify(result)

# Fetch history
@app.route('/history', methods=['GET'])
def get_history():
    session = Session()
    entries = session.query(History).order_by(History.timestamp.desc()).all()
    session.close()

    return jsonify([
        {
            'text': e.text,
            'prediction': e.prediction,
            'confidence': e.confidence,
            'timestamp': e.timestamp
        } for e in entries
    ])

# Clear history
@app.route('/history/clear', methods=['POST'])
def clear_history():
    session = Session()
    session.query(History).delete()
    session.commit()
    session.close()
    return jsonify({'message': 'History cleared.'})

# Get statistics
@app.route('/stats', methods=['GET'])
def get_stats():
    session = Session()
    entries = session.query(History).all()
    session.close()

    total = len(entries)
    pos = sum(1 for e in entries if e.prediction.lower() == 'positive')
    neg = sum(1 for e in entries if e.prediction.lower() == 'negative')
    neu = sum(1 for e in entries if e.prediction.lower() == 'neutral')
    avg_conf = round(sum(e.confidence for e in entries) / total, 4) if total > 0 else 0.0

    return jsonify({
        'totalReviews': total,
        'positive': pos,
        'negative': neg,
        'neutral': neu,
        'averageConfidence': avg_conf
    })

# Run the app
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 10000))
    app.run(debug=False, host='0.0.0.0', port=port)
