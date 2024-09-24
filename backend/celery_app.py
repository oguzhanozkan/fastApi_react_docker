from celery import Celery
from fastapi import HTTPException
import os, smtplib
from email.message import EmailMessage

from datetime import datetime, timedelta
import models
from database import SessionLocal

from dotenv import load_dotenv

load_dotenv(".env")

email =  str(os.getenv("EMAIL_FROM"))
password = str(os.getenv("EMAIL_PASS"))

celery_app = Celery(
    "tasks",
    broker = str(os.getenv("REDIS")),
    backend = str(os.getenv("REDIS"))
)

celery_app.conf.beat_schedule = {
    "add-every-day": {
        "task": "send.overdue.books",
        "schedule": timedelta(days=1), 
        "args": (),
    },
}

"""
celery_app.conf.beat_schedule = {
    'add-every-30-seconds': {
        'task': 'send.overdue.books',
        'schedule': 30.0,
        'args': ()
    },
}
"""

@celery_app.task(name="send.overdue.books")
def find_send_overdue_books_and_send_mail():
    current_date = (datetime.now()).strftime('%Y-%m-%d')
    session = SessionLocal()
    
    try:
        overdue_books = (
            session.query(models.UserBook.user_id, models.User.username, models.Book.book_name)
                          .join(models.User, models.UserBook.user_id == models.User.id)
                          .join(models.Book, models.UserBook.book_id == models.Book.id)
                          .filter(models.UserBook.will_return_date < current_date)
                          .all()
        )

        if(len(overdue_books) > 0):
            for ob in overdue_books:
                send_mail(ob.username, ob.book_name, ob.username)


    except Exception as e:
        print("Error: ", e)
    
    finally:
        session.close()


def send_mail(to,book_name,username):
    try:
        user = str(os.getenv("EMAIL_FROM"))
        password = str(os.getenv("EMAIL_PASS"))
        smtp = str(os.getenv("SMTP"))
        port = int(os.getenv("EMAIL_PORT"))

        msg = EmailMessage()
        msg.add_alternative(
        f"""\
        <html>
        <head>
            <title>Document</title>
        </head>
        <body>
            <div id="box">
                <h2>Hello {username},</h2> 
                    <from>
                        <p> 
                            <a>
                                get back book {book_name} 
                            </a>
                        </p>
                    </form>
            </div>
        </body>
        </html>
        """,
        subtype="html",
    )
        msg['subject'] = "overdue book"
        msg['to'] = to
    
        msg['from'] = user
    

        server = smtplib.SMTP(smtp,port)
        server.starttls()
        server.login(user,password)
        server.send_message(msg)

        server.quit()
        return {"message": "Email sent successfully"}
        
    except Exception as e:
        #return "error"
        raise HTTPException(status_code=500, detail=e)

    
