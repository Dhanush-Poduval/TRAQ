# trigger_violation.py
from backend.database import SessionLocal
from backend.models import Violation
import datetime

def force_violation():
    db = SessionLocal()
    
    # Define a fake violation
    violation = Violation(
        case_id=f"VIOL-DEMO-{int(datetime.datetime.now().timestamp())}",
        track_id=99,
        time="17:50:01",
        signal="CAM-KORAMANGALA",
        plate_ocr="KA03EX17300",
        infraction="RED LIGHT VIOLATION",
        conf="99.9%",
        location="80FT RD JUNCTION",
        status="PENDING REVIEW",
        video_url="http://localhost:8000/static/evidence/clips/demo_clip.mp4" 
    )
    
    db.add(violation)
    db.commit()
    db.close()
    print("Violation injected into database successfully!")

if __name__ == "__main__":
    force_violation()
