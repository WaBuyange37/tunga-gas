import os
from fastapi import FastAPI, Request # type: ignore
from fastapi.middleware.cors import CORSMiddleware # type: ignore
from pydantic import BaseModel # type: ignore
import stripe # type: ignore

app = FastAPI()

# Allow CORS for local frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # adjust as needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

stripe.api_key = "sk_test_51RTnwL2XsCpXKrniIkHycMkQareBTonQyH7BNj9zHTfrahNyjThQ5ENDuwFwGkoSFx5FXP0A8peB0qMgxbrqEwv900lARrxGLF"  # Replace with your Stripe secret key

class PaymentIntentRequest(BaseModel):
    amount: int
    currency: str

@app.post("/stripe")
async def create_payment_intent(data: PaymentIntentRequest):
    try:
        intent = stripe.PaymentIntent.create(
            amount=data.amount,  # Amount in cents
            currency=data.currency,
            payment_method_types=["card"],
        )
        return {"clientSecret": intent.client_secret}
    except Exception as e:
        return {"error": str(e)}
    
# run uvicorn main:app --reload --port 4242