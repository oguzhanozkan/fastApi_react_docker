import utils, models, auth, response, sendmail
from fastapi import status
from datetime import datetime, timedelta
from typing import List

def create_user(user, db):
    is_exist = utils.is_exist_user_by_username(user.username,db)
    if is_exist:
        return response.Response(status.HTTP_409_CONFLICT, response.ResponseMessage.EAIU)
    else:
        try:
            hashed_password = auth.get_password_hash(user.password)
            new_user = models.User(
                username=user.username,
                hashed_password=hashed_password
            )

            db.add(new_user)
            db.commit()
            db.refresh(new_user)
            token = auth.create_access_token(user.username,db)
            
            sendmail.send_mail_for_active_user(user.username,token,user.username)
            return response.Response(status.HTTP_201_CREATED, response.ResponseMessage.SUC)
        except:
            return response.Response(status.HTTP_400_BAD_REQUEST, response.ResponseMessage.BR)

def active_user(token,db):
    payload = auth.verify_token(token)
    username = payload.get("sub")
    db_user = utils.get_user_by_username(username,db)
    
    utils.activated_user(db_user,db)
    return db_user.username

def userLogin(data,db):
    
    db_user = utils.get_user_by_username(data.username,db)
    if not db_user:
        return response.Response(status.HTTP_401_UNAUTHORIZED, detail=response.ResponseMessage.EAINC)
    pass_is_verify = auth.verify_password(data.password, db_user.hashed_password)
    if not pass_is_verify:
        return response.Response(status.HTTP_406_NOT_ACCEPTABLE, detail=response.ResponseMessage.PINC)
    
    if not db_user.is_active:
        return response.Response(status.HTTP_400_BAD_REQUEST, detail=response.ResponseMessage.PCYE)
    
    token = auth.create_access_token(db_user.username, db)
    return {"access_token": token, "token_Type": "bearer", "id": db_user.id}
    #return response.LoginResponse(status.HTTP_200_OK, token, "bearer")

def get_all_users(db):
    return db.query(models.User).all()


def get_all_books(db):
    return db.query(models.Book).all()


def delete_book(id,db):
    db_book = db.query(models.Book).filter(models.Book.id == id).first()
    db.delete(db_book)
    db.commit()
    return response.Response(status.HTTP_200_OK, detail=response.ResponseMessage.BDS)

def delete_user(id,db):
    db_user = db.query(models.User).filter(models.User.id == id).first()
    db.delete(db_user)
    db.commit()
    return response.Response(status.HTTP_200_OK, detail=response.ResponseMessage.UDS)

def create_book(book, db):
    is_exist = utils.book_already_exist(book,db)

    if not is_exist:
        if (len(book.book_name)  == 0 or len(book.author) == 0) :
            return response.Response(status.HTTP_400_BAD_REQUEST, detail=response.ResponseMessage.FCNBE)
        else:
            new_book = models.Book(
                book_name=book.book_name,
                author=book.author,
                is_here = True
            )
                
            db.add(new_book)
            db.commit()
            db.refresh(new_book)

            return response.Response(status.HTTP_201_CREATED, detail=response.ResponseMessage.BC)
    else:
        return response.Response(status.HTTP_409_CONFLICT, detail=response.ResponseMessage.AE)


def update_book(id,book,db):
    if len(book.book_name)  == 0 or len(book.author) == 0 :
        return response.Response(status.HTTP_400_BAD_REQUEST, detail=response.ResponseMessage.FCNBE)
    else:
        db_book = db.query(models.Book).filter(models.Book.id == id).first()
        db_book.book_name = book.book_name
        db_book.author = book.author
        db.commit()
        db.refresh(db_book)
        return response.Response(status.HTTP_200_OK, detail=response.ResponseMessage.BUS)
   
def give_book_to_user(give_book_to_user_req,db):
    
    db_book = db.query(models.Book).filter(models.Book.id == give_book_to_user_req.book_id).first()
    db_book.is_here = False
    
    db.commit()
    db.refresh(db_book)
    
    current_date = datetime.now()
    new_date = current_date + timedelta(days=7)
    date_return = new_date.strftime('%Y-%m-%d')
    
    db_user_book = models.UserBook(
        return_date = None,
        will_return_date = date_return,
        user_book_is_returned = False,
        user_id = give_book_to_user_req.user_id,
        book_id = give_book_to_user_req.book_id,
    )

    db.add(db_user_book)
    db.commit()
    db.refresh(db_user_book)

    return response.Response(status_code=status.HTTP_200_OK,detail=response.ResponseMessage.BG)

    
    

def create_user_for_admin(create_user_req,db):    
    is_exist = utils.is_exist_user_by_username(create_user_req.username,db)
    if is_exist:
        return response.Response(status.HTTP_409_CONFLICT, response.ResponseMessage.EAIU)
    else:
        try:
            hashed_password = auth.get_password_hash(create_user_req.password)

            role = models.Role.USER
            
            if(create_user_req.role.value == "ADMIN"):
                role = models.Role.ADMIN
            else:
                role = models.Role.USER

            new_user = models.User(
                username=create_user_req.username,
                hashed_password=hashed_password,
                is_active = True,
                role = role
            )

            db.add(new_user)
            db.commit()
            db.refresh(new_user)
            
            return response.Response(status.HTTP_201_CREATED, response.ResponseMessage.SUC)
        except:
            return response.Response(status.HTTP_400_BAD_REQUEST, response.ResponseMessage.BR)

def update_user_for_admin(create_user_req,id,db):
    db_user = db.query(models.User).filter(models.User.id == id).first()
    
    db_user.username = create_user_req.username
    hashed_password = auth.get_password_hash(create_user_req.password)
    db_user.hashed_password = hashed_password
    
    role = models.Role.USER
    
    if(create_user_req.role.value == "ADMIN"):
        role = models.Role.ADMIN
    else:
        role = models.Role.USER
    db_user.role = role

    db.commit()
    db.refresh(db_user)



def get_user_books_for_admin(userId:int, db):
    user_books = db.query(models.UserBook).filter(models.UserBook.user_id == userId).all()
    if not user_books:
        return response.GetUserBooks(
            status_code=status.HTTP_202_ACCEPTED, 
            user_id=userId, 
            books=[]
        )
    
    db_user = db.query(models.User).filter(models.User.id == userId).first()
    if not db_user:
        return response.Response(status_code=status.HTTP_404_NOT_FOUND, detail=response.ResponseMessage.UN)
    
    books = []
    for user_book in user_books:
        db_book = db.query(models.Book).filter(models.Book.id == user_book.book_id).first()
        if db_book:
            book = response.BookInfo(
                book_name= db_book.book_name,
                author = db_book.author,
                in_library = db_book.is_here,
                return_date = str(user_book.return_date),
                will_return_date= str(user_book.will_return_date),
                user_name=db_user.username
            )
            books.append(book)
    
    return response.GetUserBooks(
        status_code=status.HTTP_202_ACCEPTED, 
        user_id=userId, 
        books=books
    )

def get_my_book(my_book_req, db):
    
    results = db.query(
        models.User.username, 
        models.Book.book_name, 
        models.Book.author, 
        models.UserBook.return_date, 
        models.UserBook.will_return_date, 
        models.UserBook.user_book_is_returned
    ).join(
        models.UserBook, models.User.id == models.UserBook.user_id
    ).join(
        models.Book, models.Book.id == models.UserBook.book_id
    ).filter(
        models.User.username == my_book_req.username
    ).all()

    datas: List[response.GetMyBookResponse] = []
    for result in results: 
        get_my_book_response = response.GetMyBookResults(
            username=result[0],
            book_name=result[1],
            author=result[2],
            return_date=result[3],
            will_return_date=result[4],
            user_book_is_returned=result[5]
        )
    
        datas.append(get_my_book_response)
    return response.GetMyBookResponse(getMyBookResults=datas, status_code=status.HTTP_200_OK)

def reteun_back(return_back_book_request, db):
    
    username = return_back_book_request.username
    book_name = return_back_book_request.book_name
    author = return_back_book_request.author
    return_date = (return_back_book_request.return_date).strftime('%Y-%m-%d')    
    will_return_date = return_back_book_request.will_return_date
    user_book_is_returned = return_back_book_request.user_book_is_returned

    db_book = db.query(models.Book).filter(models.Book.author == author,
                                            models.Book.book_name == book_name,
                                            models.Book.is_here == False).first()
    
    db_book.is_here = True
    db.commit()
    db.refresh(db_book)

    db_user_book = db.query(models.UserBook).filter(models.UserBook.book_id == db_book.id,
                                                     models.UserBook.will_return_date == will_return_date,
                                                     models.UserBook.user_book_is_returned == user_book_is_returned).first()
    
    db_user_book.user_book_is_returned = True
    db_user_book.return_date = return_date

    db.commit()
    db.refresh(db_user_book)
    
    

def available_books(db):
    db_available_books = db.query(models.Book).filter(models.Book.is_here == True).all()    
    return response.GetAvailableBooks(db_available_books, status_code=status.HTTP_200_OK)

def take_book(take_book_request, db):
    db_book = db.query(models.Book).filter(models.Book.id == take_book_request.book_id).first()
    
    db_book.is_here = False
    
    db.commit()
    db.refresh(db_book)
    
    current_date = datetime.now()
    new_date = current_date + timedelta(days=7)
    date_return = new_date.strftime('%Y-%m-%d')

    user_book = models.UserBook(
        return_date= None,
        will_return_date = date_return,
        user_book_is_returned = False,
        user_id = take_book_request.user_id,
        book_id = take_book_request.book_id
    )

    db.add(user_book)
    db.commit()
    db.refresh(user_book)

    return response.Response(status_code=status.HTTP_200_OK,detail=response.ResponseMessage.BT)


def get_user_delay_books(userId, db):

    current_date = (datetime.now()).strftime('%Y-%m-%d')
    delayed_books =  (
        db.query(
            models.Book.book_name, 
            models.Book.author,
            models.Book.is_here,
            models.UserBook.return_date,
            models.UserBook.will_return_date,
            models.User.username)
        .join(models.UserBook, models.Book.id == models.UserBook.book_id)
        .join(models.User, models.User.id == models.UserBook.user_id)
        .filter(models.User.id == userId, models.UserBook.will_return_date < current_date)
        .all()
    )
    
    datas: List[response.GetDelayBooks] = []
    for result in delayed_books:
        
        get_delay_books_response = response.GetDelayBooks(
            book_name=result[0],
            author=result[1],
            is_here=result[2],
            return_date=result[3],
            will_return_date=result[4],
            user_name=result[5]
        )
    
        datas.append(get_delay_books_response)
    
    return response.DelayBookRespone(datas, status_code=status.HTTP_200_OK)

def get_overdue_books(db):
    current_date = (datetime.now()).strftime('%Y-%m-%d')

    overdue_books = (
        db.query(
            models.Book.book_name, 
            models.Book.author,
            models.UserBook.will_return_date,
            models.User.username)
                .join(models.Book, models.Book.id == models.UserBook.book_id)
                .join(models.User, models.User.id == models.UserBook.user_id)
                .filter(models.UserBook.will_return_date < current_date)
                .all()
    )
    datas: List[response.OverdueBook] = []
    for result in overdue_books:
        overdue_books = response.OverdueBook(
            book_name=result[0],
            author=result[1],
            will_return_date=result[2],
            user_name=result[3]
        )

        datas.append(overdue_books)
    return response.OverdueBookResponse(datas, status_code=status.HTTP_200_OK)
