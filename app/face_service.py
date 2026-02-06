from deepface import DeepFace
import numpy as np
import json

def get_embedding(frame):
    result = DeepFace.represent(
        img_path=frame,
        model_name="Facenet",
        enforce_detection=False
    )
    return np.array(result[0]["embedding"])

def compare(emb1, emb2):
    emb2 = np.array(json.loads(emb2))
    sim = np.dot(emb1, emb2) / (np.linalg.norm(emb1) * np.linalg.norm(emb2))
    return sim
