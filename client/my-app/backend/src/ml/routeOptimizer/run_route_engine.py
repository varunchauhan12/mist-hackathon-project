from build_graph import G
from attach_risk import attach_risk_weights
from route_engine import compute_routes
from plot_routes import plot

start = (28.6139, 77.2090)   # Connaught Place
end   = (28.7041, 77.1025)   # Rohini

G = attach_risk_weights(G)

fast, safe = compute_routes(G, start, end)

plot(G, fast, safe)
