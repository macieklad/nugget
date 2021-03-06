import json
import os
import traceback
import flask
import sys
import threading
import logging
import time
from datetime import timedelta
import concurrent.futures
import requests

from werkzeug.utils import secure_filename
from src.data.exceptions import ModelNotFoundException
from src.domain.constants import MODEL_FILE_PROCESS

from src.algo.alpha_miner import alpha_miner
from src.algo.inductive_miner import inductive_miner
from src.algo.heuristic_miner import heuristic_miner
from src.algo.dfg import dfg

from src.stats.case_statistics import generate_case_statistics

from config import storage
from src.utils import upload_path, SysRedirect
from config import upload_dir

from flask import Blueprint, request, make_response, abort
routes = Blueprint('routes', __name__)


@routes.get("/model/<name>")
def get_model(name):
    try:
        return storage.load_model(name).json()
    except ModelNotFoundException:
        abort(404, description="Model does not exist")


@routes.get("/models")
def list_models():
    return json.dumps([model.json() for model in storage.list_models()])


@routes.post("/models")
def create_model():
    name = request.json.get('name')
    if name is None:
        abort(400, description="Model name is required while creating it")
    return storage.create_model(name).json()


@routes.get("/model/stats/<model>")
def get_additional_stats(model):
    try:
        return flask.send_file(generate_case_statistics(model))
    except Exception as err:
        return '%s: %s' % (str(err.__class__.__name__), str(err)), 400


@routes.put("/models")
@routes.patch("/models")
def update_model():
    model_name = request.json.get('name')
    if model_name is None:
        abort(400, description="Model name is required while creating it")
    model = storage.load_model(model_name)
    try:
        new_name = request.json.get('new_name')
        if new_name is not None:
            model = storage.rename_model(model_name, new_name)
    except ModelNotFoundException:
        abort(404, description="Model does not exist")
    return model.json()


@routes.post("/file/<model>/<id>")
def upload_file(model, id):
    fn = ""
    file_names = []
    for key in request.files:
        file = request.files[key]
        fn = secure_filename(file.filename)
        file_names.append(fn)
        try:
            path = upload_path(fn)
            if not os.path.exists(upload_dir):
                os.makedirs(upload_dir)
            file.save(path)
            updated_model = storage.store_file(model, id, path)
            return json.dumps({
                'filename': [f for f in file_names],
                'data': updated_model.files[id].json(),
                'id': id
            })
        except Exception as err:
            traceback.print_exc()
            print('save fail: %s, got error %s' % (fn, err))
            return {}, 500


@routes.post("/file/<model>/<id>/raw")
def upload_file_contents(model, id):
    contents = request.json.get('contents')
    ext = ''

    if id == MODEL_FILE_PROCESS:
        ext = '.bpmn'

    dir = upload_path(model)
    if not os.path.exists(dir):
        os.makedirs(dir)

    fp = upload_path("%s/%s%s" % (model, id, ext))

    with open(fp, 'w') as file:
        file.write(contents)

    return storage.store_file(model, id, fp).json()


@routes.get("/file/<model>/<id>")
def get_model_file(model, id):
    model = storage.load_model(model)
    return flask.send_file(model.files[id].loc)


@routes.delete("/file/<model>/<id>")
def delete_model_file(model, id):
    return storage.delete_file(model, id).json()


@routes.post("/models/<model>/discover")
def discover_model(model):
    instance = storage.load_model(model)
    algorithm = request.json.get('algorithm')
    session_id = request.json.get('sessionID')
    model_path = os.path.join(storage.get_model_location(model), "model.bpmn")

    if not instance.has_event_log():
        abort(404, description="Model does not have an event log")

    metrics = None
    try:
        with concurrent.futures.ThreadPoolExecutor() as executor:
            future = executor.submit(
                discover, algorithm, instance.event_log().loc, model_path)
            start = time.time()
            ticks = 5
            alive_tries = 0

            publish("Starting discovery... ", session_id)
            while future.running():
                if ticks == 0:
                    ticks = 5
                    publish("Discovery in progress, elapsed time: %s" %
                            timedelta(seconds=time.time() - start), session_id)

                if not is_alive(session_id):
                    alive_tries += 1

                if alive_tries == 3:
                    future.cancel()
                    return "Client disconnected", 400

                time.sleep(2)
                ticks -= 1

            metrics = future.result()
            publish("Discovery finished, elapsed time: %s" %
                    timedelta(seconds=time.time() - start), session_id)

    except Exception as err:
        return str(err), 400

    instance = storage.store_file(model, MODEL_FILE_PROCESS, model_path)
    instance.discovered_with = algorithm
    instance.metrics = metrics
    storage.write_meta(instance)

    return instance.json()


def discover(algorithm: str, log: str, model_path: str):
    metrics = None
    if algorithm == "alpha-miner":
        metrics = alpha_miner(log, model_path)
    elif algorithm == "inductive-miner":
        metrics = inductive_miner(log, model_path)
    elif algorithm == "heuristic-miner":
        metrics = heuristic_miner(log, model_path)
    elif algorithm == "dfg":
        metrics = dfg(log, model_path)
    else:
        abort(404, description="Specified algorithm does not exist")

    return metrics


def publish(message: str, recipient: str, topic: str = 'discovery'):
    requests.post('http://localhost:5001/publish',
                  json=json.dumps('%s-%s:%s' % (recipient, topic, message)))


def is_alive(id: str):
    return requests.get('http://localhost:5001/alive',
                        params={'id': id}).status_code == requests.codes.ok
