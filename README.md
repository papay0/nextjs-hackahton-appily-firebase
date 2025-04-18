# Appily Firebase

A powerful TypeScript coding agent that uses AI to generate and modify Next.js web projects based on natural language prompts. Built for both local development and cloud deployment.

Two ways to access the code generation experience:
1. Through the web app, available on https://www.appily.dev
2. Via the native mobile app, I just submitted to the App Store so it can take a few days.

## TLDR for the hackathon, if you should read one thing:

- The user enters a prompt, it will get enhanced with a checklist to refine the features
- This agent receives this enhanced prompt
- then it will git clone this Next.js template: [https://github.com/papay0/appily-template-next-js](https://github.com/papay0/appily-template-next-js)
- do 5 loops of code generation with LLM like
```
while (npm run build !== success && number of try <= 5) {
    new project files = await llm.send(files)
      .streamToFirebase()
    npm run lint --fix // just to fix the most basic warnings
    numner of try += 1
}
```
- upload the `out/` directory to R2 (Cloudflare)
- upload everything to firebase to that so that the web and mobile native client can have the streaming of the code gen, logs, messages, and metadata

## Demo

### Mobile

[![IMAGE ALT TEXT](http://img.youtube.com/vi/YMkLgnCzAD0/0.jpg)](http://www.youtube.com/watch?v=YMkLgnCzAD0 "
Appily mobile demo")

### Web

[![IMAGE ALT TEXT](http://img.youtube.com/vi/FRugepeYY9g/0.jpg)](http://www.youtube.com/watch?v=FRugepeYY9g "
Appily web demo")

## Link of the 4 repos
- [Appily-agent](https://github.com/papay0/nextjs-hackahton-appily-agent)
- [Appily-expo](https://github.com/papay0/nextjs-hackahton-appily-expo)
- [Appily-next](https://github.com/papay0/nextjs-hackahton-appily-next)
- [Appily-firebase](https://github.com/papay0/nextjs-hackahton-appily-firebase)

## More details

- I'm using Nextjs for the web client, using Shadcn for the UI
- I'm using Expo for the mobile app
- I'm generating Nextjs projects with Appily agent because it looks like it has the best LLM code gen results, and it's the easier to configure Shadcn and Claude Sonnet 3.7 understands it very well.
- I'm using Clerk for authentication with Google Auth
- I have 4 repos to make it works
  - Appily-agent: this one, hosted on a Google Cloud Run environment that auto-scales with amount of users
  - Appily-expo: the Expo mobile app code
  - Appily-next: the web client, with landing page + code gen
  - Appily-firebase: for Cloud Functions to enhance the prompt from the user
- I was initially using the AI SDK but found that it was hard to get good error handlings, too generic, and didn't find a good way to understand all the different errors from different models, so I switched to OpenRouter implementation using the OpenAI SDK