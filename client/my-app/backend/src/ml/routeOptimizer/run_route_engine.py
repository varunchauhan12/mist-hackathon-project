from build_graph import G
from attach_risk import attach_risk_weights
from route_engine import compute_routes

def compute_safe_and_fast(start, end, context):
    graph = attach_risk_weights(G, context)
    fast, safe = compute_routes(graph, start, end)
    return fast, safe, graph
