#!/usr/bin/env python3
"""
Reddit Community Data Scraper
Collects community-related posts from various subreddits for training
"""

import requests
import json
import time
import csv
from datetime import datetime, timedelta
import os
from typing import List, Dict, Any
import random

class RedditScraper:
    def __init__(self):
        self.base_url = "https://www.reddit.com"
        self.headers = {
            'User-Agent': 'CommunityPulse-DataCollector/1.0 (Educational Research)'
        }
        
        # Community-related subreddits
        self.subreddits = [
            'HOA', 'apartmentliving', 'neighbors', 'homeowners',
            'PropertyManagement', 'RealEstate', 'community',
            'neighborhoodwatch', 'apartments', 'condos'
        ]
        
        # Create data directory
        os.makedirs('data', exist_ok=True)
        os.makedirs('data/reddit', exist_ok=True)
    
    def get_subreddit_posts(self, subreddit: str, limit: int = 100) -> List[Dict[str, Any]]:
        """Fetch posts from a subreddit"""
        url = f"{self.base_url}/r/{subreddit}/hot.json?limit={limit}"
        
        try:
            response = requests.get(url, headers=self.headers, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            posts = []
            
            for post in data['data']['children']:
                post_data = post['data']
                
                # Filter for text posts and self posts
                if post_data.get('is_self', False) and post_data.get('selftext'):
                    posts.append({
                        'id': post_data['id'],
                        'title': post_data['title'],
                        'content': post_data['selftext'],
                        'author': post_data['author'],
                        'subreddit': subreddit,
                        'score': post_data['score'],
                        'upvote_ratio': post_data['upvote_ratio'],
                        'num_comments': post_data['num_comments'],
                        'created_utc': post_data['created_utc'],
                        'url': f"https://reddit.com{post_data['permalink']}"
                    })
            
            return posts
            
        except Exception as e:
            print(f"Error fetching from r/{subreddit}: {e}")
            return []
    
    def get_comments(self, post_id: str, limit: int = 50) -> List[Dict[str, Any]]:
        """Fetch comments from a post"""
        url = f"{self.base_url}/comments/{post_id}.json?limit={limit}"
        
        try:
            response = requests.get(url, headers=self.headers, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            comments = []
            
            if len(data) > 1:  # Comments are in the second element
                comment_data = data[1]['data']['children']
                
                for comment in comment_data:
                    if comment['kind'] == 't1':  # Regular comment
                        comment_body = comment['data']
                        if comment_body.get('body') and len(comment_body['body']) > 10:
                            comments.append({
                                'id': comment_body['id'],
                                'content': comment_body['body'],
                                'author': comment_body['author'],
                                'score': comment_body['score'],
                                'created_utc': comment_body['created_utc'],
                                'parent_id': post_id
                            })
            
            return comments
            
        except Exception as e:
            print(f"Error fetching comments for {post_id}: {e}")
            return []
    
    def save_to_csv(self, data: List[Dict[str, Any]], filename: str):
        """Save data to CSV file"""
        if not data:
            print(f"No data to save for {filename}")
            return
        
        filepath = f"data/reddit/{filename}"
        with open(filepath, 'w', newline='', encoding='utf-8') as csvfile:
            fieldnames = data[0].keys()
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            
            writer.writeheader()
            for row in data:
                writer.writerow(row)
        
        print(f"Saved {len(data)} records to {filepath}")
    
    def collect_data(self, posts_per_subreddit: int = 50, comments_per_post: int = 20):
        """Collect posts and comments from all subreddits"""
        all_posts = []
        all_comments = []
        
        print("🚀 Starting Reddit data collection...")
        print(f"Targeting {len(self.subreddits)} subreddits")
        
        for subreddit in self.subreddits:
            print(f"\n📊 Collecting from r/{subreddit}...")
            
            # Get posts
            posts = self.get_subreddit_posts(subreddit, posts_per_subreddit)
            all_posts.extend(posts)
            
            print(f"  Found {len(posts)} posts")
            
            # Get comments for each post
            for post in posts[:5]:  # Limit to avoid rate limiting
                comments = self.get_comments(post['id'], comments_per_post)
                all_comments.extend(comments)
                
                print(f"  Found {len(comments)} comments for post {post['id']}")
                
                # Rate limiting
                time.sleep(1)
            
            # Rate limiting between subreddits
            time.sleep(2)
        
        # Save data
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        if all_posts:
            self.save_to_csv(all_posts, f"reddit_posts_{timestamp}.csv")
        
        if all_comments:
            self.save_to_csv(all_comments, f"reddit_comments_{timestamp}.csv")
        
        print(f"\n✅ Data collection complete!")
        print(f"  Total posts: {len(all_posts)}")
        print(f"  Total comments: {len(all_comments)}")
        
        return all_posts, all_comments

def main():
    scraper = RedditScraper()
    posts, comments = scraper.collect_data()
    
    # Print sample data
    if posts:
        print("\n📝 Sample Post:")
        sample_post = posts[0]
        print(f"  Title: {sample_post['title']}")
        print(f"  Content: {sample_post['content'][:200]}...")
        print(f"  Subreddit: r/{sample_post['subreddit']}")
        print(f"  Score: {sample_post['score']}")
    
    if comments:
        print("\n💬 Sample Comment:")
        sample_comment = comments[0]
        print(f"  Content: {sample_comment['content'][:200]}...")
        print(f"  Score: {sample_comment['score']}")

if __name__ == "__main__":
    main()