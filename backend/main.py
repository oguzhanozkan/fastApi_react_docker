from fastapi import FastAPI
from database import engine
import models
import controller as ctrl
from fastapi.middleware.cors import CORSMiddleware
from initial import add_initial_books, add_initial_users

models.Base.metadata.create_all(bind=engine)

add_initial_users()
add_initial_books()


app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ctrl.router)

    
