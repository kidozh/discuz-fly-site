---
title: 本机 AI 模型使用声明
slug: intelligence-service
language: zh
date: 2026-11-11
excerpt: 了解谈坛如何在兼容设备上生成帖子摘要和 AI 对话，以及如何管理本机历史。
---

谈坛使用设备上的生成式 AI 模型生成帖子摘要和 AI 对话回复。不同平台调用各自的系统模型，能否使用以应用中「设置 → 智能化」显示的状态为准。

## 使用哪些模型

| 平台 | 模型与使用条件 |
| --- | --- |
| iPhone、iPad 和 Mac | 通过 Apple Foundation Models 框架调用 Apple Intelligence 的本机模型。需要 iOS 26、iPadOS 26 或 macOS 26 及以上版本，并且设备支持、已启用 Apple Intelligence，模型已就绪。 |
| Android | 通过 Google ML Kit Prompt API 调用 Gemini Nano。需要兼容的设备和 Android AICore 支持；如果模型尚未就绪，可以按应用提示下载。 |

模型不可用时，谈坛不会把摘要或对话转发给云端模型。正文翻译有独立的实现和设置：Apple 设备使用系统 Translation 框架，Android 使用 [Google 翻译的设备端模型](../android-translation/)。

## 哪些内容会交给模型

生成摘要时，谈坛把相关帖子或回复的正文交给本机模型。AI 对话使用你提交的问题，以及继续对话所需的近期问答。模型在设备上处理这些内容，谈坛不会为了生成摘要或回复把它们上传到云端。下载系统模型或读取论坛原帖仍可能需要联网。

已完成的 AI 对话保存在应用的本机加密历史中。你可以在「设置 → 智能化 → AI 对话历史」查看、继续或删除单条对话。关闭智能化后，仍可查看或删除已有历史。

## 如何使用生成结果

摘要和回复由模型生成，可能遗漏、误读或编造信息。需要确认细节时请阅读帖子原文，使用或分享生成内容前也请自行核对。

官方资料：[Apple Foundation Models](https://developer.apple.com/documentation/foundationmodels) · [Apple Intelligence 使用要求](https://support.apple.com/zh-cn/121115) · [Google ML Kit Prompt API](https://developers.google.com/ml-kit/genai/prompt/android)
