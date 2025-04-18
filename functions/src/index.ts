/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onRequest, onCall, CallableRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import {enhancePromptCore} from "./services/prompt-enhancer.service";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = onRequest((request, response) => {
  logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

/**
 * Firebase callable function for enhancing prompts
 * For client-side use with Firebase SDK
 */
export const enhancePrompt = onCall<{prompt: string}>(async (request: CallableRequest<{prompt: string}>) => {
  try {
    return await enhancePromptCore(request.data.prompt);
  } catch (error) {
    throw new Error(`Failed to enhance prompt: ${error instanceof Error ? error.message : String(error)}`);
  }
});

/**
 * HTTP GET endpoint for enhancing prompts (for testing)
 * Example URL: https://your-region-your-project.cloudfunctions.net/enhancePromptHttp?prompt=Build%20a%20todo%20app
 */
export const enhancePromptHttp = onRequest(async (request, response) => {
  try {
    // Get prompt from query parameter
    const prompt = request.query.prompt as string;

    if (!prompt) {
      response.status(400).send({error: "Missing prompt parameter"});
      return;
    }

    // Enhance the prompt using the core function
    const result = await enhancePromptCore(prompt);

    // Return the enhanced prompt as JSON
    response.status(200).send(result);
  } catch (error) {
    logger.error("Error in HTTP endpoint", {error});
    response.status(500).send({
      error: "Failed to enhance prompt",
      message: error instanceof Error ? error.message : String(error),
    });
  }
});
