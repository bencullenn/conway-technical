from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/upload-dataset")
async def upload(
    file: UploadFile = File(...),
):
    return {"filename": file.filename}


async def ingest():
    pass


async def clean():
    pass


async def transform():
    pass


async def detect():
    pass
