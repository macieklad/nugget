from pm4py.visualization.graphs import visualizer as graphs_visualizer
from pm4py.statistics.traces.generic.log import case_statistics
from pm4py.util import constants
import pm4py
import os
import shutil
from pm4py.statistics.eventually_follows.log import get as efg_get


log = pm4py.read_xes("activitylog_uci_detailed_labour.xes")
pm4py.save_vis_dotted_chart(log, file_path="dotted.svg")
