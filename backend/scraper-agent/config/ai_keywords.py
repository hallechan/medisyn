# AI-powered keyword generation using Google Gemini API
# replaces hardcoded keywords with intelligent, context-aware search terms

import google.generativeai as genai
from typing import List, Optional
import os
import json

class AIKeywordGenerator:

    # uses Google Gemini to generate medical research keywords
    # based on user queries, conditions, or topics

    def __init__(self, api_key: Optional[str] = None):
        # configure Gemini API
        self.api_key = api_key or os.getenv('GEMINI_API_KEY')
        if not self.api_key:
            raise ValueError("Gemini API key required. Set GEMINI_API_KEY environment variable or pass api_key parameter")

        genai.configure(api_key=self.api_key)

        # use Gemini 2.5 Flash for fast, efficient keyword generation
        self.model = genai.GenerativeModel('gemini-2.5-flash')

    def generate_keywords(self, topic: str, num_keywords: int = 5, focus: str = "women's health") -> List[str]:

        # generate relevant keywords for a medical topic using AI
        # focuses on women's health research terms
        # returns a list of search keywords suitable for PubMed


        # generate prompt for Gemini AI model
        prompt = f"""
        You are a medical research expert helping to find relevant scientific literature.

        Generate {num_keywords} specific, targeted keywords for searching PubMed database about: "{topic}"

        Focus area: {focus}

        Requirements:
        - Keywords should be precise medical/scientific terms
        - Suitable for PubMed searches (use standard medical terminology)
        - Include both broad and specific terms
        - Prioritize terms that would find high-quality research papers
        - Consider synonyms, related conditions, and treatment approaches

        Return ONLY a JSON array of strings, no other text:
        ["keyword1", "keyword2", "keyword3", ...]

        Example for "diabetes":
        ["diabetes mellitus type 2", "insulin resistance women", "gestational diabetes", "diabetic complications female", "metformin treatment"]
        """

        try: # call Gemini API to generate keywords
            response = self.model.generate_content(prompt)

            # parse the JSON response
            keywords_text = response.text.strip()

            # clean up response - remove markdown formatting
            if '```json' in keywords_text:
                # extract JSON from markdown code block
                start = keywords_text.find('[')
                end = keywords_text.rfind(']') + 1
                if start != -1 and end != 0:
                    keywords_text = keywords_text[start:end]

            # extract JSON array from response
            if keywords_text.startswith('[') and keywords_text.endswith(']'):
                keywords = json.loads(keywords_text)
                return keywords[:num_keywords]  # ensure we don't exceed requested number
            else:
                # fallback: split by newlines and clean up
                lines = keywords_text.split('\n')
                keywords = []
                for line in lines:
                    line = line.strip().strip('"-').strip()
                    if line and not line.startswith('[') and not line.startswith(']') and not line.startswith('```'):
                        keywords.append(line)
                return keywords[:num_keywords]

        except Exception as e:
            print(f"Error generating keywords with AI: {e}")
            # fallback to basic keyword if AI fails
            return [f"{topic} {focus}", f"{topic} treatment", f"{topic} women"]

    def generate_condition_keywords(self, condition: str, num_keywords: int = 8) -> List[str]:

        # generate comprehensive keywords for a specific medical condition
        # covers diagnosis, treatment, risk factors, prevention

        # generate prompt for Gemini AI model
        prompt = f"""
        Generate {num_keywords} comprehensive medical research keywords for: "{condition}"

        Cover these aspects:
        - Diagnosis and symptoms
        - Treatment options (medical, surgical, alternative)
        - Risk factors and prevention
        - Impact on women's health specifically
        - Latest research areas and emerging treatments

        Return ONLY a JSON array of specific PubMed search terms:
        ["term1", "term2", "term3", ...]

        Focus on terms that would find the most relevant and recent research papers.
        """

        try:
            response = self.model.generate_content(prompt)
            keywords_text = response.text.strip()

            # clean up response - remove markdown formatting
            if '```json' in keywords_text:
                start = keywords_text.find('[')
                end = keywords_text.rfind(']') + 1
                if start != -1 and end != 0:
                    keywords_text = keywords_text[start:end]

            if keywords_text.startswith('[') and keywords_text.endswith(']'):
                keywords = json.loads(keywords_text)
                return keywords[:num_keywords]
            else:
                # fallback parsing
                lines = keywords_text.split('\n')
                keywords = []
                for line in lines:
                    line = line.strip().strip('"-').strip()
                    if line and not line.startswith('[') and not line.startswith(']') and not line.startswith('```'):
                        keywords.append(line)
                return keywords[:num_keywords]

        except Exception as e:
            print(f"Error generating condition keywords: {e}")
            return [f"{condition} diagnosis", f"{condition} treatment", f"{condition} women", f"{condition} symptoms"]

    def expand_search_query(self, user_query: str, max_keywords: int = 3) -> List[str]:

        # expand a natural language user query into focused search terms
        # useful for general queries that need refinement

        # generate prompt for Gemini AI model
        prompt = f"""
        A user wants to research: "{user_query}"

        Convert this into {max_keywords} precise medical search terms for PubMed database.

        Guidelines:
        - Use proper medical terminology
        - Focus on women's health aspects when relevant
        - Make terms specific enough to find quality research
        - Avoid overly broad terms that would return too many results

        Return ONLY a JSON array:
        ["search_term1", "search_term2", "search_term3"]
        """

        try:
            response = self.model.generate_content(prompt)
            keywords_text = response.text.strip()

            # clean up response - remove markdown formatting
            if '```json' in keywords_text:
                start = keywords_text.find('[')
                end = keywords_text.rfind(']') + 1
                if start != -1 and end != 0:
                    keywords_text = keywords_text[start:end]

            if keywords_text.startswith('[') and keywords_text.endswith(']'):
                keywords = json.loads(keywords_text)
                return keywords[:max_keywords]
            else:
                # fallback parsing
                lines = keywords_text.split('\n')
                keywords = []
                for line in lines:
                    line = line.strip().strip('"-').strip()
                    if line and not line.startswith('[') and not line.startswith(']') and not line.startswith('```'):
                        keywords.append(line)
                return keywords[:max_keywords]

        except Exception as e:
            print(f"Error expanding search query: {e}")
            # simple fallback
            return [user_query]

# convenience function for quick keyword generation
def get_ai_keywords(topic: str, api_key: Optional[str] = None, num_keywords: int = 5) -> List[str]:
    
    # quick function to generate keywords for a topic
    # returns a list of AI-generated keywords
    
    try:
        generator = AIKeywordGenerator(api_key)
        return generator.generate_keywords(topic, num_keywords)
    except Exception as e:
        print(f"AI keyword generation failed: {e}")
        return [topic]  # fallback to original topic