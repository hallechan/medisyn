# PubMed API integration: makes http requests, parses XML into clean Python dicts
# inherit from base scraper

import requests
import xml.etree.ElementTree as ET
import time
from typing import List, Dict, Optional
from .base_scraper import BaseScraper

class PubMedScraper(BaseScraper):
    # connect to PubMed API
    # search for articles via keywords 
    # fetch details (titles, abstracts, authors)
    # parse XML response
    
    def __init__(self, api_key: Optional[str] = None):

        # PubMed E-utilities base URL

        super().__init__("https://eutils.ncbi.nlm.nih.gov/entrez/eutils/")
        self.api_key = api_key  # optional API key for higher rate limits
        self.session = requests.Session()  # reuse connections for efficiency
        
    def search_articles(self, keyword: str, max_results: int = 10) -> List[Dict]:

        # main method to search PubMed for articles by keyword
        # convert keyword to PubMed IDs, then fetch details
        # returns list of article dicts with title, abstract, url, authors, publication_date

        try:
            print(f"Searching PubMed for: '{keyword}'")
            
            # search for article IDs
            pmids = self._search_article_ids(keyword, max_results)
            
            if not pmids:
                print("No articles found")
                return []
            
            print(f"Found {len(pmids)} article IDs: {pmids[:3]}...")
            
            # fetch full details for those IDs
            articles = self._fetch_article_details(pmids)
            
            print(f"Successfully parsed {len(articles)} articles")
            return articles
            
        except Exception as e: # catch all errors
            print(f"Error searching PubMed: {e}") # log error
            return [] # return empty list on error
    
    def _search_article_ids(self, keyword: str, max_results: int) -> List[str]:

        # search PubMed for article IDs matching the keyword
        # uses the 'esearch' E-utility

        search_url = f"{self.base_url}esearch.fcgi"
        
        # parameters for the search
        params = {
            'db': 'pubmed',           # search the PubMed database
            'term': keyword,          # search keyword
            'retmax': max_results,    # how many results to return
            'retmode': 'json',        # return results as JSON (easier than XML)
            'sort': 'relevance'       # sort by relevance
        }
        
        # add API key if provided (allows 10 requests/sec vs 3 requests/sec)
        if self.api_key:
            params['api_key'] = self.api_key
            
        # make the API request
        response = self.session.get(search_url, params=params)
        response.raise_for_status()  # raise error if request failed

        # add delay to respect rate limits (3 requests/sec without API key)
        time.sleep(0.4)  # 400ms delay between requests
        
        # parse the JSON response to get article IDs
        data = response.json()
        pmids = data.get('esearchresult', {}).get('idlist', [])
        
        return pmids
    
    def _fetch_article_details(self, pmids: List[str]) -> List[Dict]:

        # fetch detailed info for a list of PubMed IDs
        # returns list of article dicts with title, abstract, url, authors, publication_date

        if not pmids:
            return []
            
        fetch_url = f"{self.base_url}efetch.fcgi"
        
        # parameters for fetching details
        params = {
            'db': 'pubmed',
            'id': ','.join(pmids),     # comma-separated list of PMIDs
            'retmode': 'xml',          # return as XML (contains more detail than JSON)
            'rettype': 'abstract'      # include abstracts
        }
        
        if self.api_key: # add API key if available
            params['api_key'] = self.api_key # add API key to params

        # make the API request
        response = self.session.get(fetch_url, params=params)
        response.raise_for_status()

        # add delay to respect rate limits
        time.sleep(0.4)  # 400ms delay between requests
        
        # parse the XML response
        return self._parse_pubmed_xml(response.text)
    
    def _parse_pubmed_xml(self, xml_content: str) -> List[Dict]:

        # parse PubMed XML response into list of article dicts
        # since PubMed returns complex XML, extract useful fields

        articles = []
        
        try:
            # parse the XML
            root = ET.fromstring(xml_content)
            
            # find all article elements
            for article_elem in root.findall('.//PubmedArticle'):
                article = self._extract_article_data(article_elem)
                
                # only add if we got valid data
                if article and self.validate_article_data(article):
                    articles.append(article)
                    
        except ET.ParseError as e: # catch XML parsing errors
            print(f"Error parsing XML: {e}")
            
        return articles # return list of article dicts
    
    def _extract_article_data(self, article_elem) -> Optional[Dict]:

        # extract specific data from one article's XML element
        # returns a dictionary with: title, abstract, url, authors, publication_date, pmid (PubMed ID)
    
        try: # try to extract fields, return None if any error occurs
            # extract PMID (PubMed ID)
            pmid_elem = article_elem.find('.//PMID')
            pmid = pmid_elem.text if pmid_elem is not None else ""

            # extract title
            title_elem = article_elem.find('.//ArticleTitle')
            title = title_elem.text if title_elem is not None else ""

            # extract abstract (can have multiple parts)
            abstract_parts = []
            abstract_elems = article_elem.findall('.//AbstractText')
            for elem in abstract_elems:
                if elem.text:
                    # some abstracts have labels like "Background:", "Methods:"
                    label = elem.get('Label', '')
                    text = elem.text
                    if label:
                        abstract_parts.append(f"{label}: {text}")
                    else:
                        abstract_parts.append(text)
            
            abstract = " ".join(abstract_parts) if abstract_parts else ""
            
            # extract authors
            authors = []
            author_elems = article_elem.findall('.//Author')
            for author_elem in author_elems:
                last_name = author_elem.find('LastName')
                first_name = author_elem.find('ForeName')
                if last_name is not None and first_name is not None: # ensure both names exist
                    authors.append(f"{first_name.text} {last_name.text}")
            
            # extract publication date
            pub_date = ""
            date_elem = article_elem.find('.//PubDate')
            if date_elem is not None:
                year = date_elem.find('Year')
                month = date_elem.find('Month')
                if year is not None:
                    pub_date = year.text
                    if month is not None:
                        pub_date = f"{month.text} {pub_date}"
            
            # create PubMed URL for the article
            url = f"https://pubmed.ncbi.nlm.nih.gov/{pmid}/" if pmid else ""
            
            return { # return the article data as a dict
                'title': title,
                'abstract': abstract,
                'url': url,
                'authors': authors,
                'publication_date': pub_date,
                'pmid': pmid
            }
            
        except Exception as e: # catch all errors
            print(f"Error extracting article data: {e}")
            return None
    
    def get_article_text(self, article_id: str) -> Optional[str]: # article_id is the PubMed ID (PMID)
        
        # get the abstract text for a specific PubMed ID
        # implements the abstract method from BaseScraper

        try: # fetch article details for the single ID
            articles = self._fetch_article_details([article_id])
            if articles:
                return articles[0].get('abstract', '')
            return None
            
        except Exception as e:
            print(f"Error fetching article {article_id}: {e}")
            return None

