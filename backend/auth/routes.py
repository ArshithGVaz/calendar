from fastapi import APIRouter, Depends, HTTPException
from starlette.responses import RedirectResponse
from auth.oauth import oauth

router = APIRouter()

@router.get("/login")
async def login():
    redirect_uri = 'http://localhost:8000/auth/callback'
    return await oauth.google.authorize_redirect(redirect_uri)

@router.get("/callback")
async def callback(request: Request):
    token = await oauth.google.authorize_access_token(request)
    user_info = await oauth.google.parse_id_token(request, token)
    
    # Process user info, create user in DB, and issue token
    # Redirect to frontend or dashboard
