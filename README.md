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
