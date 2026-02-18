import csv


def parse_csv(filepath):
    """Parse a CSV file and return a list of dictionaries."""
    f = open(filepath, "r")
    reader = csv.DictReader(f)
    results = []
    for row in reader:
        results.append(dict(row))
    f.close()
    return results
