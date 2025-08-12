#!/usr/bin/env python3
"""
NextDoor Style Content Generator
Generates realistic community posts similar to NextDoor platform
"""

import random
import json
import csv
from datetime import datetime, timedelta
import os
from typing import List, Dict, Any

class NextDoorGenerator:
    def __init__(self):
        # Community categories
        self.categories = [
            'general', 'crime-safety', 'lost-found', 'recommendations',
            'events', 'classifieds', 'free-stuff', 'neighborhood-watch',
            'local-news', 'pets', 'kids-family', 'elder-care',
            'home-improvement', 'gardening', 'noise-complaints'
        ]
        
        # Sentiment templates
        self.positive_templates = [
            "I just wanted to share how wonderful {topic} has been!",
            "Thank you to everyone who helped with {topic}!",
            "What a great community we have! {topic}",
            "I'm so grateful for {topic} in our neighborhood.",
            "Kudos to {topic} - you're making our community better!",
            "I love how our neighborhood {topic}!",
            "This is why I love living here - {topic}!",
            "Amazing work on {topic} - thank you!",
            "Our community is the best because of {topic}!",
            "I'm so happy about {topic} - great job everyone!"
        ]
        
        self.negative_templates = [
            "I'm really frustrated with {topic}.",
            "Can we please address {topic}?",
            "This is getting out of hand - {topic}.",
            "I'm concerned about {topic} in our neighborhood.",
            "Something needs to be done about {topic}.",
            "I'm tired of dealing with {topic}.",
            "This {topic} situation is unacceptable.",
            "Why is {topic} still happening?",
            "I'm disappointed with {topic}.",
            "This {topic} is affecting our quality of life."
        ]
        
        self.neutral_templates = [
            "Has anyone noticed {topic}?",
            "I'm wondering about {topic}.",
            "What do you think about {topic}?",
            "I noticed {topic} - any thoughts?",
            "Can someone help me understand {topic}?",
            "I'm curious about {topic}.",
            "Does anyone know about {topic}?",
            "I'm looking for information on {topic}.",
            "What's the deal with {topic}?",
            "I'm trying to figure out {topic}."
        ]
        
        # Community topics
        self.topics = {
            'positive': [
                'the new community garden',
                'the neighborhood cleanup day',
                'the holiday decorations',
                'the local farmers market',
                'the community pool',
                'the walking trails',
                'the neighborhood watch program',
                'the local events',
                'the community center',
                'the playground improvements',
                'the street lighting',
                'the recycling program',
                'the local businesses',
                'the community newsletter',
                'the neighborhood association'
            ],
            'negative': [
                'the noise from construction',
                'the parking situation',
                'the garbage collection schedule',
                'the street maintenance',
                'the neighbor disputes',
                'the security concerns',
                'the maintenance issues',
                'the noise complaints',
                'the property damage',
                'the safety hazards',
                'the communication problems',
                'the rule violations',
                'the late night disturbances',
                'the property maintenance',
                'the community conflicts'
            ],
            'neutral': [
                'the new development plans',
                'the upcoming elections',
                'the zoning changes',
                'the traffic patterns',
                'the school district updates',
                'the utility work',
                'the weather alerts',
                'the local news',
                'the community meetings',
                'the neighborhood changes',
                'the city policies',
                'the local events',
                'the community guidelines',
                'the emergency procedures',
                'the neighborhood history'
            ]
        }
        
        # Author names (realistic community names)
        self.author_names = [
            'Sarah M.', 'John D.', 'Maria L.', 'David K.', 'Lisa R.',
            'Mike T.', 'Emma W.', 'Alex P.', 'Rachel S.', 'Tom B.',
            'Jennifer H.', 'Robert C.', 'Amanda F.', 'Michael S.',
            'Jessica L.', 'Christopher M.', 'Nicole R.', 'Daniel P.',
            'Ashley T.', 'Kevin B.', 'Michelle J.', 'Steven L.',
            'Patricia K.', 'James W.', 'Linda H.', 'William R.',
            'Barbara M.', 'Richard D.', 'Elizabeth S.', 'Joseph C.'
        ]
        
        # Create data directory
        os.makedirs('data', exist_ok=True)
        os.makedirs('data/nextdoor', exist_ok=True)
    
    def generate_positive_post(self) -> Dict[str, Any]:
        """Generate a positive community post"""
        template = random.choice(self.positive_templates)
        topic = random.choice(self.topics['positive'])
        
        content = template.format(topic=topic)
        
        # Add some variety to the content
        if random.random() < 0.3:
            content += f" It's been such a positive experience for everyone involved."
        if random.random() < 0.2:
            content += f" I hope we can continue this great work!"
        
        return {
            'content': content,
            'author': random.choice(self.author_names),
            'category': random.choice(['general', 'events', 'recommendations', 'local-news']),
            'sentiment': 'positive',
            'timestamp': self._generate_timestamp(),
            'likes': random.randint(5, 50),
            'comments': random.randint(0, 15)
        }
    
    def generate_negative_post(self) -> Dict[str, Any]:
        """Generate a negative community post"""
        template = random.choice(self.negative_templates)
        topic = random.choice(self.topics['negative'])
        
        content = template.format(topic=topic)
        
        # Add some variety to the content
        if random.random() < 0.4:
            content += f" This has been going on for too long."
        if random.random() < 0.3:
            content += f" Can we please find a solution?"
        if random.random() < 0.2:
            content += f" I'm at my wit's end with this."
        
        return {
            'content': content,
            'author': random.choice(self.author_names),
            'category': random.choice(['crime-safety', 'noise-complaints', 'general', 'neighborhood-watch']),
            'sentiment': 'negative',
            'timestamp': self._generate_timestamp(),
            'likes': random.randint(0, 20),
            'comments': random.randint(0, 25)
        }
    
    def generate_neutral_post(self) -> Dict[str, Any]:
        """Generate a neutral community post"""
        template = random.choice(self.neutral_templates)
        topic = random.choice(self.topics['neutral'])
        
        content = template.format(topic=topic)
        
        # Add some variety to the content
        if random.random() < 0.3:
            content += f" Any information would be helpful."
        if random.random() < 0.2:
            content += f" Thanks in advance!"
        
        return {
            'content': content,
            'author': random.choice(self.author_names),
            'category': random.choice(['general', 'local-news', 'events', 'classifieds']),
            'sentiment': 'neutral',
            'timestamp': self._generate_timestamp(),
            'likes': random.randint(0, 15),
            'comments': random.randint(0, 10)
        }
    
    def generate_misinformation_post(self) -> Dict[str, Any]:
        """Generate a post with potential misinformation indicators"""
        misinformation_patterns = [
            "URGENT: {topic} - they don't want you to know this!",
            "BREAKING: {topic} - this is a cover-up!",
            "WARNING: {topic} - the government is hiding something!",
            "ALERT: {topic} - this is a conspiracy!",
            "EMERGENCY: {topic} - they're lying to us!",
            "CRITICAL: {topic} - wake up people!",
            "IMPORTANT: {topic} - don't believe the mainstream media!",
            "ATTENTION: {topic} - this is the truth they don't want you to hear!",
            "NOTICE: {topic} - this is what's really happening!",
            "ALERT: {topic} - the authorities are covering this up!"
        ]
        
        template = random.choice(misinformation_patterns)
        topic = random.choice([
            'the water quality in our area',
            'the new development plans',
            'the local government decisions',
            'the utility company policies',
            'the school district changes',
            'the police department actions',
            'the city council meetings',
            'the environmental regulations',
            'the property tax increases',
            'the community association rules'
        ])
        
        content = template.format(topic=topic)
        
        # Add conspiracy theory elements
        if random.random() < 0.5:
            content += f" Do your own research! Don't trust what they tell you!"
        if random.random() < 0.3:
            content += f" This is just the beginning of what they're hiding!"
        if random.random() < 0.4:
            content += f" Share this with everyone you know!"
        
        return {
            'content': content,
            'author': random.choice(self.author_names),
            'category': random.choice(['crime-safety', 'local-news', 'general', 'neighborhood-watch']),
            'sentiment': 'negative',
            'timestamp': self._generate_timestamp(),
            'likes': random.randint(0, 10),
            'comments': random.randint(0, 30),
            'misinformation_risk': 'high'
        }
    
    def _generate_timestamp(self) -> str:
        """Generate a realistic timestamp within the last 30 days"""
        days_ago = random.randint(0, 30)
        hours_ago = random.randint(0, 23)
        minutes_ago = random.randint(0, 59)
        
        timestamp = datetime.now() - timedelta(
            days=days_ago,
            hours=hours_ago,
            minutes=minutes_ago
        )
        
        return timestamp.strftime('%Y-%m-%d %H:%M:%S')
    
    def generate_dataset(self, num_posts: int = 1000) -> List[Dict[str, Any]]:
        """Generate a complete dataset of community posts"""
        posts = []
        
        # Distribution: 40% positive, 30% negative, 25% neutral, 5% misinformation
        num_positive = int(num_posts * 0.4)
        num_negative = int(num_posts * 0.3)
        num_neutral = int(num_posts * 0.25)
        num_misinformation = int(num_posts * 0.05)
        
        print(f"🚀 Generating NextDoor-style community posts...")
        print(f"  Positive posts: {num_positive}")
        print(f"  Negative posts: {num_negative}")
        print(f"  Neutral posts: {num_neutral}")
        print(f"  Misinformation posts: {num_misinformation}")
        
        # Generate positive posts
        for _ in range(num_positive):
            posts.append(self.generate_positive_post())
        
        # Generate negative posts
        for _ in range(num_negative):
            posts.append(self.generate_negative_post())
        
        # Generate neutral posts
        for _ in range(num_neutral):
            posts.append(self.generate_neutral_post())
        
        # Generate misinformation posts
        for _ in range(num_misinformation):
            posts.append(self.generate_misinformation_post())
        
        # Shuffle the posts
        random.shuffle(posts)
        
        return posts
    
    def save_to_csv(self, data: List[Dict[str, Any]], filename: str):
        """Save data to CSV file"""
        if not data:
            print(f"No data to save for {filename}")
            return
        
        filepath = f"data/nextdoor/{filename}"
        with open(filepath, 'w', newline='', encoding='utf-8') as csvfile:
            # Get all possible fieldnames from all records
            all_fieldnames = set()
            for row in data:
                all_fieldnames.update(row.keys())
            
            fieldnames = sorted(list(all_fieldnames))
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            
            writer.writeheader()
            for row in data:
                # Fill missing fields with empty values
                complete_row = {field: row.get(field, '') for field in fieldnames}
                writer.writerow(complete_row)
        
        print(f"Saved {len(data)} records to {filepath}")
    
    def save_to_json(self, data: List[Dict[str, Any]], filename: str):
        """Save data to JSON file"""
        if not data:
            print(f"No data to save for {filename}")
            return
        
        filepath = f"data/nextdoor/{filename}"
        with open(filepath, 'w', encoding='utf-8') as jsonfile:
            json.dump(data, jsonfile, indent=2, ensure_ascii=False)
        
        print(f"Saved {len(data)} records to {filepath}")

def main():
    generator = NextDoorGenerator()
    
    # Generate dataset
    posts = generator.generate_dataset(1000)
    
    # Save data
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    generator.save_to_csv(posts, f"nextdoor_posts_{timestamp}.csv")
    generator.save_to_json(posts, f"nextdoor_posts_{timestamp}.json")
    
    # Print statistics
    sentiment_counts = {}
    category_counts = {}
    
    for post in posts:
        sentiment = post['sentiment']
        category = post['category']
        
        sentiment_counts[sentiment] = sentiment_counts.get(sentiment, 0) + 1
        category_counts[category] = category_counts.get(category, 0) + 1
    
    print(f"\n📊 Dataset Statistics:")
    print(f"  Total posts: {len(posts)}")
    print(f"  Sentiment distribution:")
    for sentiment, count in sentiment_counts.items():
        print(f"    {sentiment}: {count} ({count/len(posts)*100:.1f}%)")
    
    print(f"  Top categories:")
    sorted_categories = sorted(category_counts.items(), key=lambda x: x[1], reverse=True)
    for category, count in sorted_categories[:5]:
        print(f"    {category}: {count}")
    
    # Print sample posts
    print(f"\n📝 Sample Posts:")
    for i, post in enumerate(posts[:3]):
        print(f"  {i+1}. [{post['sentiment'].upper()}] {post['content'][:100]}...")
        print(f"     Author: {post['author']}, Category: {post['category']}")

if __name__ == "__main__":
    main()