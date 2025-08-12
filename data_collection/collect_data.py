#!/usr/bin/env python3
"""
Community Data Collection Orchestrator
Main script to collect and process community data for CommunityPulse training
"""

import os
import sys
import time
from datetime import datetime
import argparse

def print_banner():
    """Print the CommunityPulse data collection banner"""
    banner = """
    ╔══════════════════════════════════════════════════════════════╗
    ║                    CommunityPulse                            ║
    ║              Community Data Collection                       ║
    ║                                                              ║
    ║  Collecting Reddit posts and generating NextDoor-style      ║
    ║  content for AI training and analysis                       ║
    ╚══════════════════════════════════════════════════════════════╝
    """
    print(banner)

def check_dependencies():
    """Check if required dependencies are installed"""
    required_packages = [
        'requests', 'pandas', 'numpy', 'matplotlib', 'seaborn'
    ]
    
    missing_packages = []
    
    for package in required_packages:
        try:
            __import__(package)
        except ImportError:
            missing_packages.append(package)
    
    if missing_packages:
        print(f"❌ Missing required packages: {', '.join(missing_packages)}")
        print("Install them with: pip install " + " ".join(missing_packages))
        return False
    
    print("✅ All required dependencies are installed")
    return True

def run_reddit_scraper():
    """Run the Reddit scraper"""
    print("\n🔴 Collecting Reddit data...")
    
    try:
        from reddit_scraper import RedditScraper
        
        scraper = RedditScraper()
        posts, comments = scraper.collect_data(posts_per_subreddit=30, comments_per_post=10)
        
        if posts or comments:
            print(f"✅ Reddit collection complete: {len(posts)} posts, {len(comments)} comments")
            return True
        else:
            print("⚠️  No Reddit data collected (this is normal if rate limited)")
            return True
            
    except Exception as e:
        print(f"❌ Reddit collection failed: {e}")
        return False

def run_nextdoor_generator():
    """Run the NextDoor generator"""
    print("\n🏠 Generating NextDoor-style content...")
    
    try:
        from nextdoor_generator import NextDoorGenerator
        
        generator = NextDoorGenerator()
        posts = generator.generate_dataset(500)  # Generate 500 posts
        
        if posts:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            generator.save_to_csv(posts, f"nextdoor_posts_{timestamp}.csv")
            generator.save_to_json(posts, f"nextdoor_posts_{timestamp}.json")
            
            print(f"✅ NextDoor generation complete: {len(posts)} posts")
            return True
        else:
            print("❌ NextDoor generation failed")
            return False
            
    except Exception as e:
        print(f"❌ NextDoor generation failed: {e}")
        return False

def run_data_processor():
    """Run the data processor"""
    print("\n⚙️  Processing and analyzing data...")
    
    try:
        from data_processor import DataProcessor
        
        processor = DataProcessor()
        
        # Load and process data
        posts_df, comments_df = processor.load_reddit_data()
        nextdoor_df = processor.load_nextdoor_data()
        
        # Process Reddit data
        reddit_processed = None
        if not posts_df.empty or not comments_df.empty:
            reddit_processed = processor.process_reddit_data(posts_df, comments_df)
            print(f"  Processed {len(reddit_processed)} Reddit posts/comments")
        
        # Process NextDoor data
        nextdoor_processed = None
        if not nextdoor_df.empty:
            nextdoor_processed = processor.process_nextdoor_data(nextdoor_df)
            print(f"  Processed {len(nextdoor_processed)} NextDoor posts")
        
        # Combine data
        all_data = []
        if reddit_processed is not None:
            all_data.append(reddit_processed)
        if nextdoor_processed is not None:
            all_data.append(nextdoor_processed)
        
        if not all_data:
            print("❌ No data to process!")
            return False
        
        combined_df = processor.combine_data(all_data)
        print(f"  Combined dataset: {len(combined_df)} total posts")
        
        # Analyze data
        analysis = processor.analyze_data(combined_df)
        
        # Generate report
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        report_file = f"data/analysis/analysis_report_{timestamp}.md"
        processor.generate_analysis_report(analysis, report_file)
        
        # Save processed data
        processor.save_processed_data(combined_df, f"processed_data_{timestamp}.csv")
        
        # Create training dataset
        training_data = processor.create_training_dataset(combined_df, f"training_dataset_{timestamp}.csv")
        
        print(f"✅ Data processing complete!")
        print(f"  Total processed posts: {len(combined_df):,}")
        print(f"  Training samples: {len(training_data):,}")
        print(f"  Analysis report: {report_file}")
        
        return True
        
    except Exception as e:
        print(f"❌ Data processing failed: {e}")
        return False

def main():
    """Main data collection orchestration"""
    parser = argparse.ArgumentParser(description='CommunityPulse Data Collection')
    parser.add_argument('--reddit-only', action='store_true', help='Only collect Reddit data')
    parser.add_argument('--nextdoor-only', action='store_true', help='Only generate NextDoor data')
    parser.add_argument('--process-only', action='store_true', help='Only process existing data')
    parser.add_argument('--skip-reddit', action='store_true', help='Skip Reddit collection')
    parser.add_argument('--skip-nextdoor', action='store_true', help='Skip NextDoor generation')
    
    args = parser.parse_args()
    
    print_banner()
    
    # Check dependencies
    if not check_dependencies():
        sys.exit(1)
    
    start_time = time.time()
    
    # Create data directories
    os.makedirs('data', exist_ok=True)
    os.makedirs('data/reddit', exist_ok=True)
    os.makedirs('data/nextdoor', exist_ok=True)
    os.makedirs('data/processed', exist_ok=True)
    os.makedirs('data/analysis', exist_ok=True)
    
    success_count = 0
    total_steps = 0
    
    # Determine which steps to run
    run_reddit = not args.skip_reddit and not args.nextdoor_only and not args.process_only
    run_nextdoor = not args.skip_nextdoor and not args.reddit_only and not args.process_only
    run_processing = not args.reddit_only and not args.nextdoor_only
    
    if run_reddit:
        total_steps += 1
    if run_nextdoor:
        total_steps += 1
    if run_processing:
        total_steps += 1
    
    print(f"\n🚀 Starting data collection ({total_steps} steps)...")
    
    # Step 1: Collect Reddit data
    if run_reddit:
        if run_reddit_scraper():
            success_count += 1
        else:
            print("⚠️  Reddit collection failed, continuing with other steps...")
    
    # Step 2: Generate NextDoor data
    if run_nextdoor:
        if run_nextdoor_generator():
            success_count += 1
        else:
            print("❌ NextDoor generation failed")
    
    # Step 3: Process and analyze data
    if run_processing:
        if run_data_processor():
            success_count += 1
        else:
            print("❌ Data processing failed")
    
    # Summary
    elapsed_time = time.time() - start_time
    
    print(f"\n{'='*60}")
    print(f"🎉 Data Collection Summary")
    print(f"{'='*60}")
    print(f"  Steps completed: {success_count}/{total_steps}")
    print(f"  Time elapsed: {elapsed_time:.1f} seconds")
    
    if success_count == total_steps:
        print(f"  Status: ✅ All steps completed successfully!")
    elif success_count > 0:
        print(f"  Status: ⚠️  Partial success ({success_count}/{total_steps} steps)")
    else:
        print(f"  Status: ❌ All steps failed")
    
    print(f"\n📁 Data files created in:")
    print(f"  - data/reddit/     (Reddit posts and comments)")
    print(f"  - data/nextdoor/   (Generated NextDoor content)")
    print(f"  - data/processed/  (Cleaned and processed data)")
    print(f"  - data/analysis/   (Analysis reports)")
    
    print(f"\n📊 Next steps:")
    print(f"  1. Review the analysis report in data/analysis/")
    print(f"  2. Use the training dataset in data/processed/")
    print(f"  3. Train your CommunityPulse AI models")
    print(f"  4. Test with the processed data")
    
    return success_count == total_steps

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)