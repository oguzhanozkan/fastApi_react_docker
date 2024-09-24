from passlib.context import CryptContext
import utils, jwt, os
from fastapi.security import OAuth2PasswordBearer
from dotenv import load_dotenv
import time,schemas
from fastapi import Depends, HTTPException, status


load_dotenv(".env")


JWT_SECRET =  str(os.getenv("JWT_SECRET"))
ALGORITHM = str(os.getenv("ALGORITHM"))

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def get_password_hash(password : str):
   return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(username,db):
    db_user = utils.get_user_by_username(username,db)
    try:
        claims = {
            "sub": db_user.username,
            "role": db_user.role.value,
            "active": db_user.is_active,
            "exp": time.time() + 600
        }
        return jwt.encode(claims, JWT_SECRET, ALGORITHM)
    except Exception as ex:
        raise ex

def verify_token(token):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=ALGORITHM)
        return payload
    except:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Please activate your Account first",
            headers={"WWW-Authenticate": "Bearer"},
        )
        

def check_active(token: str = Depends(oauth2_scheme)):
    payload = verify_token(token)
   
    active = payload.get("active")
    if not active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Please activate your Account first",
            headers={"WWW-Authenticate": "Bearer"},
        )
    else:
        return payload

def check_admin(payload: dict = Depends(check_active)):
    role = payload.get("role")
    if role != "ADMIN":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can access this route",
            headers={"WWW-Authenticate": "Bearer"},
        )
    else:
        return payload

    
def get_current_user(token:str = Depends(oauth2_scheme)):
    payload = verify_token(token)
    #role = payload.get("role")
    email = payload.get("sub")
    #return response.GetCurrentUser(email,role)
    return schemas.CurrentUser(email=email)