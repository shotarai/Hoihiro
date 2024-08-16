dev:
	cd backend
    poetry run python -m uvicorn app.main:app --reload

_isort_check:
	poetry run isort --check ./

_black_check:
	poetry run black --check ./

_mypy:
	poetry run mypy ./ --explicit-package-bases

lint:
	make -j _isort_check _black_check _mypy

_isort_apply:
	poetry run isort ./

_black_apply:
	poetry run black ./

fmt:
	make _isort_apply _black_apply

gen:
	poetry run python get_schema.py
	git add ./api.yml