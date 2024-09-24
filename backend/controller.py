from fastapi import APIRouter, Request
import service, schemas, auth, service
from sqlalchemy.orm import Session
from database import get_db
from fastapi import Depends
from fastapi.security import OAuth2PasswordRequestForm

from fastapi.templating import Jinja2Templates

templates = Jinja2Templates(directory="templates")

router = APIRouter()

@router.post("/register")
async def create_user(user: schemas.UserSchema, db: Session = Depends(get_db)):
    return service.create_user(user, db)

@router.get("/verify/{token}")
async def active_user(request: Request, token: str, db: Session = Depends(get_db)):
    username = service.active_user(token, db)
    return templates.TemplateResponse("confirmation.html", {"request": request,"username": username})

@router.post("/login")
async def login(data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    return service.userLogin(data, db)

@router.get("/allusers", dependencies=[Depends(auth.check_admin)])
async def get_all_users(db: Session = Depends(get_db)):
    return service.get_all_users(db)

@router.post("/allBooks",dependencies=[Depends(auth.check_admin)])
async def get_all_books(db: Session = Depends(get_db)):
    return service.get_all_books(db)

@router.delete("/deleteBook/{id}", dependencies=[Depends(auth.check_admin)])
async def delete_book(id: int, db: Session = Depends(get_db)):
    return service.delete_book(id, db)

@router.delete("/deleteUser/{id}", dependencies=[Depends(auth.check_admin)])
async def deleteUser(id:int, db: Session = Depends(get_db)):
    return service.delete_user(id,db)

@router.post("/createBook", dependencies=[Depends(auth.check_admin)])
async def book_create(book: schemas.CreateBook, db: Session = Depends(get_db)):
    return service.create_book(book,db)

@router.put("/updateBook/{id}",  dependencies=[Depends(auth.check_admin)])
async def update_book(id: int, book: schemas.BookUpdate ,db: Session = Depends(get_db)):
    return service.update_book(id, book, db)

@router.post("/bookGiveUser", dependencies=[Depends(auth.check_admin)])
async def bookGiveUser(give_book_to_user_req :schemas.GiveBookToUser, db: Session = Depends(get_db)):
    return service.give_book_to_user(give_book_to_user_req,db)

@router.post("/adminAccessCreateUser", dependencies=[Depends(auth.check_admin)])
async def createUser(create_user_req: schemas.CreateUserRequest, db: Session = Depends(get_db)):
    return service.create_user_for_admin(create_user_req,db)

@router.put("/updateUser/{id}", dependencies=[Depends(auth.check_admin)])
async def updateUser(create_user_req: schemas.CreateUserRequest,id:int, db: Session = Depends(get_db)):
    return service.update_user_for_admin(create_user_req,id,db)

@router.post("/getUserBooks/{userId}", dependencies=[Depends(auth.check_admin)])
async def get_user_books(userId:int, db: Session = Depends(get_db)):
    return service.get_user_books_for_admin(userId, db)

@router.post("/myBooks", dependencies=[Depends(auth.get_current_user)])
async def get_my_book(my_book_req: schemas.MyBooksRequest, db: Session = Depends(get_db)):
    return service.get_my_book(my_book_req, db)

@router.post("/returnBack", dependencies=[Depends(auth.get_current_user)])
async def reteun_back(return_back_book_request: schemas.ReturnBackBookRequest, db: Session = Depends(get_db)):
    service.reteun_back(return_back_book_request, db)

@router.get("/availableBooks", dependencies=[Depends(auth.get_current_user)])
async def available_books(db: Session = Depends(get_db)):
    return service.available_books(db)
    
@router.post("/takeBook", dependencies=[Depends(auth.get_current_user)])
async def take_book(take_book_request:schemas.TakeBookRequest, db: Session = Depends(get_db)):
    return service.take_book(take_book_request, db)

@router.post("/getDelayBooks/{userId}", dependencies=[Depends(auth.get_current_user)])
async def get_user_delay_books(userId:int, db: Session = Depends(get_db)):
    return service.get_user_delay_books(userId, db)

@router.get("/overduebooks", dependencies=[Depends(auth.check_admin)])
async def get_overdue_books(db: Session = Depends(get_db)):
    return service.get_overdue_books(db)