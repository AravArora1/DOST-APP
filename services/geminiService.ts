
import { GoogleGenAI, Modality, Type, GenerateContentResponse, Chat } from "@google/genai";

/**
 * Creates a new instance of the GoogleGenAI client.
 * Following guidelines to use process.env.API_KEY directly.
 */
export const createAiClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

/**
 * Utility to convert File to Base64 for API transmission
 */
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Verifies Specialist Credentials via Google Gemini Vision API.
 * This acts as an automated "Neural Auditor" to classify if a degree is genuine.
 */
export const verifySpecialistCredential = async (imageFile: File) => {
  const ai = createAiClient();
  
  try {
    const base64Image = await fileToBase64(imageFile);
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: imageFile.type,
              data: base64Image,
            },
          },
          {
            text: "You are a professional credential verification agent for Dost. Examine this image. Is it a genuine academic degree or medical specialist certificate? Look for institutional seals, signatures, and formal formatting. Return a JSON object with a boolean 'accepted' and a string 'reason'.",
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            accepted: { 
              type: Type.BOOLEAN,
              description: "True if the degree looks authentic and genuine, false otherwise."
            },
            reason: { 
              type: Type.STRING,
              description: "A short reason for the decision."
            },
          },
          required: ["accepted", "reason"],
        },
      },
    });

    const result = JSON.parse(response.text || '{"accepted":false, "reason":"Handshake failed"}');
    
    if (result.accepted) {
      return { success: true, data: result };
    } else {
      // User specifically requested the error "try again!" if not genuine
      return { success: false, error: "try again!" };
    }
  } catch (error) {
    console.error("Credential Processing Error:", error);
    return { success: false, error: "Neural link error. try again!" };
  }
};

/**
 * Executes the Dost Neural Workflow via On-Demand.io for Chat
 */
export const triggerDostWorkflow = async (userMessage: string) => {
  const url = "https://api.on-demand.io/automation/api/workflow/696ad49b8e6b21cb8aea5f02/execute";
  const onDemandKey = "iYlLlPOZkqkrzQXFSetz5wzSR0evLtPL";
  
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "apikey": onDemandKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "inputVariables": {
          "user_message": userMessage
        }
      })
    });

    if (response.ok) {
      const data = await response.json();
      const finalResponse = 
        data.data?.outputVariables?.final_response || 
        data.outputVariables?.final_response || 
        data.output_variables?.final_response ||
        data.data?.message ||
        data.message;
      
      if (finalResponse) return finalResponse;
    }
  } catch (error) {}

  const ai = createAiClient();
  const result = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: userMessage,
    config: {
      systemInstruction: `You are the 'Dost Neural Processor', the core consciousness of a spatial mental hygiene sanctuary. Futuristic, empathetic, clinically precise.`,
    }
  });

  return result.text || "Neural link flickering. Please standby.";
};

/**
 * Maps Grounding to find counsellors nearby
 */
export async function searchCounselorsNearby(lat: number, lng: number) {
  const ai = createAiClient();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Find high-rated mental health counselors and psychology clinics near this location.",
    config: {
      tools: [{ googleMaps: {} }],
      toolConfig: {
        retrievalConfig: {
          latLng: { latitude: lat, longitude: lng }
        }
      }
    },
  });
  return { text: response.text, chunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks || [] };
}

/**
 * AI analysis of clinical screening scores
 */
export async function analyzeScreeningResult(testType: 'GAD7' | 'PHQ9', score: number) {
  const ai = createAiClient();
  const maxScore = testType === 'GAD7' ? 21 : 27;
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze ${testType} score: ${score}/${maxScore}. Return JSON.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          shouldSeeTherapist: { type: Type.BOOLEAN },
          predictionReasoning: { type: Type.STRING },
          severityLabel: { type: Type.STRING },
          breathingExercises: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: { title: { type: Type.STRING }, description: { type: Type.STRING }, duration: { type: Type.STRING } },
              required: ["title", "description", "duration"]
            }
          },
          microHabits: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: { title: { type: Type.STRING }, description: { type: Type.STRING }, category: { type: Type.STRING } },
              required: ["title", "description", "category"]
            }
          }
        },
        required: ["shouldSeeTherapist", "predictionReasoning", "severityLabel", "breathingExercises", "microHabits"]
      }
    }
  });
  return JSON.parse(response.text || '{}');
}

export function createChatSession(): Chat {
  const ai = createAiClient();
  return ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: { systemInstruction: `You are Dost, a world-class AI Therapist.` }
  });
}

export async function moderateMessage(message: string): Promise<{ safe: boolean; reason?: string }> {
  const ai = createAiClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Safe? JSON. Msg: "${message}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: { safe: { type: Type.BOOLEAN }, reason: { type: Type.STRING } },
        required: ["safe"]
      }
    }
  });
  return JSON.parse(response.text || '{"safe":true}');
}

export function encodeAudio(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

export function decodeAudio(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
  return bytes;
}

export async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
  }
  return buffer;
}
