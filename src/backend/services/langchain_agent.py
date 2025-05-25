from langchain_community.llms import Ollama
from langchain.prompts import PromptTemplate

SYSTEM = """
1. You’re a friendly farmer–plant‐disease expert.

2. Please provide prescriptions based on the plant and disease names.

3. The responses should be maximum 10 words long and 1 sentence long.

4. Please avoid using bold, italics, or any other formatting. Just plain text.
"""
llm = Ollama(model="gemma3:1b", system=SYSTEM)

def generate_prescription(plant: str, disease: str) -> str:
    tpl = PromptTemplate(
      input_variables=["plant","disease"],
      template="Plant: {plant}\nDisease: {disease}\nPrescription:"
    )
    prompt = tpl.format_prompt(plant=plant,disease=disease).to_string()
    return llm.invoke(prompt).strip()
