import json
import csv

# File paths
input_path = 'E:/amazon-sentiment-analyzer/backend/data/Beauty_and_Personal_Care.jsonl'
output_path = 'E:/amazon-sentiment-analyzer/backend/data/train_all.csv'

# Sentiment mapping
def map_sentiment(star):
    return {
        1: 0,  # Very Negative
        2: 1,  # Negative
        3: 2,  # Neutral
        4: 3,  # Positive
        5: 4   # Very Positive
    }.get(int(round(star)), None)

# Open output CSV
with open(output_path, 'w', newline='', encoding='utf-8') as csvfile:
    writer = csv.writer(csvfile)
    writer.writerow(['label', 'text'])

    total = 0
    skipped = 0
    with open(input_path, 'r', encoding='utf-8') as infile:
        for line in infile:
            try:
                review = json.loads(line)
                text = review.get("text", "").strip() or review.get("title", "").strip()
                rating = review.get("rating", None)

                if not text or rating is None:
                    skipped += 1
                    continue

                sentiment = map_sentiment(rating)
                if sentiment is None:
                    skipped += 1
                    continue

                writer.writerow([sentiment, text])
                total += 1

            except Exception as e:
                skipped += 1
                continue

print(f"✅ Done. Wrote {total} reviews to {output_path}")
print(f"⛔ Skipped {skipped} invalid/malformed entries")
