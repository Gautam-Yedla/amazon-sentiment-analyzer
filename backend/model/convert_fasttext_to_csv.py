import csv
import bz2

def convert_bz2_to_csv(input_path, output_path):
   with bz2.open(input_path, 'rt', encoding='utf-8', errors='ignore') as infile, open(output_path, 'w', newline='', encoding='utf-8') as outfile:
        writer = csv.writer(outfile)
        writer.writerow(['label', 'text'])  # header

        for line in infile:
            parts = line.strip().split(' ', 1)
            if len(parts) != 2:
                continue
            label_raw, text = parts
            label = 1 if '__label__2' in label_raw else 0
            writer.writerow([label, text])

# Convert both files
convert_bz2_to_csv('E:/amazon-sentiment-analyzer/backend/data/train.ft.txt.bz2', 'E:/amazon-sentiment-analyzer/backend/data/train.csv')
convert_bz2_to_csv('E:/amazon-sentiment-analyzer/backend/data/test.ft.txt.bz2', 'E:/amazon-sentiment-analyzer/backend/data/test.csv')
