from database import SessionLocal
from app import bootstrap
import traceback

if __name__ == '__main__':
    db = SessionLocal()
    try:
        resp = bootstrap(email='icompute@gmail.com', db=db)
        print('RESP:', resp)
    except Exception as e:
        print('EXC:', e)
        traceback.print_exc()
    finally:
        db.close()
