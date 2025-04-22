from flask import Flask
from flasgger import Swagger
from flask_cors import CORS
from controller.extraction_controller import extract_bp
from controller.conversation_controller import conversation_bp

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://localhost:5173", "http://127.0.0.1:5173"]}})
swagger = Swagger(app)

app.register_blueprint(extract_bp)
app.register_blueprint(conversation_bp)

if __name__ == '__main__':
    app.run(debug=True) 