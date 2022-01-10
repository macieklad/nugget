from pm4py.visualization.graphs import visualizer as graphs_visualizer
from pm4py.statistics.traces.generic.log import case_statistics
from pm4py.util import constants
import pm4py
import os
import shutil
from pm4py.statistics.eventually_follows.log import get as efg_get
from ...config import storage
import os
import shutil


def generate_case_statistics(model_name: str):
    model = storage.load_model(model_name)
    model_dir = storage.get_model_location(model_name)
    stats_location = "%s/stats" % storage.get_model_location(model_name)
    log = pm4py.read_xes(model.event_log().loc)

    if not os.path.exists(stats_location):
        os.makedirs(stats_location)

    x, y = case_statistics.get_kde_caseduration(
        log, parameters={constants.PARAMETER_CONSTANT_TIMESTAMP_KEY: "time:timestamp"})
    gviz = graphs_visualizer.apply_plot(
        x, y, parameters={graphs_visualizer.Variants.CASES.value.Parameters.FORMAT: "svg"}, variant=graphs_visualizer.Variants.CASES)

    graphs_visualizer.save(gviz, "%s/case_plot.svg" % stats_location)

    gviz = graphs_visualizer.apply_semilogx(
        x, y, parameters={graphs_visualizer.Variants.CASES.value.Parameters.FORMAT: "svg"}, variant=graphs_visualizer.Variants.CASES)

    graphs_visualizer.save(
        gviz, "%s/graph_numeric_attribute_semilog.svg" % stats_location)

    x, y = case_statistics.get_kde_caseduration(
        log, parameters={constants.PARAMETER_CONSTANT_TIMESTAMP_KEY: "time:timestamp"})
    gviz = graphs_visualizer.apply_plot(
        x, y, parameters={graphs_visualizer.Variants.DATES.value.Parameters.FORMAT: "svg"}, variant=graphs_visualizer.Variants.DATES)

    graphs_visualizer.save(
        gviz, "%s/graph_events_over_time.svg" % stats_location)

    gviz = graphs_visualizer.apply_semilogx(
        x, y, parameters={graphs_visualizer.Variants.DATES.value.Parameters.FORMAT: "svg"}, variant=graphs_visualizer.Variants.DATES)

    graphs_visualizer.save(
        gviz, "%s/graph_numeric_attribute_semilog.svg" % stats_location)

    x, y = case_statistics.get_kde_caseduration(
        log, parameters={constants.PARAMETER_CONSTANT_TIMESTAMP_KEY: "time:timestamp"})
    gviz = graphs_visualizer.apply_plot(
        x, y, parameters={graphs_visualizer.Variants.ATTRIBUTES.value.Parameters.FORMAT: "svg"}, variant=graphs_visualizer.Variants.ATTRIBUTES)

    graphs_visualizer.save(
        gviz, "%s/graph_numeric_attribute.svg" % stats_location)

    gviz = graphs_visualizer.apply_semilogx(
        x, y, parameters={graphs_visualizer.Variants.ATTRIBUTES.value.Parameters.FORMAT: "svg"}, variant=graphs_visualizer.Variants.ATTRIBUTES)

    graphs_visualizer.save(
        gviz, "%s/graph_numeric_attribute_semilog.svg" % stats_location)

    pm4py.save_vis_dotted_chart(
        log, file_path="%s/dotted_chart.svg" % stats_location)

    archive_path = os.path.join(model_dir, "stats")
    shutil.make_archive(archive_path, 'zip', stats_location)

    return archive_path + '.zip'
