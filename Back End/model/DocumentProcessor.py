import io
from PyPDF2 import PdfReader

class DocumentProcessor:
    def extractText(file_obj):            
        text = ""

        try:
            # Create a BytesIO object from the file data
            file_stream = io.BytesIO(file_obj.read())
            
            # Process the PDF using PyPDF2
            reader = PdfReader(file_stream)
            for page in reader.pages:
                text += page.extract_text()
        
        except Exception as e:
            raise Exception(f"Error extracting text from PDF: {str(e)}")
            
        return text