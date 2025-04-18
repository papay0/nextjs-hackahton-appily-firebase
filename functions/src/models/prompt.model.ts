export enum AppPermission {
  CAMERA = "camera",
  MICROPHONE = "microphone",
  LOCATION = "location",
  CONTACTS = "contacts",
  STORAGE = "storage",
  NOTIFICATIONS = "notifications",
  CALENDAR = "calendar",
  MOTION = "motion",
  HEALTH_DATA = "healthData",
  BLUETOOTH = "bluetooth",
  NFC = "nfc",
  FACE_ID = "faceId",
  TOUCH_ID = "touchId",
  SPEECH_RECOGNITION = "speechRecognition",
  BACKGROUND_REFRESH = "backgroundRefresh"
}

export interface EnhancedPromptItem {
  displayContent: string; // Short title shown in UI checkbox
  content: string; // Detailed description of the enhancement
  checked: boolean; // Whether this item should be pre-selected
}

export interface EnhancedPromptResponse {
  originalPrompt: string; // Original user prompt
  projectSummary: string;
  enhancedPrompt: EnhancedPromptItem[];
  requiredPermissions: AppPermission[]; // Permissions needed for the app
}
