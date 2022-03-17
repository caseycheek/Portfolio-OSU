users = "users"
boats = "boats"
loads = "loads"

missing_400 = {"Error": "Bad Request. The request object is missing at least" +
                        " one of the required attributes."}

unauthorized_401 = {"Error": "Unauthorized."}

forbidden_403 = {"Error": "Forbidden. This user cannot access this boat."}
load_has_boat_403 = {"Error": "Forbidden. This load already has a carrier boat."}
boat_missing_load_403 = {"Error": "Forbidden. This boat is not carrying this load."}

invalid_boat_id_404 = {"Error": "Not Found. No boat with this boat_id exists."}
invalid_load_id_404 = {"Error": "Not Found. No load with this load_id exists."}
invalid_user_id_404 = {"Error": "Not Found. No user with this user_id exists."}
invalid_ids_404 = {"Error": "Not Found. The specified boat and/or load does not exist."}
invalid_id_404 = {"Error": "Not Found. No entity with this id exists."}

meth_not_allowed_405 = {"Error": "Method Not Allowed. Check the Allowed header to see which methods are allowed for this endpoint."}

not_acceptable_406 = {"Error": "Not Acceptable. The accepted MIME type in" +
                               " the request is unsupported."}
