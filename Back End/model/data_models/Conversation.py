from typing import List, Dict, Any, Optional
from uuid import UUID, uuid4
from model.data_models.Concept import Concept

class Conversation:
    def __init__(self, documentText: str, concepts: Optional[List[Concept]] = None, conversation_history: Optional[List[str]] = None):
        self.Id = uuid4()
        self.documentText = documentText
        self.concepts = concepts if concepts is not None else []
        self.conversation_history = conversation_history if conversation_history is not None else []
    
    def __iter__(self):
        yield 'Id', str(self.Id)
        yield 'documentText', self.documentText
        yield 'concepts', [concept.to_dict() for concept in self.concepts] if self.concepts else []
        yield 'conversation_history', self.conversation_history
    
    def to_dict(self):
        return {
            'Id': str(self.Id),
            'documentText': self.documentText,
            'concepts': [concept.to_dict() for concept in self.concepts] if self.concepts else [],
            'conversation_history': self.conversation_history
        }
        
    @staticmethod
    def from_dict(data: Dict[str, Any]):
        conversation = Conversation(data['documentText'])
        conversation.Id = UUID(data['Id'])
        
        if 'concepts' in data and data['concepts']:
            conversation.concepts = [Concept.from_dict(concept) for concept in data['concepts']]
        
        if 'conversation_history' in data and data['conversation_history']:
            conversation.conversation_history = data['conversation_history']
        
        return conversation
