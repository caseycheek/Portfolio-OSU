from flask import make_response
import json
import constants


def method_not_allowed_405(allowed_methods):
    """
    Create a response object with the allowed methods in the header.
    :param allowed_methods: String of the allowed methods (example: "GET,
        DELETE, PUT, PATCH")
    :return: Response object with 405 status code
    """
    res = make_response(json.dumps(constants.meth_not_allowed_405))
    res.mimetype = "application/json"
    #res.headers.set("Content-Type", "application/json")
    res.headers.set("Allow", allowed_methods)
    res.status_code = 405
    return res


def not_acceptable_406():
    """
    Create a response object with a 406 error message.
    :return: Response object with 406 status code and JSON error message
    """
    res = make_response(json.dumps(constants.not_acceptable_406))
    res.mimetype = "application/json"
    res.status_code = 406
    return res
