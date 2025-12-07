from fastapi import FastAPI
from pydantic import BaseModel
import joblib

app = FastAPI()

# load your trained model
model = joblib.load("model.pkl")

class RecoRequest(BaseModel):
    user_id: str
    viewed_product_ids: list[str] = []
    search_queries: list[str] = []

@app.post("/recommend")
def recommend(req: RecoRequest):
    # This depends on how your model is built.
    # Dummy: just returns product IDs from model.predict(...)
    # Suppose model.predict returns list of product IDs.
    predictions = model.predict([{
        "user_id": req.user_id,
        "viewed_product_ids": ",".join(req.viewed_product_ids),
        "search_queries": " ".join(req.search_queries)
    }])
    return {"recommended_product_ids": predictions[0:10]}
