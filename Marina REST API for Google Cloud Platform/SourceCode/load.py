from flask import Blueprint, request
from google.cloud import datastore
import json
import constants
import helpers
import responses

client = datastore.Client()
bp = Blueprint('load', __name__, url_prefix='/loads')


@bp.route('', methods=['GET', 'POST', 'PUT', 'PATCH', 'DELETE'])
def loads():
    # Create a new load
    if request.method == 'POST':
        if "application/json" in request.accept_mimetypes:
            content = request.get_json()
            if "volume" in content and \
                    "content" in content and \
                    "creation_date" in content:
                new_load = datastore.entity.Entity(key=client.key(constants.loads))
                new_load.update({"volume": content["volume"],
                                 "carrier": None,
                                 "content": content["content"],
                                 "creation_date": content["creation_date"]})
                client.put(new_load)
                new_load.update({"id": new_load.key.id,
                                 "self": request.base_url + "/" + str(new_load.key.id)})
                return json.dumps(new_load), 201
            else:
                return json.dumps(constants.missing_400), 400
        # Client doesn't support json
        else:
            return responses.not_acceptable_406()

    # View all loads
    elif request.method == 'GET':
        if "application/json" in request.accept_mimetypes:
            query = client.query(kind=constants.loads)
            # Get the total number of entries
            total_num = len(list(query.fetch()))
            # Then get paginated results
            q_limit = int(request.args.get('limit', '5'))
            q_offset = int(request.args.get('offset', '0'))
            l_iterator = query.fetch(limit=q_limit, offset=q_offset)
            pages = l_iterator.pages
            results = list(next(pages))
            if l_iterator.next_page_token:
                next_offset = q_offset + q_limit
                next_url = request.base_url + \
                           "?limit=" + \
                           str(q_limit) + \
                           "&offset=" + \
                           str(next_offset)
            else:
                next_url = None
            for e in results:
                e.update({"id": e.key.id,
                          "self": request.base_url + "/" + str(e.key.id)})
            output = {"Total number of loads": total_num,
                      constants.loads: results}
            if next_url:
                output["next"] = next_url
            return json.dumps(output), 200
        # Client doesn't support json
        else:
            return responses.not_acceptable_406()

    # Invalid method
    else:
        return responses.method_not_allowed_405("GET, POST")


@bp.route('/<load_id>', methods=['GET', 'POST', 'PUT', 'PATCH', 'DELETE'])
def loads_id(load_id):
    # View a load
    if request.method == 'GET':
        if "application/json" in request.accept_mimetypes:
            return helpers.view_by_id(constants.loads, int(load_id), request)
        # Client doesn't support json
        else:
            return responses.not_acceptable_406()

    # Update a load - partial
    if request.method == 'PATCH':
        load_key = client.key(constants.loads, int(load_id))
        load = client.get(key=load_key)
        if load is not None:
            content = request.get_json()
            properties = ["volume", "content", "creation_date"]
            for i in range(len(properties)):
                if properties[i] in content:
                    load[properties[i]] = content[properties[i]]
            client.put(load)
            return "", 204
        else:
            return json.dumps(constants.invalid_load_id_404), 404

    # Update a load - full
    if request.method == 'PUT':
        load_key = client.key(constants.loads, int(load_id))
        load = client.get(key=load_key)
        if load is not None:
            content = request.get_json()
            if "volume" in content and \
                    "content" in content and \
                    "creation_date" in content:
                load.update({"volume": content["volume"],
                             "content": content["content"],
                             "creation_date": content["creation_date"]})
                client.put(load)
                return "", 204
            else:
                return json.dumps(constants.missing_400), 400
        else:
            return json.dumps(constants.invalid_load_id_404), 404

    # Delete a load
    elif request.method == 'DELETE':
        load_key = client.key(constants.loads, int(load_id))
        load = client.get(key=load_key)
        if load is not None:
            # Remove this load from the boat carrying it (if any)
            if load['carrier'] is not None:
                boat_key = client.key(constants.boats, load['carrier']['id'])
                boat = client.get(key=boat_key)
                i = 0
                for e in boat['loads']:
                    if e['id'] == int(load_id):
                        boat['loads'].pop(i)
                        if len(boat['loads']) == 0:
                            boat['loads'] = None
                        break
                    i += 1
                client.put(boat)
            client.delete(load_key)
            return '', 204
        else:
            return json.dumps(constants.invalid_load_id_404), 404

    # Invalid method
    else:
        return responses.method_not_allowed_405("GET, PATCH, PUT, DELETE")
