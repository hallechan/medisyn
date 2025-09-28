#!/usr/bin/env python3
# API wrapper for AI diagnostic assistant
# Called by Node.js server to process diagnosis requests

import sys
import json
import os
from diagnosis.diagnostic_assistant import get_probable_diagnoses

def main():
    """
    Main function to process AI diagnosis request from Node.js
    Expects JSON input via command line argument
    """
    try:
        # Get input from command line argument
        if len(sys.argv) < 2:
            raise ValueError("No input data provided")

        input_data = json.loads(sys.argv[1])

        # Extract parameters
        symptom_description = input_data.get('symptom_description', '')
        gemini_api_key = input_data.get('gemini_api_key', '')
        max_results = input_data.get('max_results', 3)

        # Validate inputs
        if not symptom_description:
            raise ValueError("Symptom description is required")

        if not gemini_api_key:
            raise ValueError("Gemini API key is required")

        # Set API key as environment variable for the diagnostic assistant
        os.environ['GEMINI_API_KEY'] = gemini_api_key

        # Call the diagnostic assistant
        diagnoses = get_probable_diagnoses(
            symptom_description=symptom_description,
            gemini_api_key=gemini_api_key,
            max_results=max_results
        )

        # Output results as JSON to stdout (Node.js will capture this)
        print(json.dumps(diagnoses, indent=2))

    except Exception as e:
        # Output error to stderr (Node.js will capture this)
        print(f"AI Diagnosis Error: {str(e)}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()