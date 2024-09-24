from sqlalchemy import Column, ForeignKey, Integer, String, Date, Boolean, Enum as SQLEnum
from sqlalchemy.orm import relationship
from enum import Enum
from database import Base

class Role(str, Enum):
    ADMIN = "ADMIN"
    USER = "USER"

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True, unique=True)
    username = Column(String, index=True, unique=True)
    hashed_password = Column(String, index=True)
    userbooks = relationship("UserBook", back_populates="user")
    is_active = Column(Boolean, default=False)
    role = Column(SQLEnum(Role), default=Role.USER)   


class Book(Base):
    __tablename__ = 'books'
    id = Column(Integer, primary_key=True, index=True,unique=True)
    book_name = Column(String, index=True)
    author = Column(String, index=True)
    is_here = Column(Boolean)
    userbooks = relationship("UserBook", back_populates="book")
    


class UserBook(Base):
    __tablename__ = 'userbooks'
    id = Column(Integer, primary_key=True, index=True)
    return_date = Column(Date)
    will_return_date = Column(Date)
    user_book_is_returned = Column(Boolean)
    user_id = Column(Integer, ForeignKey('users.id'))
    book_id = Column(Integer, ForeignKey('books.id'))
    user = relationship("User",back_populates="userbooks")
    book = relationship("Book",back_populates="userbooks")
