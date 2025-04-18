import OpenAI from "openai";
import * as logger from "firebase-functions/logger";
import {EnhancedPromptResponse} from "../models/prompt.model";

export class OpenRouterService {
  private openai: OpenAI;

  constructor() {
    // Check for API key
    if (!process.env.OPENROUTER_API_KEY) {
      throw new Error("OPENROUTER_API_KEY not set");
    }

    // Initialize OpenAI client
    this.openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
      defaultHeaders: {
        "HTTP-Referer": "www.appily.dev",
        "X-Title": "Appily",
      },
    });
  }

  getOpenAI() {
    return this.openai;
  }

  async enhancePrompt(prompt: string, modelKey: string = "openai/gpt-4.1-nano"): Promise<EnhancedPromptResponse> {
    try {
      // Log the API call we're about to make
      logger.info("Making OpenRouter API call", {
        model: modelKey,
        prompt,
      });

      // Call the OpenRouter API with structured output
      const result = await this.openai.chat.completions.create({
        model: modelKey,
        messages: [{
          role: "user",
          content: `You are FeatureAnalyzerGPT, an expert at breaking down app and software concepts into their core components.

Given this request: "${prompt}", analyze it and break it down into essential and optional features. Also determine what device permissions the app might need.

Guidelines:
1. Only include features that are directly related to the core purpose
2. Do not assume complex requirements unless explicitly stated
3. Do not assume authentication or user accounts are needed unless explicitly mentioned
4. Focus on basic functionality first, then add advanced options as optional
5. Mark only truly essential features as checked=true, the rest as checked=false
6. Keep the list focused and practical - aim for 5-8 core features and 3-5 optional ones
7. For permissions, only include those that are clearly needed based on the app description

For the project summary:
- Create a clear, descriptive summary that explains what the project is
- Focus on clarity rather than creativity - it should be immediately clear what the project does
- Use specific, functional descriptions like "Todo App with Reminders" or "Expense Tracker with Alerts"
- Keep it concise but informative (3-6 words)
- Make sure it's easy to identify the project's purpose at a glance

Available permissions to consider (only include those that are necessary):
- camera: For taking photos or video
- microphone: For audio recording or voice commands
- location: For geolocation features
- contacts: For accessing the user's contact list
- storage: For saving files to device
- notifications: For sending alerts to the user
- calendar: For scheduling or calendar integration
- motion: For detecting device movement or orientation
- healthData: For health metrics
- bluetooth: For connecting to other devices
- nfc: For contactless communication
- faceId: For facial recognition authentication
- touchId: For fingerprint authentication
- speechRecognition: For voice-to-text
- backgroundRefresh: For updating when app is not active

Return ONLY a JSON object with these properties:
- projectSummary: A clear, descriptive summary of what the project is
- enhancedPrompt: An array of objects with these properties:
  - displayContent: A short title for the feature (3-5 words)
  - content: A detailed description of what this feature does (1-2 sentences)
  - checked: A boolean indicating if this is an essential feature (true) or optional feature (false)
- requiredPermissions: An array of strings with the permission keys needed (e.g. ["camera", "microphone"])`,
        }],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "enhancedPrompt",
            strict: true,
            schema: {
              type: "object",
              properties: {
                projectSummary: {
                  type: "string",
                  description: "Clear, descriptive summary of the project's purpose",
                },
                enhancedPrompt: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      displayContent: {
                        type: "string",
                        description: "Feature title",
                      },
                      content: {
                        type: "string",
                        description: "Feature description",
                      },
                      checked: {
                        type: "boolean",
                        description: "Whether this is a core feature",
                      },
                    },
                    required: ["displayContent", "content", "checked"],
                    additionalProperties: false,
                  },
                },
                requiredPermissions: {
                  type: "array",
                  items: {
                    type: "string",
                    enum: ["camera", "microphone", "location", "contacts", "storage", "notifications", "calendar", "motion", "healthData", "bluetooth", "nfc", "faceId", "touchId", "speechRecognition", "backgroundRefresh"],
                  },
                  description: "List of permissions the app will need",
                },
              },
              required: ["projectSummary", "enhancedPrompt", "requiredPermissions"],
              additionalProperties: false,
            },
          },
        },
      });

      // Log the API response structure
      logger.info("Received OpenRouter API response", {
        hasChoices: !!result.choices,
        choicesLength: result.choices?.length,
      });

      // Handle missing choices array
      if (!result.choices || result.choices.length === 0) {
        throw new Error("No choices returned from OpenRouter API");
      }

      // Handle missing content
      if (!result.choices[0].message.content) {
        throw new Error("No content returned from OpenRouter");
      }

      // Parse the JSON response
      try {
        const parsedResponse = JSON.parse(result.choices[0].message.content) as EnhancedPromptResponse;

        // Validate the parsed response
        if (!Array.isArray(parsedResponse.enhancedPrompt) || !Array.isArray(parsedResponse.requiredPermissions)) {
          throw new Error("Invalid response structure from OpenRouter");
        }

        // Add the original prompt to the response object
        parsedResponse.originalPrompt = prompt;

        return parsedResponse;
      } catch (parseError) {
        // Handle JSON parsing errors
        logger.error("Failed to parse OpenRouter response", {
          error: parseError,
        });
        throw new Error(`Failed to parse OpenRouter response: ${parseError instanceof Error ? parseError.message : String(parseError)}`);
      }
    } catch (error) {
      // Handle API call errors
      logger.error("Error calling OpenRouter API", {
        error,
        errorMessage: error instanceof Error ? error.message : String(error),
        modelKey,
      });

      throw error;
    }
  }
}
