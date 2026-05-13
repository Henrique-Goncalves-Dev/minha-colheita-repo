from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine
from app.models import usuario, plantio, venda  # noqa: F401 — garante que os models são registrados antes do create_all
from app.database import Base
from app.routers import auth, plantio as plantio_router, venda as venda_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield


app = FastAPI(title="Minha Colheita API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1")
app.include_router(plantio_router.router, prefix="/api/v1")
app.include_router(venda_router.router, prefix="/api/v1")
