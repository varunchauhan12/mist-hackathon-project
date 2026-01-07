import osmnx as ox
import networkx as nx

def compute_routes(G, start, end):
    start_node = ox.nearest_nodes(G, start[1], start[0])
    end_node   = ox.nearest_nodes(G, end[1], end[0])

    fast_route = nx.shortest_path(
        G,
        start_node,
        end_node,
        weight="length"
    )

    safe_route = nx.shortest_path(
        G,
        start_node,
        end_node,
        weight="risk_weight"
    )

    return fast_route, safe_route
