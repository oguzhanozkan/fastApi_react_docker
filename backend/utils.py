import models

def is_exist_user_by_username(username,db):
    is_exist =  db.query(models.User).filter(models.User.username == username).first()
    if not is_exist:
        return False
    else:
        return True

def get_user_by_username(username,db):
    user = db.query(models.User).filter(models.User.username == username).first()
    if user != None:
        return user
    else:
        return False

def activated_user(user,db):
    user.is_active = True
    db.commit()


def book_already_exist(book, db):
    is_Exist = db.query(models.Book).filter(
        models.Book.book_name == book.book_name,
        models.Book.author ==  book.author).first()
    
    if is_Exist:
        return True
    else:
        return False