from flask import request, Blueprint, jsonify
from model.data_models.Concept import Concept
from model.data_models.SubConcept import SubConcept
from model.DocumentProcessor import DocumentProcessor
from model.data_models.Conversation import Conversation
from model.Database import Database
from model.agents.ConceptExtractionAgent import ConceptExtractionAgent
from model.agents.ConversationAgent import ConversationAgent
import json
from EnvironmentVars import MOCK_UPLOAD_FLOW

extract_bp = Blueprint('extract', __name__)

@extract_bp.route('/extract/text', methods=['POST'])
def extract_text():
    """
    Extract text from a file.
    ---
    parameters:
      - name: file
        in: formData
        type: file
        required: true
    
    responses:
      200:
        description: Successfully uploaded file and saved to database.
    """
    
    if 'file' not in request.files:
        return 'No file in formData', 400
    
    file = request.files['file']
    
    if not file.filename.lower().endswith('.pdf'):
        return 'File must be a PDF', 400

    # Extract text
    text = DocumentProcessor.extractText(file)

    if len(text) > 100000:
        return 'Document text exceeds maximum token limit. Please provide a shorter document.', 400

    # Create conversation
    conversation = Conversation(documentText=text)

    # Save conversation to database
    Database.save_conversation(conversation)

    return jsonify({"Id": str(conversation.Id)}), 200

@extract_bp.route('/extract/concepts', methods=['POST'])
def extract_concepts():
    """
    Extract concepts from a file.
    ---
    parameters:
      - name: id
        in: formData
        type: string
        required: true
        description: Conversation Id to extract concepts from
    
    responses:
      200:
        description: Successfully extracted concepts
      400:
        description: No ID provided
      404:
        description: Conversation not found
      500:
        description: Internal server error
    """

    if MOCK_UPLOAD_FLOW:
        return jsonify({
            "concepts": mock_concepts(),
            "initial_message": mock_initial_message()
        }), 200
    
    concepts = []
    initial_message = ""

    if 'id' not in request.form:
        return 'No ID provided', 400

    # Get exam text from database
    try:
        conversation = Database.get_conversation(request.form['id'])
        exam_text = conversation.documentText
    
    except Exception as e:
        return "Conversation with id " + request.form['id'] + " not found", 404


    # Extract concepts from document text
    try:
        agent = ConceptExtractionAgent()
        extracted_concepts = agent.extract(exam_text)
        
        # Clear existing concepts if any
        conversation.concepts = []
        
        # Create Concept objects from extracted concept dictionary
        # extracted_concepts is a dict where keys are concept names and values are question lists
        for concept_name, questions in extracted_concepts.items():
            concept_obj = Concept(name=concept_name, progress=0, subConcepts=[])
            concepts.append(concept_obj.to_dict())
            conversation.concepts.append(concept_obj)
        
        # Generate initial message if concepts were extracted
        if concepts:
            conversation_agent = ConversationAgent()
            first_concept = conversation.concepts[0].name
            initial_message = conversation_agent.start_conversation(exam_text, first_concept)
            
            # Initialize conversation_history if it doesn't exist
            if not hasattr(conversation, 'conversation_history'):
                conversation.conversation_history = []
                
            # Add initial message to conversation history
            conversation.conversation_history.append("Alex: " + initial_message)
    
    except Exception as e:
        return "Sorry, something went wrong", 500

    # Save conversation to database
    Database.save_conversation(conversation)

    return jsonify({
        "concepts": concepts,
        "initial_message": initial_message
    }), 200

def mock_initial_message():
    return "MOCKED INITIAL MESSAGE"

def mock_concepts():
    concepts = []
    
    # Create subConcepts for Marcus
    marcus_subconcepts = []
    
    # Create subConcepts for Mirella
    mirella_subconcepts = [
        SubConcept(name="Natural Language Processing", connections=["Word Embeddings"]),
        SubConcept(name="Word Embeddings", connections=[])
    ]
    
    # Create subConcepts for Eric
    eric_subconcepts = [
        SubConcept(name="Computer Vision", connections=["Image Classification", "Object Detection"]),
        SubConcept(name="Image Classification", connections=[]),
        SubConcept(name="Object Detection", connections=[])
    ]
    
    # Add concepts with progress and subConcepts
    concepts.append(Concept(name="Concept 1", progress=0, subConcepts=marcus_subconcepts).to_dict())
    concepts.append(Concept(name="Concept 2", progress=42, subConcepts=mirella_subconcepts).to_dict())
    concepts.append(Concept(name="Concept 3", progress=78, subConcepts=eric_subconcepts).to_dict())
    
    return concepts