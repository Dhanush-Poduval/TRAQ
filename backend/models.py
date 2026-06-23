from sqlalchemy import Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Violation(Base):
    __tablename__ = 'violations'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    case_id = Column(String, unique=True)
    track_id = Column(Integer)
    time = Column(String)
    signal = Column(String)
    plate_ocr = Column(String)
    infraction = Column(String)
    conf = Column(String)
    location = Column(String)
    status = Column(String, default="PENDING REVIEW")
    video_url = Column(String)
