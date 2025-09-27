
# makes scraper_agent a Python package that other parts can import from and use

from .main import ResearchScraper

# make ResearchScraper available when scraper_agent is imported
__all__ = ["ResearchScraper"]