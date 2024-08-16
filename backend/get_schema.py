from ruamel.yaml import YAML

from api.app import app

yaml = YAML()
with open("./api.yml", "w") as file:
    yaml.dump(app.openapi(), file)
