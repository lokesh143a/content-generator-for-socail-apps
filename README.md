This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.  


POC for this project

POC Completed: AI-Powered Social Media Content Generator 🚀

Built a simple frontend application using Next.js, React, TypeScript, Tailwind CSS, and Gemini API.

Features:
✅ Accepts raw content from users
✅ Generates platform-specific posts for LinkedIn, Instagram, and Twitter/X
✅ Uses prompt engineering to return structured JSON responses
✅ Dynamic UI rendering based on selected platforms
✅ Loading and error handling support

This POC demonstrates how Generative AI can be integrated into frontend applications to automate content creation workflows and improve productivity.

# POC: AI-Powered Social Media Content Generator

## Overview

Created a simple web application that generates social media posts using the Gemini API.

## What it Does

* User enters raw text or a project description.
* User selects one or more platforms (LinkedIn, Instagram, Twitter).
* Gemini AI generates platform-specific content.
* Generated posts are displayed separately for each platform.

## Technologies Used

* Next.js
* React
* TypeScript
* Tailwind CSS
* Gemini API

## Key Implementation

### Generate Dynamic Prompt

```javascript
const systemPrompt = `
Generate social media posts for:
${selectedPlatforms.join(", ")}

Raw Text: "${rawText}"

Return response as JSON.
`;
```

### Call Gemini API

```javascript
const response = await fetch(API_URL, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-goog-api-key": GEMINI_API_KEY,
  },
  body: JSON.stringify({
    contents: [{ parts: [{ text: systemPrompt }] }],
  }),
});
```

### Parse Response

```javascript
const data = await response.json();
const posts = JSON.parse(
  data.candidates[0].content.parts[0].text
);

setGeneratedPosts(posts);
```

## Benefits

* Saves time creating content for multiple platforms.
* Demonstrates AI integration in a frontend application.
* Uses prompt engineering and JSON response handling.

## Outcome

Successfully integrated Gemini API into a React application to generate social media content dynamically based on user input.

