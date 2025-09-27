# main scraper service class
# coordinates everything, provides simple interface

from typing import List, Dict, Optional
from config.keywords import HEALTH_KEYWORDS, get_keywords_for_condition
from scrapers.pubmed_scraper import PubMedScraper
from processing.text_processor import TextProcessor

class ResearchScraper:
    # main scraper service that brings everything together
    # what other components will use, simple methods
    
    def __init__(self, api_key: Optional[str] = None): 
        
        # initialize scrapers + text processor
    
        print("Initializing ResearchScraper...")
        self.pubmed_scraper = PubMedScraper(api_key)
        self.text_processor = TextProcessor()
        print("PubMed scraper ready")
        print("Text processor ready")
        
    def get_research_articles(self, # main method to get plain text abstracts
                            keyword: Optional[str] = None, 
                            max_results: int = 10,
                            min_relevance: float = 0.3) -> List[str]:

        # use default keyword if none provided
        search_keyword = keyword or HEALTH_KEYWORDS[0]
        
        # log parameters
        print(f"\nSearching for: '{search_keyword}'")
        print(f"Max results: {max_results}")
        print(f"Min relevance: {min_relevance}")
        
        # search PubMed for articles, call pubmed scraper
        articles = self.pubmed_scraper.search_articles(search_keyword, max_results)
        
        # if no articles found, return empty list
        if not articles:
            print("No articles found")
            return []
        
        print(f"Found {len(articles)} articles from PubMed") # log number found
        
        # process and filter articles
        processed_texts = []
        for i, article in enumerate(articles, 1):

            # calculate how relevant this article is to women's health, calculate relevance score from text_processor
            relevance = self.text_processor.calculate_relevance_score(article)
            
            # only include articles that meet our relevance threshold (0-1 scale)
            if relevance >= min_relevance:

                # clean the abstract text
                clean_text = self.text_processor.clean_abstract(article.get('abstract', ''))

                if clean_text: # only add if there's text
                    processed_texts.append(clean_text) # add to results
                    print(f"Article {i}: Relevance {relevance:.2f} - Added")
                else: # no abstract available
                    print(f"Article {i}: No abstract available - Skipped")
            
            else: # below relevance threshold
                print(f"Article {i}: Relevance {relevance:.2f} - Below threshold")
        
        # return final log
        print(f"\nReturning {len(processed_texts)} relevant articles")
        return processed_texts
    
    def get_detailed_articles(self, 
                            keyword: Optional[str] = None, 
                            max_results: int = 10) -> List[Dict]:
        # get detailed articles with metadata (not just plain text)
        # returns title, authors, url, publication date, plus processed fields
        # uses pubmed scraper + text processor

        # use default keyword if none provided
        search_keyword = keyword or HEALTH_KEYWORDS[0]
        
        print(f"\nGetting detailed articles for: '{search_keyword}'")
        
        # get articles from PubMed
        articles = self.pubmed_scraper.search_articles(search_keyword, max_results)

        # add processed information to each article
        for i, article in enumerate(articles, 1):
            print(f"Processing article {i}...")
            
            # add cleaned abstract
            article['clean_abstract'] = self.text_processor.clean_abstract(
                article.get('abstract', '')
            )
            
            # add relevance score
            article['relevance_score'] = self.text_processor.calculate_relevance_score(article)
            
            # add key findings
            article['key_findings'] = self.text_processor.extract_key_findings(
                article.get('abstract', '')
            )
        
        print(f"Processed {len(articles)} detailed articles")
        return articles
    
    def search_by_condition(self, condition: str, max_results: int = 5) -> List[str]:
        
        # search for articles related to a specific health condition
        # uses multiple keywords for that condition
        # combines results, returns list of plain text abstracts
        
        print(f"\nSearching for condition: {condition}")
        
        # get keywords for this condition
        keywords = get_keywords_for_condition(condition)
        print(f"Using keywords: {keywords[:3]}...")  # show first 3
        
        all_texts = []
        
        # search with multiple keywords for this condition
        for i, keyword in enumerate(keywords[:3], 1):  # limit to 3 to avoid rate limits
            print(f"\n--- Search {i}/3: '{keyword}' ---")
            texts = self.get_research_articles(keyword, max_results) # reuse main method
            all_texts.extend(texts) # combine results
            
        print(f"\nTotal articles for {condition}: {len(all_texts)}") 
        return all_texts # return combined results

def main(): 
    
    # simple test script for manual testing
    
    print("=" * 50)
    print("medisyn research scraper test")
    print("=" * 50)
    
    # initialize the scraper
    scraper = ResearchScraper()
    
    # get plain text abstracts (main use case)
    print("\n" + "=" * 30)
    print("TEST 1: plain text abstracts")
    print("=" * 30)
    
    abstracts = scraper.get_research_articles(
        keyword="breast cancer treatment women",
        max_results=3  # small number for testing
    )
    
    for i, abstract in enumerate(abstracts, 1):
        print(f"\n--- Abstract {i} ---")
        print(f"{abstract[:200]}...")  # show first 200 characters
        print("-" * 40)
    
    # get detailed articles with metadata
    print("\n" + "=" * 30)
    print("TEST 2: detailed articles")  
    print("=" * 30)
    
    detailed_articles = scraper.get_detailed_articles( # reuse method
        keyword="PCOS treatment",
        max_results=2
    )
    
    # print summary of each article
    for i, article in enumerate(detailed_articles, 1):
        print(f"\n--- Article {i} ---")
        print(f"Title: {article['title'][:80]}...")
        print(f"Authors: {', '.join(article['authors'][:2])}")
        print(f"Relevance: {article['relevance_score']:.2f}")
        print(f"URL: {article['url']}")
        print("-" * 40)
    
    # search by condition
    print("\n" + "=" * 30)
    print("TEST 3: Search by Condition")
    print("=" * 30)

    # search for articles related to 'breast cancer'
    condition_articles = scraper.search_by_condition('breast_cancer', max_results=2)
    print(f"\nGot {len(condition_articles)} articles for breast cancer condition")

if __name__ == "__main__": # run main function
    main()