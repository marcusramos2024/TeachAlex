import axios from 'axios';
import { ExtractConceptsResponse, SendMessageResponse } from '../types';

const API_BASE_URL = 'http://127.0.0.1:5000';

// Storage keys
const FILE_UPLOADED_KEY = 'teachalex_file_uploaded';

/**
 * Service for handling API requests to the backend
 */
export const apiService = {
  /**
   * Send a message to the conversation controller
   * @param message - The text message to send
   * @param drawing - Optional base64 encoded drawing data
   * @param conversationId - ID of the conversation to retrieve
   * @returns Promise with the response data
   */
  sendMessage: async (message: string, drawing: string | null = null, conversationId: string): Promise<SendMessageResponse> => {
    try {
      const response = await axios.post<SendMessageResponse>(`${API_BASE_URL}/conversation/input`, {
        message,
        drawing,
        conversation_id: conversationId
      });
      return response.data;
    } catch (error) {
      console.error('Error sending message to backend:', error);
      throw error;
    }
  },

  /**
   * Upload a file to the backend to extract text
   * @param file - The file to upload
   * @returns Promise with the conversation ID
   */
  uploadFile: async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axios.post(`${API_BASE_URL}/extract/text`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Store that a file has been uploaded
      localStorage.setItem(FILE_UPLOADED_KEY, 'true');
      
      return response.data;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  },

  /**
   * Extract concepts using the conversation ID
   * @param conversationId - The ID returned from extract/text
   * @returns Promise with the concepts data and initial message
   */
  extractConcepts: async (conversationId: string): Promise<ExtractConceptsResponse> => {
    try {
      const formData = new FormData();
      formData.append('id', conversationId);
      
      const response = await axios.post<ExtractConceptsResponse>(`${API_BASE_URL}/extract/concepts`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('Error extracting concepts:', error);
      throw error;
    }
  },
  
  /**
   * Check if a file has been uploaded
   * @returns boolean indicating if a file has been uploaded
   */
  isFileUploaded: () => {
    return localStorage.getItem(FILE_UPLOADED_KEY) === 'true';
  },
  
  /**
   * Reset the file uploaded status
   */
  resetFileUploadStatus: () => {
    localStorage.removeItem(FILE_UPLOADED_KEY);
  }
};

export default apiService; 