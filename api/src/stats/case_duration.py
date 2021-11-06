from pm4py.visualization.graphs import visualizer as graphs_visualizer
from pm4py.statistics.traces.generic.log import case_statistics
from pm4py.util import constants
import pm4py
import os
import shutil
from pm4py.statistics.eventually_follows.log import get as efg_get


log = pm4py.read_xes("activitylog_uci_detailed_labour.xes")
efg_graph = efg_get.apply(log)


x, y = case_statistics.get_kde_caseduration(
    log, parameters={constants.PARAMETER_CONSTANT_TIMESTAMP_KEY: "time:timestamp"})
gviz = graphs_visualizer.apply_plot(
    x, y, parameters={graphs_visualizer.Variants.CASES.value.Parameters.FORMAT: "svg"}, variant=graphs_visualizer.Variants.CASES)

graphs_visualizer.save(gviz, "graph.svg")


gviz = graphs_visualizer.apply_semilogx(
    x, y, parameters={graphs_visualizer.Variants.CASES.value.Parameters.FORMAT: "svg"}, variant=graphs_visualizer.Variants.CASES)

graphs_visualizer.save(gviz, "graph_numeric_attribute_semilog.svg")

x, y = case_statistics.get_kde_caseduration(
    log, parameters={constants.PARAMETER_CONSTANT_TIMESTAMP_KEY: "time:timestamp"})
gviz = graphs_visualizer.apply_plot(
    x, y, parameters={graphs_visualizer.Variants.DATES.value.Parameters.FORMAT: "svg"}, variant=graphs_visualizer.Variants.DATES)

graphs_visualizer.save(gviz, "graph_events_over_time.svg")

gviz = graphs_visualizer.apply_semilogx(
    x, y, parameters={graphs_visualizer.Variants.DATES.value.Parameters.FORMAT: "svg"}, variant=graphs_visualizer.Variants.DATES)

graphs_visualizer.save(gviz, "graph_numeric_attribute_semilog.svg")

x, y = case_statistics.get_kde_caseduration(
    log, parameters={constants.PARAMETER_CONSTANT_TIMESTAMP_KEY: "time:timestamp"})
gviz = graphs_visualizer.apply_plot(
    x, y, parameters={graphs_visualizer.Variants.ATTRIBUTES.value.Parameters.FORMAT: "svg"}, variant=graphs_visualizer.Variants.ATTRIBUTES)

graphs_visualizer.save(gviz, "graph_numeric_attribute.svg")

gviz = graphs_visualizer.apply_semilogx(
    x, y, parameters={graphs_visualizer.Variants.ATTRIBUTES.value.Parameters.FORMAT: "svg"}, variant=graphs_visualizer.Variants.ATTRIBUTES)

graphs_visualizer.save(gviz, "graph_numeric_attribute_semilog.svg")
