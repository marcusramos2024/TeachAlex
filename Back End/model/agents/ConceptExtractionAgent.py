from model.providers.OpenAI import OpenAI, Model
from model.Database import Database
import json

class ConceptExtractionAgent:
    def __init__(self, model: Model = Model.O3_MINI):
        self.model = OpenAI(model)
    def extract(self, exam_text):
        prompt = f"""
        You are an AI assistant helping to extract key concepts from an exam for a teaching-focused learning application. Your goal is to identify the most important concepts that a student would need to understand in order to effectively teach the material to someone else.

        Analyze the following exam text and extract fundamental concepts that:
        1. Are broad enough to encompass multiple exam questions
        2. Are specific enough to be teachable in a focused conversation
        3. Form the foundation for understanding the subject matter
        4. Would allow a student to demonstrate comprehensive understanding through teaching

        For each concept, identify which exam questions (by number) fall under that concept.

        Return your response as a valid JSON object where:
        - Keys are the concept names
        - Values are arrays of question numbers that relate to that concept
        Example response format: {{"Concept 1": ["Q1", "Q2"], "Concept 2": ["Q3", "Q4", "Q5"]}}

        Exam Text:
        {exam_text}
        """

        response = self.model.query(prompt)

        return json.loads(response)