from pm4py import write_bpmn
from pm4py.objects.log.importer.xes import importer as xes_importer
from pm4py.objects.conversion.wf_net import converter
from pm4py.algo.discovery.dfg import algorithm as dfg_discovery
from pm4py.objects.conversion.dfg import converter as dfg_mining

from pm4py.algo.evaluation.replay_fitness import algorithm as replay_fitness_evaluator
from pm4py.algo.evaluation.precision import algorithm as precision_evaluator
from pm4py.algo.evaluation.generalization import algorithm as generalization_evaluator
from pm4py.algo.evaluation.simplicity import algorithm as simplicity_evaluator

from src.domain.ModelMetrics import ModelMetrics


def dfg(event_log: str, bpmn_out: str) -> ModelMetrics:
    log = xes_importer.apply(event_log)
    dfg = dfg_discovery.apply(log)
    net, im, fm = dfg_mining.apply(dfg)
    bpmn = converter.apply(net, im, fm, variant=converter.Variants.TO_BPMN)

    write_bpmn(bpmn, bpmn_out, enable_layout=True)

    fitness = replay_fitness_evaluator.apply(
        log, net, im, fm, variant=replay_fitness_evaluator.Variants.ALIGNMENT_BASED)
    prec_etc = precision_evaluator.apply(
        log, net, im, fm, variant=precision_evaluator.Variants.ETCONFORMANCE_TOKEN)
    prec_aetc = precision_evaluator.apply(
        log, net, im, fm, variant=precision_evaluator.Variants.ALIGN_ETCONFORMANCE)
    gen = generalization_evaluator.apply(log, net, im, fm)
    simp = simplicity_evaluator.apply(net)

    return ModelMetrics(fitness, prec_etc, prec_aetc, gen, simp)
