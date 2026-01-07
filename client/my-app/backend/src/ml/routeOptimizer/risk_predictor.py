import pandas as pd
import random
import joblib

risk_model = joblib.load("risk_model.pkl")

def predict_edge_risk(edge, context):
    features = {
        "length": edge.get("length", 100),
        "road_type": edge.get("highway", 1),
        "elevation": context["elevation"],
        "flood_reports": context["flood_reports"],
        "traffic_speed": context["traffic_speed"],
        "water_depth": context["water_depth"],
        "road_width": context["road_width"],
        "visibility": context["visibility"],
        "crowd_density": context["crowd_density"],
        "is_bridge": context["is_bridge"],
        "near_river": context["near_river"],
        "blocked": context["blocked"],
    }

    X = pd.DataFrame([features])
    return float(risk_model.predict(X)[0])
