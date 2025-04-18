# Appily Firebase Functions

This repository contains Firebase cloud functions for the Appily application.

## Available Functions

### enhancePrompt (Firebase Callable)

The `enhancePrompt` function uses AI to analyze a user prompt and break it down into actionable features or items with pre-selected checkboxes.

#### Input

```typescript
{
  prompt: string; // The user's original prompt text
}
```

#### Output

```typescript
{
  originalPrompt: string;
  enhancedPrompt: [{
    displayContent: string;  // Short title shown in UI checkbox
    content: string;        // Detailed description of the enhancement
    checked: boolean;       // Whether this item should be pre-selected
  }]
}
```

#### Example Client Usage

From a React Native Expo app:

```javascript
import { getFunctions, httpsCallable } from 'firebase/functions';

// Initialize Firebase functions
const functions = getFunctions();
const enhancePromptFunction = httpsCallable(functions, 'enhancePrompt');

// Call the function
try {
  const result = await enhancePromptFunction({ prompt: "Build a todo app" });
  const enhancedData = result.data;
  
  // enhancedData will have the structure:
  // {
  //   originalPrompt: "Build a todo app",
  //   enhancedPrompt: [
  //     { 
  //       displayContent: "Add todo items", 
  //       content: "Create functionality to add new items to the todo list",
  //       checked: true 
  //     },
  //     // ... more features
  //   ]
  // }
  
  console.log(enhancedData);
} catch (error) {
  console.error("Error enhancing prompt:", error);
}
```

### enhancePromptHttp (HTTP GET Endpoint)

This is an HTTP GET endpoint that provides the same functionality as the callable function but can be tested directly in a browser or with tools like curl.

#### URL Format

```
https://[YOUR_REGION]-[YOUR_PROJECT_ID].cloudfunctions.net/enhancePromptHttp?prompt=[YOUR_PROMPT]
```

#### Example Usage

Using curl:
```bash
curl "https://your-region-your-project.cloudfunctions.net/enhancePromptHttp?prompt=Build%20a%20todo%20app"
```

From a browser, just visit:
```
https://your-region-your-project.cloudfunctions.net/enhancePromptHttp?prompt=Build%20a%20todo%20app
```

This will return the same JSON response structure as the callable function.

## Configuration

The function uses the OpenRouter API for prompt enhancement. You need to set the following environment variables:

- `OPENROUTER_API_KEY`: Your OpenRouter API key
- `OPENROUTER_MODEL`: (Optional) The AI model to use, defaults to "openai/gpt-4o"

### Setting Environment Variables

#### For Local Testing

Create a `.env` file in the `functions` directory with the following content:

```
OPENROUTER_API_KEY=your_actual_openrouter_api_key
OPENROUTER_MODEL=openai/gpt-4o
```

When running the Firebase emulator, it will load these environment variables automatically.

#### For Production Deployment

Use the Firebase CLI:

```bash
firebase functions:config:set openrouter.api_key="your-api-key" openrouter.model="openai/gpt-4o"
```

## Troubleshooting

### API Key Issues

If you encounter errors like:
```
Error enhancing prompt: TypeError: Cannot read properties of undefined (reading '0')
```

This typically means the OpenRouter API request failed. Check:

1. Your `OPENROUTER_API_KEY` is valid and correctly set
2. The specified model is available through your OpenRouter subscription
3. Your account has sufficient credits

### Debugging

The function includes extensive logging. To view logs, use:

```bash
firebase functions:log
```

Or when running locally, check the emulator console output. 