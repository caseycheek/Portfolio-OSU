from google.cloud import datastore
import json
import constants

client = datastore.Client()


def get_entity_by_id(kind_str, id_int):
    """
    Retrieve an entity from the database.
    :param kind_str: The kind of the entity (str)
    :param id_int: The entity's id (int)
    :return: The entity object.
    """
    the_key = client.key(kind_str, id_int)
    return client.get(key=the_key)


def view_all_of_kind(kind_str, req):
    """
    Retrieve a collection of data and paginate the results, showing up to 5
    entries at a time. Each page contains a 'next' link except the last.
    :param kind_str: The kind of the entity (str)
    :param req: The request object
    :return: A JSON response object and a 200 status code.
    """
    query = client.query(kind=kind_str)
    q_limit = int(req.args.get('limit', '5'))
    q_offset = int(req.args.get('offset', '0'))
    l_iterator = query.fetch(limit=q_limit, offset=q_offset)
    pages = l_iterator.pages
    results = list(next(pages))
    if l_iterator.next_page_token:
        next_offset = q_offset + q_limit
        next_url = req.base_url + \
                   "?limit=" + \
                   str(q_limit) + \
                   "&offset=" + \
                   str(next_offset)
    else:
        next_url = None
    for e in results:
        e.update({"id": e.key.id,
                  "self": req.base_url + "/" + str(e.key.id)})
    output = {kind_str: results}
    if next_url:
        output["next"] = next_url
    return json.dumps(output), 200


def view_by_id(kind_str, id_int, req):
    """
    Retrieve the data for an entity.
    :param kind_str: The kind of the entity (str)
    :param id_int: The entity's id (int)
    :param req: The request object
    :return:
        - If the kind and id are valid: 200 status + a JSON response object
        with the entity data, id, and self link.
        - Otherwise: 404 status + JSON error message.
    """
    the_entity = get_entity_by_id(kind_str, id_int)
    if the_entity is not None:
        the_entity.update({"id": id_int,
                           "self": req.base_url})
        return json.dumps(the_entity), 200
    else:
        if kind_str == constants.boats:
            return json.dumps(constants.invalid_boat_id_404), 404
        if kind_str == constants.loads:
            return json.dumps(constants.invalid_load_id_404), 404
        if kind_str == constants.users:
            return json.dumps(constants.invalid_user_id_404), 404
        return json.dumps(constants.invalid_id_404), 404
