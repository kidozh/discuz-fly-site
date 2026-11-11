---
title: On-device AI model disclosure
slug: intelligence-service
language: en
date: 2026-11-11
excerpt: Learn how DisFly generates summaries and AI chat replies on compatible devices and manages local history.
---

DisFly uses on-device generative AI models to summarize posts and generate replies in AI chat. Each platform uses its own system model. Check the model status in **Settings → Intelligence**.

## Models and availability

| Platform | Model and requirements |
| --- | --- |
| iPhone, iPad, and Mac | DisFly uses the local Apple Intelligence model through Apple’s Foundation Models framework. It requires iOS 26, iPadOS 26, or macOS 26 or later, a compatible device with Apple Intelligence enabled, and a ready model. |
| Android | DisFly uses Gemini Nano through Google’s ML Kit Prompt API. A compatible device with Android AICore support is required. If the model is not ready, follow the download prompt in the app. |

If the model is unavailable, DisFly does not send summaries or conversations to a cloud model. Post translation works separately: Apple devices use the system Translation framework, and Android uses [Google Translate’s on-device models](../android-translation/).

## What the model receives

For summaries, DisFly sends the text of the relevant post or reply to the local model. For AI chat, the model receives the question you submit and recent turns needed to continue the conversation. This processing stays on your device. DisFly does not upload that content to generate summaries or chat replies. Downloading system models and loading forum posts may still require an internet connection.

Completed AI conversations are stored in encrypted history on your device. Go to **Settings → Intelligence → AI chat history** to view, continue, or delete individual conversations. You can still view or delete saved conversations after turning AI off.

## Using AI output

Generated summaries and replies can omit details, misread a post, or invent information. Check the original post for details and review generated text before relying on it or sharing it.

Official references: [Apple Foundation Models](https://developer.apple.com/documentation/foundationmodels) · [Apple Intelligence requirements](https://support.apple.com/en-us/121115) · [Google ML Kit Prompt API](https://developers.google.com/ml-kit/genai/prompt/android)
