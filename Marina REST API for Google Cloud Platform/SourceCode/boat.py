from flask import Blueprint, request
from google.cloud import datastore
import json
import constants
import helpers
import responses
import user

client = datastore.Client()
bp = Blueprint('boat', __name__, url_prefix='/boats')


@bp.route('', methods=['GET', 'POST', 'PUT', 'PATCH', 'DELETE'])
def boats():
    # Create a new boat
    if request.method == 'POST':
        if "application/json" in request.accept_mimetypes:
            # If the request has an invalid or missing JWT, verify_jwt will
            # throw an exception and the boat will not be created.
            payload = user.verify_jwt(request)
            # Otherwise, proceed with boat creation
            content = request.get_json()
            if "name" in content and \
                    "type" in content and \
                    "length" in content:
                new_boat = datastore.entity.Entity(key=client.key(constants.boats))
                new_boat.update({"name": content["name"],
                                 "type": content["type"],
                                 "length": content["length"],
                                 "loads": None,
                                 # Owner is the auth0 id of the user who sent
                                 # this request
                                 "owner": payload["sub"][6:]})
                client.put(new_boat)
                new_boat.update({"id": new_boat.key.id,
                                 "self": request.base_url + "/" +
                                         str(new_boat.key.id)})
                return json.dumps(new_boat), 201
            else:
                return json.dumps(constants.missing_400), 400
        # Client doesn't support json
        else:
            return responses.not_acceptable_406()

    # View all boats
    elif request.method == 'GET':
        if "application/json" in request.accept_mimetypes:
            # A valid JWT is required to view this protected resource
            payload = user.verify_jwt(request)
            query = client.query(kind=constants.boats)
            # Only return boats owned by this user
            query.add_filter("owner", "=", payload["sub"][6:])
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
            output = {"Total number of boats for this user": total_num,
                      constants.boats: results}
            if next_url:
                output["next"] = next_url
            return json.dumps(output), 200
        # Client doesn't support json
        else:
            return responses.not_acceptable_406()

    # Invalid method
    else:
        return responses.method_not_allowed_405("GET, POST")


@bp.route('/<boat_id>', methods=['GET', 'POST', 'PUT', 'PATCH', 'DELETE'])
def boats_id(boat_id):
    # View a boat
    if request.method == 'GET':
        if "application/json" in request.accept_mimetypes:
            # A valid JWT is required to view this protected resource
            payload = user.verify_jwt(request)
            boat_key = client.key(constants.boats, int(boat_id))
            boat = client.get(key=boat_key)
            if boat is not None:
                if boat["owner"] == payload["sub"][6:]:
                    boat.update({"id": boat_id,
                                 "self": request.base_url})
                    return json.dumps(boat), 200
                else:
                    return json.dumps(constants.forbidden_403), 403
            else:
                return json.dumps(constants.invalid_boat_id_404), 404
        # Client doesn't support json
        else:
            return responses.not_acceptable_406()

    # Update a boat - partial
    if request.method == 'PATCH':
        # A valid JWT is required to view this protected resource
        payload = user.verify_jwt(request)
        boat_key = client.key(constants.boats, int(boat_id))
        boat = client.get(key=boat_key)
        if boat is not None:
            if boat["owner"] == payload["sub"][6:]:
                content = request.get_json()
                properties = ["name", "type", "length"]
                for i in range(len(properties)):
                    if properties[i] in content:
                        boat[properties[i]] = content[properties[i]]
                client.put(boat)
                return "", 204
            else:
                return json.dumps(constants.forbidden_403), 403
        else:
            return json.dumps(constants.invalid_boat_id_404), 404

    # Update a boat - full
    if request.method == 'PUT':
        # A valid JWT is required to view this protected resource
        payload = user.verify_jwt(request)
        boat_key = client.key(constants.boats, int(boat_id))
        boat = client.get(key=boat_key)
        if boat is not None:
            if boat["owner"] == payload["sub"][6:]:
                content = request.get_json()
                if "name" in content and \
                        "type" in content and \
                        "length" in content:
                    boat.update({"name": content["name"],
                                 "type": content["type"],
                                 "length": content["length"]})
                    client.put(boat)
                    return "", 204
                else:
                    return json.dumps(constants.missing_400), 400
            else:
                return json.dumps(constants.forbidden_403), 403
        else:
            return json.dumps(constants.invalid_boat_id_404), 404

    # Delete a boat
    elif request.method == 'DELETE':
        # A valid JWT is required to view this protected resource
        payload = user.verify_jwt(request)
        boat_key = client.key(constants.boats, int(boat_id))
        boat = client.get(key=boat_key)
        if boat is not None:
            if boat["owner"] == payload["sub"][6:]:
                if boat['loads'] is not None:
                    # Remove this boat as a carrier for all loads associated
                    # with it
                    for e in boat['loads']:
                        load_key = client.key(constants.loads, e["id"])
                        load = client.get(key=load_key)
                        load['carrier'] = None
                        client.put(load)
                client.delete(boat_key)
                return '', 204
            else:
                return json.dumps(constants.forbidden_403), 403
        else:
            return json.dumps(constants.invalid_boat_id_404), 404

    # Invalid method
    else:
        return responses.method_not_allowed_405("GET, PATCH, PUT, DELETE")


@bp.route('/<boat_id>/loads', methods=['GET', 'POST', 'PUT', 'PATCH', 'DELETE'])
def view_loads_for_boat(boat_id):
    # View all the loads for a given boat
    if request.method == 'GET':
        if "application/json" in request.accept_mimetypes:
            # A valid JWT is required to view this protected resource
            payload = user.verify_jwt(request)
            boat_key = client.key(constants.boats, int(boat_id))
            boat = client.get(key=boat_key)
            if boat is not None:
                if boat["owner"] == payload["sub"][6:]:
                    return json.dumps(boat['loads']), 200
                else:
                    return json.dumps(constants.forbidden_403), 403
            else:
                return json.dumps(constants.invalid_boat_id_404), 404
        # Client doesn't support json
        else:
            return responses.not_acceptable_406()

    # Invalid method
    else:
        return responses.method_not_allowed_405("GET")


@bp.route('/<boat_id>/loads/<load_id>', methods=['GET', 'POST', 'PUT', 'PATCH', 'DELETE'])
def manage_loads(boat_id, load_id):
    # Assign a load to a boat
    if request.method == 'PUT':
        # A valid JWT is required to view this protected resource
        payload = user.verify_jwt(request)
        # Get keys and entities
        boat = helpers.get_entity_by_id(constants.boats, int(boat_id))
        load = helpers.get_entity_by_id(constants.loads, int(load_id))
        if boat is None or load is None:
            return json.dumps(constants.invalid_ids_404), 404
        if boat["owner"] == payload["sub"][6:]:
            # Assign load to boat only if load is currently unassigned
            if load['carrier'] is None:
                load['carrier'] = {"id": int(boat_id),
                                   "name": boat['name'],
                                   "self": request.url_root + "boats/" + str(boat_id)}
                client.put(load)
                new_boatload = {'id': int(load_id),
                                'self': request.url_root + 'loads/' + str(load_id)}
                if boat['loads'] is None:
                    boat['loads'] = [new_boatload]
                else:
                    boat['loads'].append(new_boatload)
                client.put(boat)
                return '', 204
            else:
                return json.dumps(constants.load_has_boat_403), 403
        else:
            return json.dumps(constants.forbidden_403), 403

    # Remove a load from a boat
    elif request.method == 'DELETE':
        # A valid JWT is required to view this protected resource
        payload = user.verify_jwt(request)
        # Get keys and entities
        boat = helpers.get_entity_by_id(constants.boats, int(boat_id))
        load = helpers.get_entity_by_id(constants.loads, int(load_id))
        if boat is None or load is None:
            return json.dumps(constants.invalid_ids_404), 404
        if boat["owner"] == payload["sub"][6:]:
            if boat['loads'] is None:
                return json.dumps(constants.boat_missing_load_403), 403
            # Find load in boat's loads
            i = 0
            for e in boat['loads']:
                if e['id'] == int(load_id):
                    # Remove boat from load's carrier
                    load['carrier'] = None
                    client.put(load)
                    # Remove load from boat's loads
                    boat['loads'].pop(i)
                    if len(boat['loads']) == 0:
                        boat['loads'] = None
                    client.put(boat)
                    return '', 204
                i += 1
            return json.dumps(constants.boat_missing_load_403), 403
        else:
            return json.dumps(constants.forbidden_403), 403

    # Invalid method
    else:
        return responses.method_not_allowed_405("PUT, DELETE")
