from typing import List, Dict, Any
from model.data_models.SubConcept import SubConcept

class Concept:
    def __init__(self, name: str, subConcepts: List[SubConcept] = None, progress: int = None):
        self.name = name
        self.progress = progress if progress is not None else 0
        self.subConcepts = subConcepts if subConcepts is not None else []
        
    def __iter__(self):
        yield 'name', self.name
        yield 'progress', self.progress
        yield 'subConcepts', [subConcept.to_dict() for subConcept in self.subConcepts] if self.subConcepts else []
    
    def to_dict(self):
        return {
            'name': self.name,
            'progress': self.progress,
            'subConcepts': [subConcept.to_dict() for subConcept in self.subConcepts] if self.subConcepts else []
        }
        
    @staticmethod
    def from_dict(data: Dict[str, Any]):
        concept = Concept(data['name'], progress=data.get('progress', 0))
        
        if 'subConcepts' in data and data['subConcepts']:
            concept.subConcepts = [SubConcept.from_dict(subconcept) for subconcept in data['subConcepts']]
            
        return concept