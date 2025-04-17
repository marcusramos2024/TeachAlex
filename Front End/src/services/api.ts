import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:5000';

/**
 * Service for handling API requests to the backend
 */
export const apiService = {
  /**
   * Send a message to the conversation controller
   * @param message - The text message to send
   * @param drawing - Optional base64 encoded drawing data
   * @returns Promise with the response data
   */
  sendMessage: async (message: string, drawing: string | null = null) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/conversation_controller`, {
        message,
        drawing
      });
      return response.data;
    } catch (error) {
      console.error('Error sending message to backend:', error);
      throw error;
    }
  },

  /**
   * Upload a file to the backend
   * @param file - The file to upload
   * @returns Promise with the response data
   */
  uploadFile: async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }
};

export default apiService; 