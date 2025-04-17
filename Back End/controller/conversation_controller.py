from flask import request, Blueprint, jsonify

conversation_bp = Blueprint('conversation', __name__)

@conversation_bp.route('/query', methods=['POST'])
def query():
    """
    Conversation Query Endpoint
    ---
    parameters:
      - name: text
        in: body
        schema:
          type: object
          properties:
            text:
              type: string
        required: true
        description: The text query to process
    
    responses:
      200:
        description: Successfully processed query
    """
    
    # Get the text from the request body
    data = request.get_json()
    text = data.get('text', '')
    
    # Return the text that was sent
    return jsonify({"response": text})

@conversation_bp.route('/conversation_controller', methods=['POST', 'OPTIONS'])
def conversation_controller():
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
        required: true
        description: The message and optional drawing to process
    
    responses:
      200:
        description: Successfully processed the conversation
    """
    
    # Handle OPTIONS request for CORS preflight
    if request.method == 'OPTIONS':
        return '', 200
        
    # Get the data from the request body
    data = request.get_json()
    message = data.get('message', '')
    drawing = data.get('drawing')
    
    # Process the message (replace with actual AI processing logic)
    response_text = f"You said: {message}"
    if drawing:
        response_text += " (I also received your drawing)"
    
    # Return the response
    return jsonify({"response": response_text}) 