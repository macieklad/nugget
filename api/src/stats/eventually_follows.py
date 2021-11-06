from pm4py.statistics.eventually_follows.log import get as efg_get
from pm4py.visualization.dfg import visualizer

import pm4py
log = pm4py.read_xes("activitylog_uci_detailed_labour.xes")
efg_graph = efg_get.apply(log)
gviz = visualizer.apply(efg_graph, parameters={
                        visualizer.Variants.PERFORMANCE.value.Parameters.FORMAT: "svg"})
visualizer.save(gviz, "viz.svg")
