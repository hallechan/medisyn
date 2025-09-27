# abstract base class for all scrapers
# ensures all scrapers (e.g. PubMed, arXiv) have the same methods
# makes it easy to add new scrapers later
# provides a consistent interface
# ABC = Abstract Base Class (can't be used directly, only inherited)

from abc import ABC, abstractmethod
from typing import List, Dict, Optional

class BaseScraper(ABC):
    
    def __init__(self, base_url: str): # base URL for the API (for each scraper)
        self.base_url = base_url
    
    @abstractmethod
    def search_articles(self, keyword: str, max_results: int = 10) -> List[Dict]: # implemented by every scraper
        # takes a search keyword, returns a list of article dictionaries
        # each article dict should have title, abstract, url, authors, publication_date
        pass # must be implemented by child classes
    
    @abstractmethod
    def get_article_text(self, article_id: str) -> Optional[str]: # get full text or abstract
        # returns plain text of the article given its ID
        pass # must be implemented by child classes

    def validate_article_data(self, article: Dict) -> bool: # check for valid
        # check if article has required fields
        # helper method, not abstract
        required_fields = ['title', 'abstract', 'url', 'authors', 'publication_date']
        return all(field in article and article[field] for field in required_fields)