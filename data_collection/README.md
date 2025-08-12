# CommunityPulse Data Collection System

Comprehensive data collection and processing system for training CommunityPulse AI models with real community data.

## 🎯 Overview

This system collects and processes community data from multiple sources:
- **Reddit**: Real community posts from relevant subreddits
- **NextDoor**: Generated realistic community content
- **Processing**: Clean, analyze, and prepare data for AI training

## 📁 Project Structure

```
data_collection/
├── reddit_scraper.py      # Reddit data collection
├── nextdoor_generator.py  # NextDoor-style content generation
├── data_processor.py      # Data cleaning and analysis
├── collect_data.py        # Main orchestration script
├── requirements.txt       # Python dependencies
└── README.md             # This file
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd data_collection
pip install -r requirements.txt
```

### 2. Run Complete Data Collection

```bash
python collect_data.py
```

This will:
- Collect Reddit posts from community subreddits
- Generate realistic NextDoor-style content
- Process and analyze all data
- Create training datasets
- Generate analysis reports

## 📊 Data Sources

### Reddit Collection

**Target Subreddits:**
- `HOA` - Homeowners Association discussions
- `apartmentliving` - Apartment community issues
- `neighbors` - Neighbor relationships and conflicts
- `homeowners` - Homeowner community topics
- `PropertyManagement` - Property management discussions
- `RealEstate` - Real estate community content
- `community` - General community discussions
- `neighborhoodwatch` - Neighborhood safety
- `apartments` - Apartment living discussions
- `condos` - Condominium community topics

**Features:**
- Collects posts and comments
- Respects rate limits
- Filters for text content
- Extracts engagement metrics

### NextDoor Generation

**Content Types:**
- **Positive Posts** (40%): Community appreciation, events, recommendations
- **Negative Posts** (30%): Complaints, issues, concerns
- **Neutral Posts** (25%): Questions, information requests
- **Misinformation Posts** (5%): Conspiracy theories, urgent warnings

**Categories:**
- General community discussions
- Crime and safety
- Lost and found
- Recommendations
- Events
- Classifieds
- Free stuff
- Neighborhood watch
- Local news
- Pets
- Kids and family
- Elder care
- Home improvement
- Gardening
- Noise complaints

## 🔧 Individual Scripts

### Reddit Scraper

```bash
# Collect Reddit data only
python reddit_scraper.py

# Or use the main script
python collect_data.py --reddit-only
```

**Configuration:**
- `posts_per_subreddit`: Number of posts to collect (default: 50)
- `comments_per_post`: Number of comments per post (default: 20)
- Rate limiting: 1 second between requests

### NextDoor Generator

```bash
# Generate NextDoor-style content only
python nextdoor_generator.py

# Or use the main script
python collect_data.py --nextdoor-only
```

**Configuration:**
- `num_posts`: Total posts to generate (default: 1000)
- Sentiment distribution: Configurable ratios
- Realistic author names and timestamps

### Data Processor

```bash
# Process existing data only
python data_processor.py

# Or use the main script
python collect_data.py --process-only
```

**Features:**
- Text cleaning and normalization
- Feature extraction
- Misinformation detection
- Sentiment analysis
- Data analysis and reporting

## 📈 Data Processing Pipeline

### 1. Text Cleaning
- Remove URLs, mentions, hashtags
- Normalize whitespace
- Convert to lowercase
- Remove special characters

### 2. Feature Extraction
- Text length and word count
- Average word length
- Punctuation analysis
- Capitalization patterns
- URL and mention counts

### 3. Misinformation Detection
- Urgency word detection
- Conspiracy theory indicators
- Authority challenge patterns
- Excessive capitalization
- Exclamation overuse

### 4. Sentiment Analysis
- Reddit: Based on upvote scores
- NextDoor: Pre-labeled sentiment
- Confidence scoring

## 📊 Output Files

### Raw Data
```
data/
├── reddit/
│   ├── reddit_posts_YYYYMMDD_HHMMSS.csv
│   └── reddit_comments_YYYYMMDD_HHMMSS.csv
├── nextdoor/
│   ├── nextdoor_posts_YYYYMMDD_HHMMSS.csv
│   └── nextdoor_posts_YYYYMMDD_HHMMSS.json
```

### Processed Data
```
data/
├── processed/
│   ├── processed_data_YYYYMMDD_HHMMSS.csv
│   └── training_dataset_YYYYMMDD_HHMMSS.csv
├── analysis/
│   └── analysis_report_YYYYMMDD_HHMMSS.md
```

## 📋 Data Schema

### Raw Reddit Data
```csv
id,title,content,author,subreddit,score,upvote_ratio,num_comments,created_utc,url
```

### Raw NextDoor Data
```csv
content,author,category,sentiment,timestamp,likes,comments
```

### Processed Data
```csv
content,sentiment,category,urgency_words,conspiracy_words,authority_challenge,excessive_caps,exclamation_overuse,length,word_count,source
```

### Training Dataset
```csv
content,sentiment,category,urgency_words,conspiracy_words,authority_challenge,excessive_caps,exclamation_overuse,length,word_count,misinformation_risk
```

## 🎛️ Configuration Options

### Command Line Arguments

```bash
# Collect only Reddit data
python collect_data.py --reddit-only

# Generate only NextDoor data
python collect_data.py --nextdoor-only

# Process existing data only
python collect_data.py --process-only

# Skip Reddit collection
python collect_data.py --skip-reddit

# Skip NextDoor generation
python collect_data.py --skip-nextdoor
```

### Script Parameters

**Reddit Scraper:**
```python
scraper.collect_data(
    posts_per_subreddit=50,    # Posts per subreddit
    comments_per_post=20       # Comments per post
)
```

**NextDoor Generator:**
```python
generator.generate_dataset(
    num_posts=1000,           # Total posts to generate
    # Sentiment distribution is configurable in the class
)
```

## 📊 Analysis Reports

The system generates comprehensive analysis reports including:

- **Dataset Overview**: Total posts, average length, word count
- **Sentiment Distribution**: Positive, negative, neutral percentages
- **Source Distribution**: Reddit vs NextDoor breakdown
- **Category Analysis**: Most common post categories
- **Misinformation Indicators**: Detection statistics
- **Recommendations**: Training suggestions

## 🔒 Privacy and Ethics

### Data Collection Ethics
- **Reddit**: Public data only, respects rate limits
- **NextDoor**: Generated synthetic data
- **No Personal Information**: All data is anonymized
- **Educational Use**: For research and development only

### Rate Limiting
- Reddit: 1 second between requests
- Respects robots.txt and API guidelines
- User-Agent identification for transparency

## 🚨 Troubleshooting

### Common Issues

**Reddit Rate Limiting:**
```bash
# Reduce collection speed
python reddit_scraper.py  # Edit parameters in script
```

**Missing Dependencies:**
```bash
pip install -r requirements.txt
```

**No Data Collected:**
- Check internet connection
- Verify subreddit names are correct
- Review rate limiting settings

**Processing Errors:**
- Ensure data files exist in correct directories
- Check file permissions
- Verify CSV/JSON format

### Debug Mode

Add debug logging to scripts:
```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

## 📈 Performance

### Typical Collection Times
- **Reddit**: 5-10 minutes (with rate limiting)
- **NextDoor**: 1-2 minutes (generation)
- **Processing**: 2-5 minutes (depending on data size)

### Data Volumes
- **Reddit**: 300-500 posts + 1000-2000 comments
- **NextDoor**: 1000 generated posts
- **Combined**: 1500-2500 total training samples

## 🔄 Continuous Collection

For ongoing data collection:

```bash
# Set up cron job for daily collection
0 2 * * * cd /path/to/communitypulse/data_collection && python collect_data.py

# Or use systemd timer for more control
```

## 📚 Integration with CommunityPulse

The collected data can be used to:

1. **Train Sentiment Analysis Models**
   - VADER sentiment analysis improvement
   - Custom sentiment classifiers

2. **Enhance Misinformation Detection**
   - Pattern recognition training
   - Risk scoring algorithms

3. **Improve Content Classification**
   - Category prediction models
   - Priority scoring systems

4. **Validate AI Models**
   - Test accuracy with real data
   - Benchmark performance

## 🤝 Contributing

To contribute to the data collection system:

1. **Add New Data Sources**
   - Implement new scraper classes
   - Follow existing patterns

2. **Improve Processing**
   - Enhance feature extraction
   - Add new analysis metrics

3. **Expand Categories**
   - Add new community topics
   - Improve content generation

4. **Optimize Performance**
   - Reduce collection time
   - Improve data quality

## 📄 License

This data collection system is part of the CommunityPulse project and is intended for educational and research purposes.

---

**Happy Data Collecting! 🎉**