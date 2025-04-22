class SubConcept:
    def __init__(self, name, connections=None):
        self.name = name
        self.connections = connections if connections is not None else []
        
    def __iter__(self):
        yield 'name', self.name
        yield 'connections', self.connections
        
    def to_dict(self):
        return {
            'name': self.name,
            'connections': self.connections
        }
    
    @staticmethod
    def from_dict(data):
        return SubConcept(data['name'], data.get('connections', []))
    