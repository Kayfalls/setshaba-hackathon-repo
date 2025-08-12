#!/usr/bin/env python3
"""
Data Processor for Community Posts
Processes and prepares collected data for training the CommunityPulse AI models
"""

import pandas as pd
import json
import csv
import re
import os
from datetime import datetime
from typing import List, Dict, Any, Tuple
import numpy as np
from collections import Counter
import matplotlib.pyplot as plt
import seaborn as sns

class DataProcessor:
    def __init__(self):
        self.data_dir = 'data'
        self.processed_dir = 'data/processed'
        
        # Create directories
        os.makedirs(self.processed_dir, exist_ok=True)
        os.makedirs('data/analysis', exist_ok=True)
        
        # Text cleaning patterns
        self.url_pattern = re.compile(r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+')
        self.mention_pattern = re.compile(r'@\w+')
        self.hashtag_pattern = re.compile(r'#\w+')
        self.extra_whitespace = re.compile(r'\s+')
        
    def load_reddit_data(self) -> pd.DataFrame:
        """Load Reddit data from CSV files"""
        reddit_dir = os.path.join(self.data_dir, 'reddit')
        if not os.path.exists(reddit_dir):
            print("No Reddit data found. Run reddit_scraper.py first.")
            return pd.DataFrame()
        
        posts_data = []
        comments_data = []
        
        # Load all CSV files
        for filename in os.listdir(reddit_dir):
            if filename.endswith('.csv'):
                filepath = os.path.join(reddit_dir, filename)
                df = pd.read_csv(filepath)
                
                if 'parent_id' in df.columns:
                    comments_data.append(df)
                else:
                    posts_data.append(df)
        
        # Combine data
        if posts_data:
            posts_df = pd.concat(posts_data, ignore_index=True)
        else:
            posts_df = pd.DataFrame()
            
        if comments_data:
            comments_df = pd.concat(comments_data, ignore_index=True)
        else:
            comments_df = pd.DataFrame()
        
        return posts_df, comments_df
    
    def load_nextdoor_data(self) -> pd.DataFrame:
        """Load NextDoor generated data"""
        nextdoor_dir = os.path.join(self.data_dir, 'nextdoor')
        if not os.path.exists(nextdoor_dir):
            print("No NextDoor data found. Run nextdoor_generator.py first.")
            return pd.DataFrame()
        
        data = []
        
        # Load all JSON files
        for filename in os.listdir(nextdoor_dir):
            if filename.endswith('.json'):
                filepath = os.path.join(nextdoor_dir, filename)
                with open(filepath, 'r', encoding='utf-8') as f:
                    data.extend(json.load(f))
        
        return pd.DataFrame(data)
    
    def clean_text(self, text: str) -> str:
        """Clean and normalize text"""
        if pd.isna(text) or not isinstance(text, str):
            return ""
        
        # Convert to lowercase
        text = text.lower()
        
        # Remove URLs
        text = self.url_pattern.sub('', text)
        
        # Remove mentions and hashtags
        text = self.mention_pattern.sub('', text)
        text = self.hashtag_pattern.sub('', text)
        
        # Remove extra whitespace
        text = self.extra_whitespace.sub(' ', text)
        
        # Remove leading/trailing whitespace
        text = text.strip()
        
        return text
    
    def extract_features(self, text: str) -> Dict[str, Any]:
        """Extract text features for analysis"""
        features = {
            'length': len(text),
            'word_count': len(text.split()),
            'avg_word_length': np.mean([len(word) for word in text.split()]) if text.split() else 0,
            'exclamation_count': text.count('!'),
            'question_count': text.count('?'),
            'caps_ratio': sum(1 for c in text if c.isupper()) / len(text) if text else 0,
            'digit_count': sum(1 for c in text if c.isdigit()),
            'url_count': len(self.url_pattern.findall(text)),
            'mention_count': len(self.mention_pattern.findall(text)),
            'hashtag_count': len(self.hashtag_pattern.findall(text))
        }
        
        return features
    
    def detect_misinformation_indicators(self, text: str) -> Dict[str, Any]:
        """Detect potential misinformation indicators"""
        indicators = {
            'urgency_words': 0,
            'conspiracy_words': 0,
            'authority_challenge': 0,
            'excessive_caps': 0,
            'exclamation_overuse': 0
        }
        
        urgency_words = ['urgent', 'emergency', 'breaking', 'critical', 'immediate', 'now', 'quick']
        conspiracy_words = ['conspiracy', 'cover-up', 'hidden', 'secret', 'they don\'t want you to know', 'wake up']
        authority_challenge = ['government', 'authorities', 'mainstream media', 'official', 'establishment']
        
        text_lower = text.lower()
        
        # Count urgency words
        for word in urgency_words:
            indicators['urgency_words'] += text_lower.count(word)
        
        # Count conspiracy words
        for word in conspiracy_words:
            indicators['conspiracy_words'] += text_lower.count(word)
        
        # Count authority challenge words
        for word in authority_challenge:
            indicators['authority_challenge'] += text_lower.count(word)
        
        # Check for excessive caps
        if len(text) > 0:
            caps_ratio = sum(1 for c in text if c.isupper()) / len(text)
            indicators['excessive_caps'] = 1 if caps_ratio > 0.3 else 0
        
        # Check for excessive exclamation marks
        exclamation_ratio = text.count('!') / len(text) if len(text) > 0 else 0
        indicators['exclamation_overuse'] = 1 if exclamation_ratio > 0.05 else 0
        
        return indicators
    
    def process_reddit_data(self, posts_df: pd.DataFrame, comments_df: pd.DataFrame) -> pd.DataFrame:
        """Process Reddit data for training"""
        processed_data = []
        
        # Process posts
        for _, post in posts_df.iterrows():
            if pd.isna(post.get('content', '')) or not post.get('content'):
                continue
            
            cleaned_content = self.clean_text(post['content'])
            if len(cleaned_content) < 10:  # Skip very short posts
                continue
            
            features = self.extract_features(cleaned_content)
            misinformation_indicators = self.detect_misinformation_indicators(cleaned_content)
            
            # Determine sentiment based on score
            score = post.get('score', 0)
            if score > 10:
                sentiment = 'positive'
            elif score < -5:
                sentiment = 'negative'
            else:
                sentiment = 'neutral'
            
            processed_data.append({
                'content': cleaned_content,
                'original_content': post.get('content', ''),
                'author': post.get('author', 'Anonymous'),
                'category': 'reddit_post',
                'sentiment': sentiment,
                'timestamp': post.get('created_utc', ''),
                'score': score,
                'upvote_ratio': post.get('upvote_ratio', 0),
                'num_comments': post.get('num_comments', 0),
                'subreddit': post.get('subreddit', ''),
                'url': post.get('url', ''),
                'length': features['length'],
                'word_count': features['word_count'],
                'avg_word_length': features['avg_word_length'],
                'exclamation_count': features['exclamation_count'],
                'question_count': features['question_count'],
                'caps_ratio': features['caps_ratio'],
                'urgency_words': misinformation_indicators['urgency_words'],
                'conspiracy_words': misinformation_indicators['conspiracy_words'],
                'authority_challenge': misinformation_indicators['authority_challenge'],
                'excessive_caps': misinformation_indicators['excessive_caps'],
                'exclamation_overuse': misinformation_indicators['exclamation_overuse'],
                'source': 'reddit'
            })
        
        # Process comments
        for _, comment in comments_df.iterrows():
            if pd.isna(comment.get('content', '')) or not comment.get('content'):
                continue
            
            cleaned_content = self.clean_text(comment['content'])
            if len(cleaned_content) < 5:  # Skip very short comments
                continue
            
            features = self.extract_features(cleaned_content)
            misinformation_indicators = self.detect_misinformation_indicators(cleaned_content)
            
            # Determine sentiment based on score
            score = comment.get('score', 0)
            if score > 5:
                sentiment = 'positive'
            elif score < -2:
                sentiment = 'negative'
            else:
                sentiment = 'neutral'
            
            processed_data.append({
                'content': cleaned_content,
                'original_content': comment.get('content', ''),
                'author': comment.get('author', 'Anonymous'),
                'category': 'reddit_comment',
                'sentiment': sentiment,
                'timestamp': comment.get('created_utc', ''),
                'score': score,
                'upvote_ratio': 0,
                'num_comments': 0,
                'subreddit': '',
                'url': '',
                'length': features['length'],
                'word_count': features['word_count'],
                'avg_word_length': features['avg_word_length'],
                'exclamation_count': features['exclamation_count'],
                'question_count': features['question_count'],
                'caps_ratio': features['caps_ratio'],
                'urgency_words': misinformation_indicators['urgency_words'],
                'conspiracy_words': misinformation_indicators['conspiracy_words'],
                'authority_challenge': misinformation_indicators['authority_challenge'],
                'excessive_caps': misinformation_indicators['excessive_caps'],
                'exclamation_overuse': misinformation_indicators['exclamation_overuse'],
                'source': 'reddit'
            })
        
        return pd.DataFrame(processed_data)
    
    def process_nextdoor_data(self, df: pd.DataFrame) -> pd.DataFrame:
        """Process NextDoor data for training"""
        processed_data = []
        
        for _, post in df.iterrows():
            if pd.isna(post.get('content', '')) or not post.get('content'):
                continue
            
            cleaned_content = self.clean_text(post['content'])
            if len(cleaned_content) < 10:
                continue
            
            features = self.extract_features(cleaned_content)
            misinformation_indicators = self.detect_misinformation_indicators(cleaned_content)
            
            processed_data.append({
                'content': cleaned_content,
                'original_content': post.get('content', ''),
                'author': post.get('author', 'Anonymous'),
                'category': post.get('category', 'general'),
                'sentiment': post.get('sentiment', 'neutral'),
                'timestamp': post.get('timestamp', ''),
                'score': post.get('likes', 0),
                'upvote_ratio': 0,
                'num_comments': post.get('comments', 0),
                'subreddit': '',
                'url': '',
                'length': features['length'],
                'word_count': features['word_count'],
                'avg_word_length': features['avg_word_length'],
                'exclamation_count': features['exclamation_count'],
                'question_count': features['question_count'],
                'caps_ratio': features['caps_ratio'],
                'urgency_words': misinformation_indicators['urgency_words'],
                'conspiracy_words': misinformation_indicators['conspiracy_words'],
                'authority_challenge': misinformation_indicators['authority_challenge'],
                'excessive_caps': misinformation_indicators['excessive_caps'],
                'exclamation_overuse': misinformation_indicators['exclamation_overuse'],
                'source': 'nextdoor'
            })
        
        return pd.DataFrame(processed_data)
    
    def analyze_data(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Analyze the processed data"""
        analysis = {
            'total_posts': len(df),
            'sentiment_distribution': df['sentiment'].value_counts().to_dict(),
            'category_distribution': df['category'].value_counts().head(10).to_dict(),
            'source_distribution': df['source'].value_counts().to_dict(),
            'avg_length': df['length'].mean(),
            'avg_word_count': df['word_count'].mean(),
            'misinformation_indicators': {
                'high_urgency': len(df[df['urgency_words'] > 2]),
                'conspiracy_mentions': len(df[df['conspiracy_words'] > 0]),
                'authority_challenges': len(df[df['authority_challenge'] > 0]),
                'excessive_caps': len(df[df['excessive_caps'] > 0]),
                'exclamation_overuse': len(df[df['exclamation_overuse'] > 0])
            }
        }
        
        return analysis
    
    def generate_analysis_report(self, analysis: Dict[str, Any], output_file: str):
        """Generate a detailed analysis report"""
        report = f"""
# Community Data Analysis Report
Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

## Dataset Overview
- Total Posts: {analysis['total_posts']:,}
- Average Length: {analysis['avg_length']:.1f} characters
- Average Word Count: {analysis['avg_word_count']:.1f} words

## Sentiment Distribution
"""
        
        for sentiment, count in analysis['sentiment_distribution'].items():
            percentage = (count / analysis['total_posts']) * 100
            report += f"- {sentiment.capitalize()}: {count:,} ({percentage:.1f}%)\n"
        
        report += f"""
## Source Distribution
"""
        
        for source, count in analysis['source_distribution'].items():
            percentage = (count / analysis['total_posts']) * 100
            report += f"- {source.capitalize()}: {count:,} ({percentage:.1f}%)\n"
        
        report += f"""
## Top Categories
"""
        
        for category, count in analysis['category_distribution'].items():
            percentage = (count / analysis['total_posts']) * 100
            report += f"- {category}: {count:,} ({percentage:.1f}%)\n"
        
        report += f"""
## Misinformation Indicators
- High Urgency Posts: {analysis['misinformation_indicators']['high_urgency']:,}
- Conspiracy Mentions: {analysis['misinformation_indicators']['conspiracy_mentions']:,}
- Authority Challenges: {analysis['misinformation_indicators']['authority_challenges']:,}
- Excessive Caps: {analysis['misinformation_indicators']['excessive_caps']:,}
- Exclamation Overuse: {analysis['misinformation_indicators']['exclamation_overuse']:,}

## Recommendations
1. Use this data to train sentiment analysis models
2. Focus on posts with high misinformation indicators for detection training
3. Balance the dataset if sentiment distribution is uneven
4. Consider source-specific preprocessing for better results
"""
        
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(report)
        
        print(f"Analysis report saved to {output_file}")
    
    def save_processed_data(self, df: pd.DataFrame, filename: str):
        """Save processed data to CSV"""
        filepath = os.path.join(self.processed_dir, filename)
        df.to_csv(filepath, index=False, encoding='utf-8')
        print(f"Processed data saved to {filepath}")
    
    def create_training_dataset(self, df: pd.DataFrame, output_file: str):
        """Create a training dataset for the CommunityPulse models"""
        # Select relevant columns for training
        training_data = df[['content', 'sentiment', 'category', 'urgency_words', 
                           'conspiracy_words', 'authority_challenge', 'excessive_caps', 
                           'exclamation_overuse', 'length', 'word_count']].copy()
        
        # Add binary labels for misinformation detection
        training_data['misinformation_risk'] = (
            (training_data['urgency_words'] > 2) |
            (training_data['conspiracy_words'] > 0) |
            (training_data['authority_challenge'] > 0) |
            (training_data['excessive_caps'] > 0) |
            (training_data['exclamation_overuse'] > 0)
        ).astype(int)
        
        # Save training dataset
        filepath = os.path.join(self.processed_dir, output_file)
        training_data.to_csv(filepath, index=False, encoding='utf-8')
        print(f"Training dataset saved to {filepath}")
        
        return training_data

def main():
    processor = DataProcessor()
    
    print("🚀 Processing community data...")
    
    # Load Reddit data
    print("\n📊 Loading Reddit data...")
    posts_df, comments_df = processor.load_reddit_data()
    
    reddit_processed = None
    if not posts_df.empty or not comments_df.empty:
        reddit_processed = processor.process_reddit_data(posts_df, comments_df)
        print(f"  Processed {len(reddit_processed)} Reddit posts/comments")
    
    # Load NextDoor data
    print("\n🏠 Loading NextDoor data...")
    nextdoor_df = processor.load_nextdoor_data()
    
    nextdoor_processed = None
    if not nextdoor_df.empty:
        nextdoor_processed = processor.process_nextdoor_data(nextdoor_df)
        print(f"  Processed {len(nextdoor_processed)} NextDoor posts")
    
    # Combine all data
    all_data = []
    if reddit_processed is not None:
        all_data.append(reddit_processed)
    if nextdoor_processed is not None:
        all_data.append(nextdoor_processed)
    
    if not all_data:
        print("❌ No data found to process!")
        return
    
    combined_df = pd.concat(all_data, ignore_index=True)
    print(f"\n✅ Combined dataset: {len(combined_df)} total posts")
    
    # Analyze data
    print("\n📈 Analyzing data...")
    analysis = processor.analyze_data(combined_df)
    
    # Generate report
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    report_file = f"data/analysis/analysis_report_{timestamp}.md"
    processor.generate_analysis_report(analysis, report_file)
    
    # Save processed data
    processor.save_processed_data(combined_df, f"processed_data_{timestamp}.csv")
    
    # Create training dataset
    training_data = processor.create_training_dataset(combined_df, f"training_dataset_{timestamp}.csv")
    
    print(f"\n🎉 Data processing complete!")
    print(f"  Total processed posts: {len(combined_df):,}")
    print(f"  Training samples: {len(training_data):,}")
    print(f"  Analysis report: {report_file}")

if __name__ == "__main__":
    main()