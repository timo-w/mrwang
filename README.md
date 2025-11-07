# Mr Wang

A personal project to host easy-to-use teaching materials and resources.
View the live site [here](https://mrwang.co.uk)!

Contains:
- A quiz generator web app that uses Azure OpenAI to generate Word documents based on prompts.
- Downloadable pupil resources from classes

## Setup

```bash
git clone https://github.com/yourusername/mrwang.git
cd mrwang
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # add your own keys

python manage.py runserver
```

The following environment variables must be set in a `.env` file:

```bash
AZURE_OPENAI_ENDPOINT
AZURE_OPENAI_KEY
AZURE_DEPLOYMENT_NAME
AZURE_OPENAI_API_VERSION
DJANGO_DEBUG
DJANGO_SECRET_KEY
```
