import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report
import joblib
import os

# Paths
import os
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DATA_PATH = os.path.join(BASE_DIR, "data", "train.csv")

MODEL_PATH = '../model/sentiment_model.pkl'
VECTORIZER_PATH = '../model/vectorizer.pkl'

# 1. Load data
df = pd.read_csv(DATA_PATH)

# 2. Clean/trim if needed (optional step for large data)
df = df.dropna().sample(n=100000, random_state=42)  # limit for speed; remove for full training

# 3. Preprocess
X = df['text']
y = df['label']

# 4. TF-IDF Vectorization
vectorizer = TfidfVectorizer(stop_words='english', max_features=5000)
X_vec = vectorizer.fit_transform(X)

# 5. Train/test split (optional, since we have separate test.csv)
X_train, X_val, y_train, y_val = train_test_split(X_vec, y, test_size=0.2, random_state=42)

# 6. Train model
model = LogisticRegression(max_iter=1000)
model.fit(X_train, y_train)

# 7. Evaluate
y_pred = model.predict(X_val)
print(classification_report(y_val, y_pred))

# 8. Save model and vectorizer
os.makedirs('../model', exist_ok=True)
joblib.dump(model, MODEL_PATH)
joblib.dump(vectorizer, VECTORIZER_PATH)

print("✅ Model and vectorizer saved.")
