from sqlalchemy.orm import Session
from database import engine
from models import Book, User
import auth
from schemas import Roles

def add_initial_users():
    hashed_password = auth.get_password_hash("123")
    initial_users = [
        {
            "username": "oguzhan.92.ozkan@gmail.com",
            "hashed_password": hashed_password, 
            "is_active": True, 
            "role": Roles.ADMIN.value
        },
        {
            "username": "oguzhanfakemail@gmail.com", 
            "hashed_password": hashed_password, 
            "is_active": True, 
            "role": Roles.USER.value
        }
    ]
    with Session(engine) as session:
        for user in initial_users:
            if not session.query(User).filter(User.username == user["username"]).first():
                new_user = User(**user)
                session.add(new_user)
        session.commit()


def add_initial_books():
    initial_books = [
        {"book_name": "Book 1", "author": "Author A", "is_here": True},
        {"book_name": "Book 2", "author": "Author B", "is_here": True},
        {"book_name": "Book 3", "author": "Author C", "is_here": True},
        {"book_name": "Book 4", "author": "Author D", "is_here": True},
        {"book_name": "Book 5", "author": "Author E", "is_here": True},
        {"book_name": "Book 6", "author": "Author F", "is_here": True},
        {"book_name": "Book 7", "author": "Author G", "is_here": True},
        {"book_name": "Book 8", "author": "Author H", "is_here": True},
        {"book_name": "Book 9", "author": "Author I", "is_here": True},
        {"book_name": "Book 10", "author": "Author J", "is_here": True}
    ]
    with Session(engine) as session:
        for book in initial_books:
            if not session.query(Book).filter(Book.book_name == book["book_name"]).first():
                new_book = Book(**book)
                session.add(new_book)
        session.commit()




