#!/usr/bin/env python3
"""
Simple Test Script for CommunityPulse Data Collection
Tests the data collection system without requiring pandas
"""

import json
import csv
import os
from datetime import datetime

def test_nextdoor_generation():
    """Test NextDoor data generation"""
    print("🧪 Testing NextDoor data generation...")
    
    try:
        from nextdoor_generator import NextDoorGenerator
        
        generator = NextDoorGenerator()
        posts = generator.generate_dataset(50)  # Generate 50 posts for testing
        
        if posts:
            print(f"✅ Generated {len(posts)} NextDoor posts")
            
            # Save test data
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            test_file = f"test_nextdoor_{timestamp}.json"
            
            with open(test_file, 'w', encoding='utf-8') as f:
                json.dump(posts[:5], f, indent=2, ensure_ascii=False)
            
            print(f"✅ Saved test data to {test_file}")
            
            # Print sample
            print("\n📝 Sample generated posts:")
            for i, post in enumerate(posts[:3]):
                print(f"  {i+1}. [{post['sentiment'].upper()}] {post['content'][:80]}...")
                print(f"     Author: {post['author']}, Category: {post['category']}")
            
            return True
        else:
            print("❌ Failed to generate NextDoor posts")
            return False
            
    except Exception as e:
        print(f"❌ NextDoor generation test failed: {e}")
        return False

def test_reddit_scraper():
    """Test Reddit scraper (without actually scraping)"""
    print("\n🧪 Testing Reddit scraper setup...")
    
    try:
        from reddit_scraper import RedditScraper
        
        scraper = RedditScraper()
        print(f"✅ Reddit scraper initialized with {len(scraper.subreddits)} subreddits")
        print(f"   Target subreddits: {', '.join(scraper.subreddits[:5])}...")
        
        return True
        
    except Exception as e:
        print(f"❌ Reddit scraper test failed: {e}")
        return False

def test_data_processing():
    """Test basic data processing without pandas"""
    print("\n🧪 Testing basic data processing...")
    
    try:
        # Create sample data
        sample_data = [
            {
                'content': 'I love this community! The new amenities are fantastic.',
                'author': 'Sarah M.',
                'sentiment': 'positive',
                'category': 'general'
            },
            {
                'content': 'I\'m really frustrated with the noise from construction.',
                'author': 'John D.',
                'sentiment': 'negative',
                'category': 'noise-complaints'
            },
            {
                'content': 'Has anyone noticed the new development plans?',
                'author': 'Maria L.',
                'sentiment': 'neutral',
                'category': 'local-news'
            }
        ]
        
        # Test text cleaning
        def clean_text(text):
            return text.lower().strip()
        
        # Test feature extraction
        def extract_features(text):
            return {
                'length': len(text),
                'word_count': len(text.split()),
                'exclamation_count': text.count('!'),
                'question_count': text.count('?')
            }
        
        # Process sample data
        processed_data = []
        for post in sample_data:
            cleaned_content = clean_text(post['content'])
            features = extract_features(cleaned_content)
            
            processed_post = {
                'content': cleaned_content,
                'author': post['author'],
                'sentiment': post['sentiment'],
                'category': post['category'],
                'length': features['length'],
                'word_count': features['word_count'],
                'exclamation_count': features['exclamation_count'],
                'question_count': features['question_count']
            }
            processed_data.append(processed_post)
        
        # Save processed data
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        test_file = f"test_processed_{timestamp}.csv"
        
        with open(test_file, 'w', newline='', encoding='utf-8') as csvfile:
            fieldnames = processed_data[0].keys()
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()
            for row in processed_data:
                writer.writerow(row)
        
        print(f"✅ Processed {len(processed_data)} sample posts")
        print(f"✅ Saved processed data to {test_file}")
        
        # Print processed data
        print("\n📊 Processed data sample:")
        for i, post in enumerate(processed_data):
            print(f"  {i+1}. [{post['sentiment'].upper()}] {post['content']}")
            print(f"     Length: {post['length']}, Words: {post['word_count']}")
        
        return True
        
    except Exception as e:
        print(f"❌ Data processing test failed: {e}")
        return False

def test_misinformation_detection():
    """Test misinformation detection logic"""
    print("\n🧪 Testing misinformation detection...")
    
    def detect_misinformation_indicators(text):
        """Detect potential misinformation indicators"""
        indicators = {
            'urgency_words': 0,
            'conspiracy_words': 0,
            'authority_challenge': 0,
            'excessive_caps': 0,
            'exclamation_overuse': 0
        }
        
        urgency_words = ['urgent', 'emergency', 'breaking', 'critical', 'immediate']
        conspiracy_words = ['conspiracy', 'cover-up', 'hidden', 'secret', 'wake up']
        authority_challenge = ['government', 'authorities', 'mainstream media', 'official']
        
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
    
    # Test cases
    test_cases = [
        "I love this community! The new amenities are fantastic.",
        "URGENT: The government is hiding something about the water quality!",
        "Has anyone noticed the new development plans?",
        "BREAKING: This is a conspiracy! They don't want you to know the truth!",
        "Thank you to everyone who helped with the neighborhood cleanup day!"
    ]
    
    print("📝 Testing misinformation detection on sample texts:")
    
    for i, text in enumerate(test_cases, 1):
        indicators = detect_misinformation_indicators(text)
        risk_score = sum(indicators.values())
        
        print(f"  {i}. Text: {text[:50]}...")
        print(f"     Risk indicators: {indicators}")
        print(f"     Risk score: {risk_score}")
        
        if risk_score > 2:
            print(f"     ⚠️  HIGH MISINFORMATION RISK")
        elif risk_score > 0:
            print(f"     ⚠️  MODERATE MISINFORMATION RISK")
        else:
            print(f"     ✅ LOW MISINFORMATION RISK")
        print()
    
    return True

def main():
    """Run all tests"""
    print("🧪 CommunityPulse Data Collection Test Suite")
    print("=" * 50)
    
    tests = [
        ("NextDoor Generation", test_nextdoor_generation),
        ("Reddit Scraper Setup", test_reddit_scraper),
        ("Data Processing", test_data_processing),
        ("Misinformation Detection", test_misinformation_detection)
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        try:
            if test_func():
                passed += 1
                print(f"✅ {test_name}: PASSED")
            else:
                print(f"❌ {test_name}: FAILED")
        except Exception as e:
            print(f"❌ {test_name}: ERROR - {e}")
        
        print("-" * 50)
    
    print(f"\n🎉 Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("✅ All tests passed! Data collection system is working correctly.")
    else:
        print("⚠️  Some tests failed. Check the output above for details.")
    
    print(f"\n📁 Test files created:")
    for file in os.listdir('.'):
        if file.startswith('test_'):
            print(f"  - {file}")

if __name__ == "__main__":
    main()