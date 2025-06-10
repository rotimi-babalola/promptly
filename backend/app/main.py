from fastapi import FastAPI


app = FastAPI()

@app.get("/")
def read_root():
    """Root endpoint that returns a simple greeting."""
    return {"message": "Hello, World!"}
