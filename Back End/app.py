from flask import Flask
from flasgger import Swagger
from flask_cors import CORS
from controller.upload_controller import upload_bp
from controller.conversation_controller import conversation_bp

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
swagger = Swagger(app)

app.register_blueprint(upload_bp)
app.register_blueprint(conversation_bp)

if __name__ == '__main__':
    app.run(debug=True) 