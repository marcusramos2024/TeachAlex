import enum
from openai import OpenAI as GPT

class Model(str, enum.Enum):
    GPT_3_5_TURBO = "gpt-3.5-turbo"
    GPT_4_TURBO = "gpt-4-turbo"
    GPT_4O_MINI = "gpt-4o-mini"
    O1_MINI = "o1-mini"
    O3_MINI = "o3-mini"
    O1 = "o1"
    GPT_4O = "gpt-4o"
    CHATGPT_4O_LATEST = "chatgpt-4o-latest"
    GPT_4 = "gpt-4"
    GPT_4_5_PREVIEW = "gpt-4.5-preview"


class OpenAI():
    def __init__(self, model: Model):
        self.__api_key = "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"
        self.__model = model
    
    def query(self, prompt: str, temperature=None):
        client = GPT(api_key=self.__api_key)
        
        # Create base parameters
        params = {
            "model": self.__model,
            "messages": [
                {"role": "system", "content": prompt}
            ]
        }
        
        # Only add temperature if it's provided
        if temperature is not None:
            params["temperature"] = temperature
        
        response = client.chat.completions.create(**params)
        response = response.choices[0].message.content

        return response    