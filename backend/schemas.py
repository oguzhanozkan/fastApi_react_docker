from enum import Enum
from pydantic import BaseModel, EmailStr

from datetime import datetime


class Roles(Enum):
    USER = "USER"
    ADMIN = "ADMIN"

class UserSchema(BaseModel):
    username: EmailStr
    password: str
   
class BookUpdate(BaseModel):
    book_name: str
    author: str

class CurrentUser(BaseModel):
    email:str

class CreateBook(BaseModel):
    book_name: str
    author: str
    
class GiveBookToUser(BaseModel):
    book_id: int
    user_id: int

class CreateUserRequest(BaseModel):
    username: str
    password: str
    role: Roles

class MyBooksRequest(BaseModel):
    username: str

class ReturnBackBookRequest(BaseModel):
    username: str
    book_name: str
    author: str
    return_date: datetime
    will_return_date: str
    user_book_is_returned: bool

class TakeBookRequest(BaseModel):
    book_id: int
    user_id: int