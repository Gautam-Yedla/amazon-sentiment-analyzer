import csv

# Paths
input_file = 'E:/amazon-sentiment-analyzer/backend/data/train_all.csv'
output_file = 'E:/amazon-sentiment-analyzer/backend/data/train_all_3class.csv'

# Mapping 5-class → 3-class
def map_label_5_to_3(label):
    if label in [0, 1]:  # Very Negative, Negative
        return 0         # Negative
    elif label == 2:     # Neutral
        return 1         # Neutral
    elif label in [3, 4]:# Positive, Very Positive
        return 2         # Positive
    return None          # Should not happen

# Counters for logging
counts = {0: 0, 1: 0, 2: 0}
skipped = 0
total = 0

print(f"🔄 Converting: {input_file} ➜ {output_file}")

with open(input_file, 'r', encoding='utf-8') as infile, \
     open(output_file, 'w', newline='', encoding='utf-8') as outfile:

    reader = csv.DictReader(infile)
    writer = csv.DictWriter(outfile, fieldnames=['label', 'text'])
    writer.writeheader()

    for row in reader:
        try:
            old_label = int(row['label'])
            new_label = map_label_5_to_3(old_label)
            if new_label is not None and row['text'].strip():
                writer.writerow({'label': new_label, 'text': row['text'].strip()})
                counts[new_label] += 1
                total += 1
                if total % 1_000_000 == 0:
                    print(f"  ➤ Processed {total} rows...")
            else:
                skipped += 1
        except Exception as e:
            print(f"⚠️  Skipped due to error: {e}")
            skipped += 1

print("\n✅ Conversion complete!")
print("📊 New label counts:")
for k, v in counts.items():
    sentiment = ['Negative', 'Neutral', 'Positive'][k]
    print(f"  {k} ({sentiment}): {v}")
print(f"⛔ Skipped: {skipped}")
