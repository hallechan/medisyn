# clean abstracts to plain text
# score relevance
# extract key findings

import re
from typing import Dict

class TextProcessor: 
    # cleans messy article abstracts into plain text
    # removes XML tags, weird spacing, punctuation
    # calculates + scores how relevant articles are to women's health
    
    def __init__(self):
        # keywords that indicate women's health relevance
        
        self.womens_health_keywords = [
            'women', 'female', 'pregnancy', 'maternal', 'breast', 
            'ovarian', 'cervical', 'menstrual', 'hormone', 'estrogen'
        ]
    
    def clean_abstract(self, text: str) -> str:
        # takes messy abstract text, returns clean plain text
        
        if not text: # handle empty input
            return ""
        
        # remove XML/HTML tags 
        text = re.sub(r'<[^>]+>', '', text)

        # remove weird characters but keep normal punctuation
        text = re.sub(r'[^\w\s\.\,\-\:\;\(\)]', ' ', text)

        # fix multiple spaces -> single space
        text = re.sub(r'\s+', ' ', text)

        # clean up spacing around punctuation
        text = re.sub(r'\s+([,\.;:])', r'\1', text)  # remove space before punctuation
        text = re.sub(r'([,\.;:])\s+', r'\1 ', text)  # single space after punctuation
        
        return text.strip()
    
    def calculate_relevance_score(self, article: Dict) -> float:
        # calculates how relevant an article is to women's health (0 to 1)
        # combines title + abstract, counts keywords, returns score (0.0 = not relevant, 1.0 = very relevant)

        # combine title and abstract into one text block
        text = f"{article.get('title', '')} {article.get('abstract', '')}".lower()
        
        if not text.strip(): # empty text
            return 0.0
        
        # count how many women's health keywords are found
        keyword_count = 0
        for keyword in self.womens_health_keywords: # check each keyword
            if keyword.lower() in text:
                keyword_count += 1 # found one
        
        # convert count to score between 0 and 1
        # more keywords = higher relevance
        max_possible = len(self.womens_health_keywords)
        score = keyword_count / max_possible
        
        return min(score, 1.0)  # cap at 1.0
    
    def extract_key_findings(self, abstract: str) -> str:
        # tries to pull out the most important sentences from an abstract
        # tried to find "Results" or "Conclusions" sections if present, since those are most important
        
        if not abstract: # handle empty input
            return ""
        
        # look for "Results:" or "Conclusions:" sections
        results_match = re.search(r'results?:\s*([^.]*(?:\.[^A-Z][^.]*)*\.)', abstract, re.IGNORECASE)
        if results_match:
            return results_match.group(1).strip()
        
        conclusions_match = re.search(r'conclusions?:\s*([^.]*(?:\.[^A-Z][^.]*)*\.)', abstract, re.IGNORECASE)
        if conclusions_match:
            return conclusions_match.group(1).strip()
        
        # if no structured sections, return first 2 sentences
        sentences = abstract.split('.')
        return '. '.join(sentences[:2]) + '.' if len(sentences) >= 2 else abstract