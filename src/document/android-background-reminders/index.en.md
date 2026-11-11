---
title: Android background new-post alerts
slug: android-background-reminders
language: en
date: 2026-11-11
excerpt: Choose which forums DisFly checks for new public posts in the background on Android.
---

<!-- Adapted from the user guide in discuz_flutter/docs/android_background_new_posts.md at 6cf8954. -->

On Android, DisFly can check selected forums for new public posts in the background. The main switch and each forum’s switch are off by default.

## Turn on alerts

1. In DisFly, open **Settings → Background new-post alerts**.
2. Turn on the main switch and allow notifications when Android prompts you.
3. Choose which of your added Discuz forums should send alerts.

The first successful check records which posts are already present. Later checks notify you about new posts. DisFly groups new posts from the same forum into one notification per check. Tap it to open the newest of those posts.

## When checks run

Android aims to run a check every hour. The device needs to be online, idle, and sufficiently charged. Android may defer a check. If you force-stop DisFly, reopen it to resume enabled checks.

Turning alerts back on records a fresh starting point. DisFly skips notifications for posts published while alerts were off. On a high-traffic forum, one check may miss some new posts.

## What DisFly can check

Background checks read public posts as a guest. They do not use account cookies or a signed-in session, so posts that require a login are outside the scope of these alerts.
