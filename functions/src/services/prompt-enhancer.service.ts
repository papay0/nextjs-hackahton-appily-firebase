import * as logger from "firebase-functions/logger";
import {OpenRouterService} from "./openrouter.service";
import {EnhancedPromptResponse} from "../models/prompt.model";

/**
 * Core function to enhance a prompt using AI
 * @param prompt - The user's original prompt
 * @param modelKey - The OpenRouter model to use
 * @returns Enhanced prompt response
 */
export async function enhancePromptCore(prompt: string, modelKey?: string): Promise<EnhancedPromptResponse> {
  try {
    // Log the incoming request
    logger.info("Enhancing prompt", {prompt});

    // Validate input
    if (!prompt) {
      throw new Error("Prompt is required");
    }

    // Initialize the OpenRouter service
    const openRouterService = new OpenRouterService();

    // Get the model to use (could be configurable via environment variable)
    const modelToUse = modelKey || process.env.OPENROUTER_MODEL || "openai/gpt-4.1-nano";

    // Enhance the prompt
    const enhancedPrompt = await openRouterService.enhancePrompt(
      prompt,
      modelToUse
    );

    // Log success
    logger.info("Successfully enhanced prompt", {
      originalPromptLength: prompt.length,
      enhancedItemsCount: enhancedPrompt.enhancedPrompt.length,
    });

    // Return the response
    return enhancedPrompt;

  } catch (error) {
    // Log the error
    logger.error("Error enhancing prompt", {error});

    // Re-throw to be handled by the caller
    throw new Error(`Failed to enhance prompt: ${error instanceof Error ? error.message : String(error)}`);
  }
}
