# Credit Card Payment System (Educational MVP)

Django REST Framework owns registration, JWT, card metadata, transaction history and admin.
FastAPI provides a payment simulation API. Both use the same Django ORM models/database.

## Important safety scope
This is a demo simulator, not a real payment gateway. Never enter real card numbers or CVV.
The card API accepts only a brand, last four digits and expiry metadata. Production card capture
must use a PCI-compliant provider's hosted fields/tokenization. Do not store PAN or CVV.

## Setup (Windows PowerShell)
1. Install Python 3.11+ and MySQL Server/Workbench.
2. Create database:
   `CREATE DATABASE credit_card_payment CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
3. Create and activate venv:
   `python -m venv venv`
   `.\venv\Scripts\Activate.ps1`
4. Install:
   `pip install -r requirements.txt`
5. Copy `.env.example` to `.env`; set DB_PASSWORD and replace both secret values.
   Keep `.env` private; never commit it.
6. Django migrations and admin:
   `python manage.py makemigrations cards transactions audit`
   `python manage.py migrate`
   `python manage.py createsuperuser`
7. Run Django in terminal 1:
   `python manage.py runserver 8000`
8. Run FastAPI in terminal 2:
   `python -m uvicorn fastapi_service.main:app --reload --port 8001`

## Endpoints
- POST `/api/register/` body: `{"username":"demo","email":"demo@example.com","password":"DemoPass123!"}`
- POST `/api/login/` body: `{"username":"demo","password":"DemoPass123!"}`
- POST `/api/token/refresh/` body: `{"refresh":"..."}`
- POST `/api/logout/` authenticated body: `{"refresh":"..."}`
- GET `/api/profile/` authenticated
- POST `/api/cards/` authenticated body: `{"brand":"VISA","last4":"4242","expiry_month":12,"expiry_year":2028}`
- GET `/api/cards/`, DELETE `/api/cards/{id}/` authenticated
- POST FastAPI `/api/payments/` authenticated body: `{"card_id":1,"amount":"1500.00","simulate_failure":false}`
- GET FastAPI `/api/payments/{payment_id}/` authenticated
- GET Django `/api/transactions/?status=SUCCESS&min_amount=10&max_amount=5000`
- Admin only: GET `/api/admin/summary/`, GET `/api/admin/transactions/export/`

## API docs
- Django Swagger: http://127.0.0.1:8000/api/docs/
- FastAPI Swagger: http://127.0.0.1:8001/docs

## Notes
FastAPI validates Django SimpleJWT access tokens using the shared Django settings.
This starter creates the transaction as PENDING and immediately finalizes it in the same
database transaction for a simple synchronous demo. A production system should use a durable
asynchronous payment workflow, provider webhooks, idempotency keys, reconciliation and
audited state transitions. Add and run automated tests before submission.
