# test script for diagnostic assistant
# shows how to use AI scraper for diagnostic suggestions

import os
from diagnosis.diagnostic_assistant import DiagnosticAssistant

def test_diagnostic_assistant():

    # test the diagnostic assistant with sample symptoms

    # get API key
    api_key = os.getenv('GEMINI_API_KEY')
    if not api_key:
        print("GEMINI_API_KEY environment variable not set")
        return

    print("Testing AI-Powered Diagnostic Assistant")
    print("=" * 50)

    # initialize diagnostic assistant
    assistant = DiagnosticAssistant(api_key)

    # test cases
    test_cases = [
        "irregular menstrual periods, weight gain, acne on face and back, difficulty losing weight",
        "severe pelvic pain during periods, heavy menstrual bleeding, pain during intercourse",
        "extreme fatigue, weight gain, feeling cold, dry skin, hair loss"
    ]

    for i, symptoms in enumerate(test_cases, 1):
        print(f"\nTEST CASE {i}")
        print(f"Symptoms: {symptoms}")
        print("-" * 40)

        try:
            # analyze symptoms and get probable diagnoses
            diagnoses = assistant.analyze_symptoms(symptoms, max_diagnoses=3)

            print(f"\nDIAGNOSTIC RESULTS:")
            for j, diagnosis in enumerate(diagnoses, 1):
                print(f"\n{j}. {diagnosis['diagnosis']}")
                print(f"   Certainty Score: {diagnosis['certainty_score']:.2f}")
                print(f"   Research Articles: {diagnosis['research_articles']}")
                print(f"   Supporting Evidence: {diagnosis['supporting_evidence'][:2]}")  # Show first 2
                print(f"   Key Findings: {diagnosis['key_findings'][:100]}...")

        except Exception as e:
            print(f"Error in test case {i}: {e}")

        print("\n" + "=" * 50)

if __name__ == "__main__":
    test_diagnostic_assistant()