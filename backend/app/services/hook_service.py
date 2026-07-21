from google import genai

from app.config import API_KEY

client = genai.Client(api_key=API_KEY)


def generate_hook(description, platform, tone, language, previous_hooks=None):

    prompt = f"""
Generate exactly 5 highly engaging social media hooks.

Rules:
- Stop the reader within the first few words.
- Create curiosity.
- Use unexpected or emotionally compelling wording.
- Avoid generic marketing phrases.
- Make each hook feel natural and scroll-stopping.
- Return only the hooks.
- One hook per line.
- No numbering.
- No explanations.

platform: {platform}
tone: {tone}
language: {language}

description: {description}
"""

    if previous_hooks:
        prompt += f"""

Previous hooks:
{chr(10).join(previous_hooks)}

Generate five completely different hooks.

Do not repeat the wording, structure, or angle of any previous hook.
"""

    response = client.models.generate_content(
        model="gemini-3.1-flash-lite", contents=prompt
    )

    return response.text.split("\n")
