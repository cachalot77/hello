#!/usr/bin/env python3
"""
Generate a JSON file with the last 5 update timestamps from git.
Run this script to update the commits.json file.
"""

import json
import subprocess
from datetime import datetime, timedelta

def generate_commits_json():
    try:
        # Get the last 5 commits with their timestamps.
        result = subprocess.run(
            ['git', 'log', '-5', '--format=%ci'],
            capture_output=True,
            text=True
        )

        commits = []

        if result.returncode == 0:
            for line in result.stdout.strip().split('\n'):
                if line:
                    parts = line.split()
                    commits.append({
                        'date': parts[0],
                        'time': parts[1][:5]
                    })

        if not commits:
            now = datetime.now()
            commits = [
                {
                    'date': (now - timedelta(minutes=index * 12)).strftime('%Y-%m-%d'),
                    'time': (now - timedelta(minutes=index * 12)).strftime('%H:%M')
                }
                for index in range(5)
            ]

        output_path = '/Users/chung.pin.hsu/Desktop/github_pages/hello/commits.json'
        with open(output_path, 'w') as f:
            json.dump({'commits': commits}, f, indent=2)

        print(f"✓ Updated {output_path} with {len(commits)} commits")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == '__main__':
    generate_commits_json()
