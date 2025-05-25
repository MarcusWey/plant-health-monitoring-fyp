from langchain.prompts import ChatPromptTemplate
from langchain.llms import Ollama
from services.chatbot.system_prompt import FARMIZ_SYSTEM_PROMPT

def run_farmiz_chain(plant_condition: str, user_question: str) -> str:
    if plant_condition:
        plant_info = f"Plant Condition:\n{plant_condition}"
    else:
        plant_info = "Plant Condition:\nNot provided by user."

    prompt = ChatPromptTemplate.from_messages([
        ("system", FARMIZ_SYSTEM_PROMPT),
        ("human", "{plant_info}\n\nUser Question:\n{user_question}")
    ])

    llm = Ollama(
        model="gemma3:latest",
        system=FARMIZ_SYSTEM_PROMPT
    )

    chain = prompt | llm
    result = chain.invoke({
        "plant_info": plant_info,
        "user_question": user_question
    })
    return result
