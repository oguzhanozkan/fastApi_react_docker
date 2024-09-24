import os, smtplib
from email.message import EmailMessage
from fastapi import HTTPException
from dotenv import load_dotenv

load_dotenv(".env")


email =  str(os.getenv("EMAIL_FROM"))
password = str(os.getenv("EMAIL_PASS"))

def send_mail_for_active_user(to,token,username):
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
                        <p> click
                            <a href="http://localhost:8000/verify/{token}">
                                link
                            </a> for activate your registration
                        </p>
                    </form>
            </div>
        </body>
        </html>
        """,
        subtype="html",
    )
        #msg.set_content(token)
        msg['subject'] = token
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