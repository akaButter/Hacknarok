from fastapi import FastAPI 
from db import Base, engine
from mqtt_client import start_mqtt

from api import router
from fastapi.staticfiles import StaticFiles

Base.metadata.create_all(bind=engine)

app = FastAPI()
app.include_router(router)

app.mount("/", StaticFiles(directory="static", html=True), name="static")


# start MQTT przy starcie aplikacji
@app.on_event("startup")
def startup_event():
    start_mqtt()


