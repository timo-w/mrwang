# Mr Wang

A Django web app that uses Azure OpenAI to generate Word documents based on prompts.

## Setup

```bash
git clone https://github.com/yourusername/mrwang.git
cd mrwang
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # add your own keys
python manage.py runserver