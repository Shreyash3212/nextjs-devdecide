---
title: "Headless CMS vs. Markdown: Choosing Your Blog Stack"
date: "2026-02-15"
summary: "Should you build your developer blog using local MDX files, or invest in a full headless CMS like Sanity or Payload?"
---

## The Content Dilemma
You've decided to use Next.js for your frontend. Now, where do your words actually live? 

### The Case for Markdown (MDX)
For solo developers and technical founders, **Markdown is king**. 
* **Version Control:** Your content lives in Git alongside your code.
* **Zero Cost:** No database or third-party subscriptions required.
* **Developer Ergonomics:** You can write in VS Code.

### The Case for a Headless CMS
If you have a marketing team, non-technical writers, or highly relational data (like a complex directory of SaaS comparisons), Markdown quickly becomes a nightmare. Tools like **Payload CMS** or **Sanity** provide:
* A visual editing dashboard for non-devs.
* Granular user permissions.
* API-driven relationships between content types.

```javascript
// Fetching from a Headless CMS usually looks like this
async function getArticle(slug) {
  const res = await fetch(`https://api.yourcms.com/posts?slug=${slug}`, {
    headers: { 'Authorization': `Bearer ${process.env.CMS_TOKEN}` }
  });
  return res.json();
}