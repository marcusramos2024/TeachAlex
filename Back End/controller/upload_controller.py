from flask import request, Blueprint, jsonify

upload_bp = Blueprint('upload', __name__)

@upload_bp.route('/upload', methods=['POST'])
def upload_file():
    """
    File Upload Endpoint
    ---
    parameters:
      - name: file
        in: formData
        type: file
        required: true
        description: The file to upload
    
    responses:
      200:
        description: Successfully uploaded file and returned concepts
    """
    
    if 'file' not in request.files:
        return 'No file part', 400
    file = request.files['file']
    if file.filename == '':
        return 'No selected file', 400
    
    # Mock concepts
    concept_names = ["concept1", "concept2", "concept3"]

    return jsonify({"concept_names": concept_names}) 