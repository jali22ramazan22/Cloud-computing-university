import json
import os
from google import genai


def read_file(path):
    with open(path, "r") as f:
        return f.read()


def main():
    api_key = os.environ.get("GOOGLE_API_KEY")
    if not api_key:
        print("ERROR: Set GOOGLE_API_KEY environment variable first.")
        print("  export GOOGLE_API_KEY='your_key_here'")
        return

    client = genai.Client(api_key=api_key)

    system_prompt = read_file("system_prompt.txt")
    prd = read_file("prd.txt")
    code = read_file("code_submission.py")

    user_message = (
        f"{prd}\n\n"
        "=== CODE SUBMISSION ===\n"
        f"{code}\n\n"
        "Now analyze the code against the PRD and produce the compliance report JSON."
    )

    response = client.models.generate_content(
        model="gemini-3-flash-preview",
        contents=user_message,
        config={
            "system_instruction": system_prompt,
            "response_mime_type": "application/json",
        },
    )

    raw = response.text.strip()
    report = json.loads(raw)

    with open("compliance_report.json", "w") as f:
        json.dump(report, f, indent=2)

    print("Compliance Report saved to compliance_report.json")
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
