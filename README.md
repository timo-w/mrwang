# Mr Wang

A personal project to host easy-to-use teaching materials and resources.
View the live site [here](https://mrwang.co.uk)!

Contains:
- An all-in-one quiz generator web app that uses Azure OpenAI to create quizzes in multiple formats, including MS Forms, Blooket, Gimkit and more.
- Downloadable pupil resources from classes - where AI quizzes can be generated based on the resource
- Code puzzles - a fun revision tool for practising Visual Basic code
- Photography and music projects
- 1 of your 5 a day

## Setup

```bash
git clone https://github.com/yourusername/mrwang.git
cd mrwang
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py collectstatic --noinput
python manage.py migrate
python manage.py createsuperuser --noinput
cp .env.example .env  # add your own keys

python manage.py check # just in case
python manage.py runserver
```

The following environment variables must be set in a `.env` file:

```bash
AZURE_DEPLOYMENT_NAME
AZURE_OPENAI_API_VERSION
AZURE_OPENAI_ENDPOINT
AZURE_OPENAI_KEY
DJANGO_DEBUG
DJANGO_SECRET_KEY
DJANGO_SUPERUSER_USERNAME
DJANGO_SUPERUSER_EMAIL
DJANGO_SUPERUSER_PASSWORD
```

Copyright Mr Wang 2025-26. All rights reserved.
