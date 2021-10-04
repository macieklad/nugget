from pm4py import write_bpmn
from pm4py.objects.log.importer.xes import importer as xes_importer
from pm4py.algo.discovery.alpha import algorithm as alpha_miner
from pm4py.objects.conversion.wf_net import converter
# log = xes_importer.apply('running-example.xes')
# net, im, fm = alpha_miner.apply(log)
# bpmn = converter.apply(net, im, fm, variant=converter.Variants.TO_BPMN)
# write_bpmn(bpmn, "graph.bpmn", enable_layout=True)
