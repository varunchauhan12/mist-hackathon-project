import osmnx as ox
import networkx as nx

PLACE = "Delhi, India"

print("Loading road network...")
G = ox.graph_from_place(
    PLACE,
    network_type="drive",
    simplify=True
)

G = ox.add_edge_lengths(G)
print("Graph loaded:", len(G.nodes), "nodes")
