#!/usr/bin/env python3
"""
Generate hello/updates.json from the last 5 git commit timestamps.

This is intended to run before publishing to GitHub Pages so the site can
load same-origin JSON instead of calling the GitHub API from the browser.
"""

import json
import subprocess
from datetime import datetime, timedelta, timezone
from pathlib import Path


OUTPUT_PATH = Path(__file__).with_name("updates.json")


def read_git_timestamps():
    result = subprocess.run(
        ["git", "log", "-5", "--format=%ci"],
        capture_output=True,
        text=True,
        check=False,
    )

    if result.returncode != 0:
        return []

    timestamps = []
    for line in result.stdout.strip().splitlines():
        if line.strip():
            date_part, time_part, tz_part = line.split()[:3]
            timestamps.append(f"{date_part}T{time_part}{tz_part[:3]}:{tz_part[3:]}")

    return timestamps


def fallback_timestamps():
    now = datetime.now(timezone.utc)
    return [
        (now - timedelta(minutes=index * 12)).strftime("%Y-%m-%dT%H:%M:%SZ")
        for index in range(5)
    ]


def main():
    timestamps = read_git_timestamps() or fallback_timestamps()
    payload = {"updates": [{"timestamp": value} for value in timestamps[:5]]}
    OUTPUT_PATH.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")
    print(f"Updated {OUTPUT_PATH} with {len(payload['updates'])} rows")


if __name__ == "__main__":
    main()
