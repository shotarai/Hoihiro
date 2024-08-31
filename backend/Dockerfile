FROM python:3.11-slim

RUN useradd -m myuser

RUN pip install poetry

WORKDIR /app
COPY pyproject.toml poetry.lock ./
RUN chown -R myuser:myuser /app

USER myuser

RUN poetry install --no-root

COPY . .

EXPOSE 8080

CMD ["poetry", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]
