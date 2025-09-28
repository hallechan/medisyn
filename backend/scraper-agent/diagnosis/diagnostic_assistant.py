# AI-powered diagnostic assistance using research data
# analyzes symptoms and returns probable diagnoses with certainty scores

import re
from typing import List, Dict, Tuple
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import ResearchScraper
from config.ai_keywords import AIKeywordGenerator

class DiagnosticAssistant:

    # uses AI + research scraper to suggest diagnoses based on symptoms

    def __init__(self, gemini_api_key: str):
        self.scraper = ResearchScraper(gemini_api_key=gemini_api_key)
        self.ai_keywords = AIKeywordGenerator(gemini_api_key)

    def analyze_symptoms(self, symptom_description: str, max_diagnoses: int = 5) -> List[Dict]:

        # analyze symptoms and return probable diagnoses with certainty scores
        # diagnoses, certainty scores, supporting evidence, and research summaries

        print(f"Analyzing symptoms: '{symptom_description}'")

        # 1. generate potential conditions using AI
        potential_conditions = self._generate_potential_conditions(symptom_description)
        print(f"AI suggested conditions: {potential_conditions}")

        # 2. research each potential condition
        diagnosis_results = []

        # for each condition, search for research articles and analyze relevance
        for condition in potential_conditions:
            print(f"\nResearching: {condition}")

            # get research articles for this condition
            research_query = f"{condition} diagnosis symptoms women"
            articles = self.scraper.search_with_ai(research_query, max_results=5)

            if articles:
                # analyze how well symptoms match this condition
                certainty_score = self._calculate_certainty_score(
                    symptom_description, condition, articles
                )

                # extract supporting evidence
                supporting_evidence = self._extract_supporting_evidence(
                    symptom_description, articles
                )

                # get key findings
                key_findings = self._extract_key_findings(articles)

                # get medication recommendations
                medication_recommendations = self._generate_medication_recommendations(
                    condition, symptom_description
                )

                # compile results
                diagnosis_results.append({
                    'diagnosis': condition,
                    'certainty_score': certainty_score,
                    'supporting_evidence': supporting_evidence,
                    'research_articles': len(articles),
                    'key_findings': key_findings,
                    'medication_recommendations': medication_recommendations
                })

                print(f"{condition}: {certainty_score:.2f} certainty")
            else: # no articles found
                print(f"No research found for {condition}")

        # 3. sort by certainty score and return top results
        diagnosis_results.sort(key=lambda x: x['certainty_score'], reverse=True)

        print(f"\nTop {max_diagnoses} probable diagnoses:")
        for i, result in enumerate(diagnosis_results[:max_diagnoses], 1):
            print(f"{i}. {result['diagnosis']} ({result['certainty_score']:.2f} certainty)")

        return diagnosis_results[:max_diagnoses]

    # helper methods 

    def _generate_potential_conditions(self, symptom_description: str) -> List[str]:
        
        # use AI to suggest potential medical conditions based on symptoms

        # prompt for Gemini AI model
        prompt = f"""
        You are a medical diagnostic assistant. Given these symptoms, suggest 5 most likely medical conditions to investigate.

        Symptoms: "{symptom_description}"

        Focus on women's health conditions. Return ONLY a JSON array of condition names:
        ["condition1", "condition2", "condition3", "condition4", "condition5"]

        Examples:
        - For "irregular periods, weight gain, acne": ["PCOS", "thyroid disorders", "insulin resistance", "hormonal imbalance", "metabolic syndrome"]
        - For "pelvic pain, heavy bleeding": ["endometriosis", "uterine fibroids", "ovarian cysts", "pelvic inflammatory disease", "adenomyosis"]
        """

        # call the AI model
        try:
            response = self.ai_keywords.model.generate_content(prompt)
            conditions_text = response.text.strip()

            # parse JSON response
            if '```json' in conditions_text:
                start = conditions_text.find('[')
                end = conditions_text.rfind(']') + 1
                if start != -1 and end != 0:
                    conditions_text = conditions_text[start:end]

            # clean up response and parse JSON
            if conditions_text.startswith('[') and conditions_text.endswith(']'):
                import json
                conditions = json.loads(conditions_text)
                return conditions[:5]
            else:
                # fallback parsing
                return self._fallback_condition_extraction(symptom_description)

        except Exception as e: # catch all errors
            print(f"Error generating conditions: {e}")
            return self._fallback_condition_extraction(symptom_description)

    # fallback method if AI fails
    def _fallback_condition_extraction(self, symptom_description: str) -> List[str]:

        symptom_lower = symptom_description.lower()

        # common symptom-to-condition mappings
        condition_mappings = { # stored for fallback
            'irregular periods': ['PCOS', 'thyroid disorders', 'hormonal imbalance'],
            'pelvic pain': ['endometriosis', 'ovarian cysts', 'PID'],
            'heavy bleeding': ['uterine fibroids', 'endometriosis', 'hormonal imbalance'],
            'weight gain': ['PCOS', 'thyroid disorders', 'insulin resistance'],
            'acne': ['PCOS', 'hormonal imbalance', 'androgen excess'],
            'fatigue': ['thyroid disorders', 'anemia', 'chronic fatigue syndrome'],
            'mood changes': ['hormonal imbalance', 'PMDD', 'thyroid disorders']
        }

        suggested_conditions = set() # use set to avoid duplicates

        for symptom, conditions in condition_mappings.items(): # find matches
            if symptom in symptom_lower:
                suggested_conditions.update(conditions)

        return list(suggested_conditions)[:5] if suggested_conditions else ['hormonal imbalance'] # default fallback, hormonal imbalance if none found

    # scoring and evidence extraction methods
    def _calculate_certainty_score(self, symptoms: str, condition: str, articles: List[str]) -> float:
        
        # calculate a certainty score (0-1) based on symptom-article relevance

        # simple scoring based on keyword overlap
        symptom_keywords = set(re.findall(r'\b\w+\b', symptoms.lower()))

        total_matches = 0
        total_words = 0

        for article in articles:
            article_words = set(re.findall(r'\b\w+\b', article.lower()))
            matches = len(symptom_keywords.intersection(article_words))
            total_matches += matches
            total_words += len(article_words)

        if total_words == 0:
            return 0.0

        # calculate match ratio and normalize to 0-1 scale
        match_ratio = total_matches / len(symptom_keywords) if symptom_keywords else 0

        # add bonus for condition-specific keywords
        condition_bonus = 0.2 if condition.lower() in symptoms.lower() else 0

        # combine and cap at 1.0
        certainty = min(match_ratio + condition_bonus, 1.0)

        return round(certainty, 2)

    def _extract_supporting_evidence(self, symptoms: str, articles: List[str]) -> List[str]:

        # extract supporting evidence sentences from articles that mention symptoms

        symptom_keywords = re.findall(r'\b\w+\b', symptoms.lower())
        evidence = []

        for article in articles:
            article_lower = article.lower()

            # find sentences that mention symptom keywords
            sentences = re.split(r'[.!?]+', article)

            for sentence in sentences:
                sentence_lower = sentence.lower()
                matches = sum(1 for keyword in symptom_keywords if keyword in sentence_lower)

                if matches >= 2:  # sentence mentions multiple symptom keywords
                    evidence.append(sentence.strip())

        # return unique evidence, limited to top 3
        unique_evidence = list(dict.fromkeys(evidence))
        return unique_evidence[:3]

    def _extract_key_findings(self, articles: List[str]) -> str:

        # extract key findings summary from research articles

        if not articles:
            return "No research data available"

        # simple extraction: find sentences with key medical terms
        key_terms = ['diagnosis', 'symptoms', 'treatment', 'prevalence', 'presents with', 'characterized by']

        key_sentences = []

        for article in articles: # analyze each article
            sentences = re.split(r'[.!?]+', article)

            for sentence in sentences:
                if any(term in sentence.lower() for term in key_terms):
                    key_sentences.append(sentence.strip())

        if key_sentences:
            # return first key sentence
            finding = key_sentences[0]
            return finding[:200] + "..." if len(finding) > 200 else finding
        else:
            return "Research indicates multiple factors may contribute to this condition"

    def _generate_medication_recommendations(self, condition: str, symptom_description: str) -> List[Dict]:
        """
        Generate medication recommendations for a given condition using AI
        Returns list of medications with dosages and administration details
        """

        prompt = f"""
        You are a clinical pharmacist providing medication recommendations for a diagnosed condition.

        Condition: {condition}
        Patient symptoms: {symptom_description}

        Provide 3-5 evidence-based medication recommendations in JSON format:
        [
          {{
            "medication": "medication name",
            "dosage": "specific dosage with units",
            "frequency": "how often to take",
            "route": "oral/topical/injection/etc",
            "duration": "typical treatment duration",
            "indication": "what symptoms/aspect this treats",
            "monitoring": "what to monitor while on this medication",
            "contraindications": "important warnings or contraindications"
          }}
        ]

        Focus on:
        - First-line treatments for women
        - Evidence-based dosing
        - Safety considerations
        - Hormone-related considerations when relevant

        Example for PCOS:
        [
          {{
            "medication": "Metformin",
            "dosage": "500-850 mg",
            "frequency": "twice daily with meals",
            "route": "oral",
            "duration": "long-term",
            "indication": "insulin resistance and metabolic symptoms",
            "monitoring": "kidney function, vitamin B12, lactic acidosis symptoms",
            "contraindications": "kidney disease, liver disease, alcohol abuse"
          }}
        ]
        """

        try:
            # Use the AI keyword generator's model to get medication recommendations
            response = self.ai_keywords.model.generate_content(prompt)
            response_text = response.text.strip()

            # Extract JSON from response
            import json
            import re

            # Find JSON array in the response
            json_match = re.search(r'\[.*?\]', response_text, re.DOTALL)
            if json_match:
                json_str = json_match.group(0)
                medications = json.loads(json_str)
                return medications
            else:
                # Fallback to condition-specific defaults
                return self._get_default_medications(condition)

        except Exception as e:
            print(f"Error generating medication recommendations: {e}")
            return self._get_default_medications(condition)

    def _get_default_medications(self, condition: str) -> List[Dict]:
        """
        Fallback medication recommendations based on condition
        """

        condition_lower = condition.lower()

        # Common medications for specific conditions
        if 'cardiomyopathy' in condition_lower or 'heart' in condition_lower:
            return [
                {
                    "medication": "Lisinopril",
                    "dosage": "2.5-5 mg",
                    "frequency": "once daily",
                    "route": "oral",
                    "duration": "long-term",
                    "indication": "heart failure and cardioprotection",
                    "monitoring": "blood pressure, kidney function, potassium",
                    "contraindications": "pregnancy, angioedema history"
                },
                {
                    "medication": "Metoprolol",
                    "dosage": "12.5-25 mg",
                    "frequency": "twice daily",
                    "route": "oral",
                    "duration": "long-term",
                    "indication": "heart rate control and symptoms",
                    "monitoring": "heart rate, blood pressure, heart function",
                    "contraindications": "severe asthma, heart block"
                }
            ]

        elif 'embolism' in condition_lower or 'thrombosis' in condition_lower:
            return [
                {
                    "medication": "Rivaroxaban",
                    "dosage": "15 mg",
                    "frequency": "twice daily for 21 days, then 20 mg once daily",
                    "route": "oral",
                    "duration": "3-6 months minimum",
                    "indication": "anticoagulation for pulmonary embolism",
                    "monitoring": "bleeding symptoms, kidney function",
                    "contraindications": "active bleeding, severe kidney disease"
                },
                {
                    "medication": "Enoxaparin",
                    "dosage": "1 mg/kg",
                    "frequency": "twice daily subcutaneous",
                    "route": "injection",
                    "duration": "bridge therapy 5-7 days",
                    "indication": "acute anticoagulation",
                    "monitoring": "platelet count, bleeding, anti-Xa levels",
                    "contraindications": "active bleeding, heparin allergy"
                }
            ]

        elif 'anxiety' in condition_lower or 'panic' in condition_lower:
            return [
                {
                    "medication": "Sertraline",
                    "dosage": "25-50 mg",
                    "frequency": "once daily",
                    "route": "oral",
                    "duration": "6-12 months minimum",
                    "indication": "anxiety and panic symptoms",
                    "monitoring": "mood, suicidal thoughts, serotonin syndrome",
                    "contraindications": "MAOI use, severe liver disease"
                },
                {
                    "medication": "Propranolol",
                    "dosage": "10-40 mg",
                    "frequency": "as needed for acute symptoms",
                    "route": "oral",
                    "duration": "short-term/PRN",
                    "indication": "physical symptoms of anxiety",
                    "monitoring": "heart rate, blood pressure",
                    "contraindications": "asthma, heart block, hypotension"
                }
            ]

        else:
            # Generic supportive care
            return [
                {
                    "medication": "Symptomatic treatment",
                    "dosage": "as directed",
                    "frequency": "as needed",
                    "route": "varies",
                    "duration": "as needed",
                    "indication": "symptom management",
                    "monitoring": "symptom improvement, side effects",
                    "contraindications": "consult healthcare provider"
                }
            ]

# convenience function for quick diagnosis
def get_probable_diagnoses(symptom_description: str, gemini_api_key: str, max_results: int = 3) -> List[Dict]:

    # quick function to get probable diagnoses
    # returns a list of diagnoses with certainty scores and evidence

    assistant = DiagnosticAssistant(gemini_api_key)
    return assistant.analyze_symptoms(symptom_description, max_results)