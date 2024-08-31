from ruamel.yaml import YAML

from app.main import app

yaml = YAML()
with open("./api.yml", "w") as file:
    yaml.dump(app.openapi(), file)
