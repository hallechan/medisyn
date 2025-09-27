# quick test script for Gemini API integration
# run this after getting your API key to verify everything works

import os
from config.ai_keywords import AIKeywordGenerator

def test_gemini_api():

    # test the Gemini API integration with keyword generator

    # check if API key is available
    api_key = os.getenv('GEMINI_API_KEY')
    if not api_key:
        print("GEMINI_API_KEY environment variable not set")
        print("Set it with: export GEMINI_API_KEY='your_key_here'")
        return

    print("API key found")
    print("Testing AI keyword generation...")

    try:
        # initialize the AI keyword generator
        generator = AIKeywordGenerator(api_key)

        # test basic keyword generation
        print("\n--- Test 1: Basic Keywords ---")
        keywords = generator.generate_keywords("endometriosis", num_keywords=3)
        print(f"Generated keywords: {keywords}")

        # test condition keywords
        print("\n--- Test 2: Condition Keywords ---")
        condition_keywords = generator.generate_condition_keywords("PCOS", num_keywords=4)
        print(f"Condition keywords: {condition_keywords}")

        # test query expansion
        print("\n--- Test 3: Query Expansion ---")
        expanded = generator.expand_search_query("birth control side effects", max_keywords=2)
        print(f"Expanded query: {expanded}")

        print("\nAll tests passed! Gemini API integration is working")

    except Exception as e:
        print(f"Error testing Gemini API: {e}")
        print("Check API key and internet connection")

if __name__ == "__main__":
    test_gemini_api()