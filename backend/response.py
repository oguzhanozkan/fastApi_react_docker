from enum import Enum
from typing import List
import models, datetime


class Response():
    status_code:int
    detail: str

    def __init__(self, status_code, detail):
        self.status_code = status_code
        self.detail = detail

class BookInfo:
    book_name: str
    author: str
    in_library:bool
    return_date: datetime
    will_return_date: datetime
    user_name: str

    def __init__(self, book_name, author,in_library,return_date,will_return_date, user_name):
        self.book_name = book_name
        self.author = author
        self.in_library = in_library
        self.return_date = return_date
        self.will_return_date = will_return_date
        self.user_name = user_name

class GetUserBooks:
    status_code: int
    user_id: int
    books : List[BookInfo]

    def __init__(self, user_id, status_code, books):
        self.status_code = status_code
        self.user_id = user_id
        self.books = books

class GetMyBookResults:
    username: str
    book_name: str
    author: str
    return_date: datetime
    will_return_date: datetime
    user_book_is_returned: bool

    def __init__(self, username, book_name, author,return_date,will_return_date,user_book_is_returned):
        self.username = username
        self.book_name = book_name
        self.author = author
        self.return_date = return_date
        self.will_return_date = will_return_date
        self.user_book_is_returned = user_book_is_returned

class GetMyBookResponse:
    getMyBookResults: List[GetMyBookResults]
    status_code: str

    def __init__(self, getMyBookResults, status_code):
        self.getMyBookResults = getMyBookResults
        self.status_code = status_code

class GetAvailableBooks:
    books: List[models.Book]
    status_code: str

    def __init__(self,books, status_code):
        self.books = books
        self.status_code = status_code

class GetDelayBooks:
    book_name:str
    author: str
    is_here: bool
    return_date: datetime
    will_return_date: datetime
    user_name: str

    def __init__(self, book_name, author, is_here, return_date, will_return_date, user_name):
        self.book_name = book_name
        self.author = author
        self.is_here = is_here
        self.return_date = return_date
        self.will_return_date = will_return_date
        self.user_name = user_name

class DelayBookRespone:
    delayed_books: List[GetDelayBooks]
    status_code: str

    def __init__(self,books, status_code):
        self.books = books
        self.status_code = status_code

class OverdueBook:
    book_name: str
    author: str
    will_return_date: datetime
    user_name: str

    def __init__(self, book_name, author, will_return_date, user_name ):
        self.book_name = book_name
        self.author = author
        self.will_return_date = will_return_date
        self.user_name = user_name

class OverdueBookResponse:
    overdue_books : List[OverdueBook]
    status_code: str 

    def __init__(self,overdue_books, status_code):
        self.overdue_books = overdue_books
        self.status_code = status_code

class ResponseMessage(Enum):
    EAIU = "email already in use",
    BR = "bad request",
    SUC = "user created successfully",
    EAINC = "email address is not correct",
    PINC = "password is not correct",
    PCYE = "please check your email",
    FCNBE = "fields can not be empty",
    BC = "book created",
    AE ="already exist",
    BDS = "book deleted successfully",
    UDS = "user deleted successfully",
    BUS = "book updated successfully",
    BG = "book gived",
    UN = "user not found",
    BT = "book taked"