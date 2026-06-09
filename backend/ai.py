from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def generate_description(product_name, features):
    prompt = f"""
    You are a professional ecommerce copywriter.

    Product: {product_name}
    Features: {features}

    Requirements:
    - Write 150-250 words
    - Include a catchy title
    - Focus on customer benefits
    - Use persuasive marketing language
    - Suitable for Amazon or Shopify
    - End with a call to action
    """

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "user", "content": prompt}
        ]
    )

    return response.choices[0].message.content