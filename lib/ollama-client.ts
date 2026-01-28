// Ollama API client for local LLM inference (text and vision)

interface OllamaMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
  images?: string[]; // Base64 encoded images for vision models
}

interface OllamaResponse {
  model: string;
  message: {
    role: string;
    content: string;
  };
  done: boolean;
}

export class OllamaClient {
  private baseUrl: string;
  private textModel: string;
  private visionModel: string;

  constructor() {
    this.baseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
    this.textModel = process.env.OLLAMA_MODEL || 'qwen2.5:32b';
    this.visionModel = process.env.OLLAMA_VISION_MODEL || 'llava:13b';
  }

  async chat(
    messages: OllamaMessage[],
    options: {
      temperature?: number;
      maxTokens?: number;
      timeoutMs?: number;
      useVision?: boolean;
    } = {}
  ): Promise<string> {
    const {
      temperature = 0.3,
      maxTokens = 8192,
      timeoutMs = 600000,
      useVision = false,
    } = options;

    const model = useVision ? this.visionModel : this.textModel;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(`${this.baseUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          messages,
          stream: false,
          format: useVision ? undefined : 'json', // Vision models don't always support JSON mode
          options: {
            temperature,
            num_predict: maxTokens,
          },
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
      }

      const data: OllamaResponse = await response.json();
      return data.message.content;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Ollama request timed out. Try a smaller model or shorter text.');
      }
      throw error;
    }
  }

  /**
   * Process an image with a vision model
   */
  async analyzeImage(
    imageBase64: string,
    prompt: string,
    options: { temperature?: number; maxTokens?: number; timeoutMs?: number } = {}
  ): Promise<string> {
    return this.chat(
      [
        {
          role: 'user',
          content: prompt,
          images: [imageBase64],
        },
      ],
      { ...options, useVision: true }
    );
  }

  /**
   * Process multiple images with a vision model
   */
  async analyzeImages(
    imagesBase64: string[],
    prompt: string,
    options: { temperature?: number; maxTokens?: number; timeoutMs?: number } = {}
  ): Promise<string> {
    return this.chat(
      [
        {
          role: 'user',
          content: prompt,
          images: imagesBase64,
        },
      ],
      { ...options, useVision: true }
    );
  }

  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      return response.ok;
    } catch {
      return false;
    }
  }

  async hasVisionModel(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      if (!response.ok) return false;
      const data = await response.json();
      const models = data.models?.map((m: { name: string }) => m.name) || [];
      return models.some((name: string) =>
        name.includes('llava') ||
        name.includes('bakllava') ||
        name.includes('moondream') ||
        name.includes('minicpm-v')
      );
    } catch {
      return false;
    }
  }
}

export const ollama = new OllamaClient();
