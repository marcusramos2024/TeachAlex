import random
from flask import request, Blueprint, jsonify
from model.providers.OpenAI import OpenAI, Model
from model.Database import Database
conversation_bp = Blueprint('conversation', __name__)

@conversation_bp.route('/conversation/input', methods=['POST'])
def input():
    """
    Main Conversation Controller Endpoint
    ---
    parameters:
      - name: body
        in: body
        schema:
          type: object
          properties:
            message:
              type: string
            drawing:
              type: string
              description: Base64 encoded drawing data (optional)
            conversation_id:
              type: string
              description: ID of the conversation to retrieve
        required: true
        description: The message, optional drawing, and conversation ID to process
    
    responses:
      200:
        description: Successfully processed the conversation
      404:
        description: Conversation not found
    """
    
    # Get the data from the request body
    data = request.get_json()
    
    message = data.get('message', '')
    drawing = data.get('drawing')
    conversation_id = data.get('conversation_id')
    
    if not conversation_id:
        return jsonify({"error": "Conversation ID is required"}), 400
    
    try:
        # Get the conversation from the database
        conversation = Database.get_conversation(conversation_id)
        
        # Add the user's message to the conversation history
        conversation.conversation_history.append("User: " + message)

        # Call the ConversationAgent to get the response
        alex_response = "RESPONSE PLACEHOLDER"

        # Add the agent's response to the conversation history
        conversation.conversation_history.append("Alex: " + alex_response)

        # Update the conversation's concepts progress
        for concept in conversation.concepts:
            concept.progress = min(100, concept.progress + random.randint(1, 10))
            
        # Save the conversation to the database
        Database.save_conversation(conversation)
        
        # Serialize concepts to a list of dictionaries
        concepts_dict = [concept.to_dict() for concept in conversation.concepts]
        
        # Return the response along with the updated concepts
        return jsonify({
            "response": alex_response,
            "concepts": concepts_dict
        })
    except Exception as e:
        return jsonify({"error": f"Conversation not found: {str(e)}"}), 404 