from fastapi import APIRouter, Depends, HTTPException

from db import get_db
from sqlalchemy.orm import Session

from models import BusState, User
from ai import compute_comfort

router = APIRouter()

# GET ALL BUSES
@router.get("/buses")
def get_buses(db: Session = Depends(get_db)):

    buses = db.query(BusState).all()

    return [
        {
            "bus_id": b.bus_id,
            "temperature": b.temperature,
            "people_count": b.people_count,
            "general_comfort_level": b.general_comfort_level
        }
        for b in buses
    ]


# GET SINGLE BUS
@router.get("/bus/{bus_id}")
def get_bus(bus_id: str, db: Session = Depends(get_db)):

    bus = db.query(BusState).filter_by(bus_id=bus_id).first()
    if not bus:
        return {"error": "not found"}
    
    return {
        "bus_id": bus.bus_id,
        "sensor": {
            "temperature": bus.temperature,
            "humidity": bus.humidity,
            "pressure": bus.pressure
        },
        "edge": {
            "people_count": bus.people_count,
            "general_comfort_level": bus.general_comfort_level
        }
    }


# REGISTER USER
@router.post("/register")
def register(user: dict, db: Session = Depends(get_db)):

    existing = db.query(User).filter_by(user_id=user["user_id"]).first()

    if existing:
        return {"status": "exists"}

    db.add(User(**user))
    db.commit()

    return {"status": "created"}


# LOGIN USER
@router.post("/login")
def login(credentials: dict, db: Session = Depends(get_db)):
    """
    Expects: {"user_id": "viking123"} 
    (Add "password" check here if your User model has it)
    """
    user_id = credentials.get("user_id")
    user = db.query(User).filter_by(user_id=user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="Viking not found in the Great Hall")

    return {
        "status": "success",
        "message": f"Welcome back, {user.user_id}",
        "user_data": {
            "user_id": user.user_id,
            "age": user.age,
            "sex": user.sex,
            "height": user.height,
            "weight": user.weight
        }
    }

# PERSONALIZED COMFORT
@router.get("/bus/{bus_id}/comfort")
def comfort(bus_id: str, user_id: str, db: Session = Depends(get_db)):

    bus = db.query(BusState).filter_by(bus_id=bus_id).first()
    user = db.query(User).filter_by(user_id=user_id).first()

    if not bus or not user:
        return {"error": "not found"}

    return {
        "bus_id": bus_id,
        "ai": {
            "comfort_level": compute_comfort(bus, user)
        }
    }



@router.post("/bus")
def create_bus(bus_id: str, db: Session = Depends(get_db)):

    existing = db.query(BusState).filter_by(bus_id=bus_id).first()

    if existing:
        return {"status": "exists"}

    new_bus = BusState(
        bus_id=bus_id
        # reszta pól zostaje NULL
    )

    db.add(new_bus)
    db.commit()

    return {
        "status": "created",
        "bus_id": new_bus["bus_id"]
    }