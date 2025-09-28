# stores hardcoded keywords for scraping
# organize by condition or topic
HEALTH_KEYWORDS = [
    # cancer-related
    "breast cancer treatment women",
    "cervical cancer screening",
    "ovarian cancer symptoms",
    
    # reproductive health
    "endometriosis treatment options",
    "PCOS polycystic ovary syndrome", 
    "pregnancy complications",
    "fertility treatment women",
    
    # other conditions
    "postpartum depression",
    "menopause hormone therapy",
    "osteoporosis prevention women",
    
    # general
    "women's health preventive care",
    "maternal mortality"
]

# more specific keywords organized by condition
SPECIFIC_CONDITIONS = {
    'breast_cancer': [
        "breast cancer chemotherapy",
        "mastectomy reconstruction",
        "BRCA1 BRCA2 testing"
    ],
    'reproductive_health': [
        "contraception effectiveness", 
        "IVF success rates",
        "prenatal care guidelines"
    ],
    'mental_health': [
        "postpartum depression treatment",
        "anxiety disorders women",
        "eating disorders female"
    ]
}

# helper function to get keywords for spceific conditions

def get_keywords_for_condition(condition: str) -> list:
    # return keywords for a specific condition, or general ones if not found
    return SPECIFIC_CONDITIONS.get(condition, HEALTH_KEYWORDS[:5])