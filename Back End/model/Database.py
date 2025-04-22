from model.data_models.Conversation import Conversation
import json
import os

class Database:
    @staticmethod
    def get_database_path():
        # Check for database directory in current directory
        if os.path.exists("database"):
            return "database"
        # Check for database directory in Back End directory
        elif os.path.exists("Back End/database"):
            return "Back End/database"
        # If we can't find it, create it in the current directory
        else:
            os.makedirs("database", exist_ok=True)
            return "database"
    
    @staticmethod
    def save_conversation(conversation: Conversation):
        conversation_dict = conversation.to_dict()        
        
        database_path = Database.get_database_path()
        file_path = os.path.join(database_path, f"{conversation.Id}.json")
        
        with open(file_path, "w") as file:
            json.dump(conversation_dict, file, indent=4)
    
    @staticmethod
    def get_conversation(conversation_id: str):
        database_path = Database.get_database_path()
        file_path = os.path.join(database_path, f"{conversation_id}.json")
        
        try:
            print(f"Attempting to open file: {file_path}")
            with open(file_path, "r") as file:
                conversation_data = json.load(file)
                print("Loaded conversation data:", conversation_data)
                try:
                    return Conversation.from_dict(conversation_data)
                except Exception as e:
                    print(f"Error creating Conversation object: {str(e)}")
                    raise Exception(f"Error converting data to Conversation: {str(e)}")
        except FileNotFoundError:
            # Check if the file actually exists in the correct location
            current_dir = os.getcwd()
            print(f"Current working directory: {current_dir}")
            
            # List files in the database directory to see if the file is there
            try:
                files = os.listdir(database_path)
                print(f"Files in {database_path}: {files}")
                
                if f"{conversation_id}.json" in files:
                    print(f"File {conversation_id}.json exists but could not be opened from {file_path}")
            except Exception as e:
                print(f"Error listing database directory: {str(e)}")
            
            raise Exception(f"No conversation found with ID: {conversation_id}")