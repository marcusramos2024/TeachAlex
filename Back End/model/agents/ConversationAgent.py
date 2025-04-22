from model.providers.OpenAI import OpenAI, Model
from model.Database import Database
import json

class ConversationAgent:
    
    def start_conversation(self, exam_text, concept):
        model = OpenAI(Model.GPT_4_TURBO)

        prompt = f"""
        Given the following exam content and the concept '{concept}', generate one short, open-ended question an eager student might ask to start learning about this concept.
        
        Focus specifically on aspects of '{concept}' that appear in the exam content.
        
        Exam Content:
        {exam_text}
        
        Respond with just the question, without any additional text.
        """

        return model.query(prompt, temperature=0.5)
    
    def input(self, exam_text, concept):
        model = OpenAI(Model.GPT_4_TURBO)

        prompt = f"""
        Given the following exam content and the concept '{concept}', generate one short, open-ended question an eager student might ask to start learning about this concept.
        
        Focus specifically on aspects of '{concept}' that appear in the exam content.
        
        Exam Content:
        {exam_text}
        
        Respond with just the question, without any additional text.
        """

        return model.query(prompt, temperature=0.5)