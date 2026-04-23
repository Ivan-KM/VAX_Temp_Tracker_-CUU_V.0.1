from fastapi import FastAPI
from app.database.connection import engine, Base
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router

app = FastAPI(title = "VaxTrack Vaccine Monitoring API")

app.include_router(router)

@app.get("/")
def root():
    return{
        "message": "VaxTrack API running!"
    }

origins = [
    "http://localhost:3000", '*'
]
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_origins=origins
)
# Todo: migrate all tables when the App runs
 
Base.metadata.create_all(bind=engine)

