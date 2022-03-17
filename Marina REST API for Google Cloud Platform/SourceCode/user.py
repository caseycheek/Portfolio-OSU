import flask
from flask import Blueprint, request, jsonify, render_template
from google.cloud import datastore
import json
import constants
import responses
import requests
from six.moves.urllib.request import urlopen
from jose import jwt
from authlib.integrations.flask_client import OAuth

client = datastore.Client()
bp = Blueprint('user', __name__, url_prefix='/users')

CLIENT_ID = 'dvJkAlVfy4aT2neOlH6F8NN1XDsVUV1X'
CLIENT_SECRET = '' # Insert cient secret here
DOMAIN = 'final-project-cheekc.us.auth0.com'
ALGORITHMS = ["RS256"]

oauth = OAuth(flask.current_app)
auth0 = oauth.register(
    'auth0',
    client_id=CLIENT_ID,
    client_secret=CLIENT_SECRET,
    api_base_url="https://" + DOMAIN,
    access_token_url="https://" + DOMAIN + "/oauth/token",
    authorize_url="https://" + DOMAIN + "/authorize",
    client_kwargs={
        'scope': 'openid profile email',
    },
)


class AuthError(Exception):
    def __init__(self, error, status_code):
        self.error = error
        self.status_code = status_code


@bp.app_errorhandler(AuthError)
def handle_auth_error(ex):
    response = jsonify(ex.error)
    response.status_code = ex.status_code
    return response


# Verify the JWT in the request's Authorization header
def verify_jwt(request):
    if 'Authorization' in request.headers:
        auth_header = request.headers['Authorization'].split()
        token = auth_header[1]
    else:
        raise AuthError({"code": "no auth header",
                         "description": "Authorization header is missing"},
                        401)

    jsonurl = urlopen("https://" + DOMAIN + "/.well-known/jwks.json")
    jwks = json.loads(jsonurl.read())
    try:
        unverified_header = jwt.get_unverified_header(token)
    except jwt.JWTError:
        raise AuthError({"code": "invalid_header",
                         "description":
                             "Invalid header. "
                             "Use an RS256 signed JWT Access Token"}, 401)
    if unverified_header["alg"] == "HS256":
        raise AuthError({"code": "invalid_header",
                         "description":
                             "Invalid header. "
                             "Use an RS256 signed JWT Access Token"}, 401)
    rsa_key = {}
    for key in jwks["keys"]:
        if key["kid"] == unverified_header["kid"]:
            rsa_key = {
                "kty": key["kty"],
                "kid": key["kid"],
                "use": key["use"],
                "n": key["n"],
                "e": key["e"]
            }
    if rsa_key:
        try:
            payload = jwt.decode(
                token,
                rsa_key,
                algorithms=ALGORITHMS,
                audience=CLIENT_ID,
                issuer="https://" + DOMAIN + "/"
            )
        except jwt.ExpiredSignatureError:
            raise AuthError({"code": "token_expired",
                             "description": "token is expired"}, 401)
        except jwt.JWTClaimsError:
            raise AuthError({"code": "invalid_claims",
                             "description":
                                 "incorrect claims,"
                                 " please check the audience and issuer"}, 401)
        except Exception:
            raise AuthError({"code": "invalid_header",
                             "description":
                                 "Unable to parse authentication"
                                 " token."}, 401)

        return payload
    else:
        raise AuthError({"code": "no_rsa_key",
                         "description":
                             "No RSA key in JWKS"}, 401)


# Decode the JWT supplied in the Authorization header
@bp.route('/decode', methods=['GET'])
def decode_jwt():
    payload = verify_jwt(request)
    return payload


# Generate a JWT from the Auth0 domain and return it
# Request: JSON body with 2 properties with "username" and "password"
#       of a user registered with this Auth0 domain
# Response: JSON with the JWT as the value of the property id_token
@bp.route('/login', methods=['POST'])
def login_user():
    content = request.get_json()
    username = content["username"]
    password = content["password"]
    body = {'grant_type': 'password', 'username': username,
            'password': password,
            'client_id': CLIENT_ID,
            'client_secret': CLIENT_SECRET}
    headers = {'content-type': 'application/json'}
    url = 'https://' + DOMAIN + '/oauth/token'
    r = requests.post(url, json=body, headers=headers)
    return r.text, 200, {'Content-Type': 'application/json'}


# Directs the user to login/create and account with Auth0
@bp.route('/webapp_login')
def webapp_login():
    return auth0.authorize_redirect(redirect_uri=request.root_url + "users/callback")


# Gets a JWT from Auth0 then displays the JWT and user id on the user info page
@bp.route('/callback')
def callback_handling():
    token = auth0.authorize_access_token()
    jwt = token["id_token"]
    resp = auth0.get('userinfo')
    userinfo = resp.json()
    auth0_id = userinfo['sub'][6:]

    # If the user id is already in datastore, then just display the userInfo
    # page. Otherwise, add the new user id to datastore first, then render the
    # page.
    query = client.query(kind=constants.users)
    results = list(query.fetch())
    for e in results:
        if e.key.name == auth0_id:
            print("*** user id already in datastore")
            return render_template('userInfo.html',
                                   jwt=jwt,
                                   user_id=auth0_id)
    key = client.key(constants.users, auth0_id)
    new_user = datastore.entity.Entity(key=key)
    client.put(new_user)
    print("** added new user to datastore")
    return render_template('userInfo.html',
                           jwt=jwt,
                           user_id=auth0_id)


@bp.route('', methods=['GET', 'POST', 'PUT', 'PATCH', 'DELETE'])
def users():
    # View all users
    if request.method == 'GET':
        if "application/json" in request.accept_mimetypes:
            query = client.query(kind=constants.users)
            results = list(query.fetch())
            for e in results:
                e.update({"id": e.key.name,
                          "self": request.base_url + "/" + str(e.key.name)})
            return json.dumps(results), 200
        # Client doesn't support json
        else:
            return responses.not_acceptable_406()

    # Invalid method
    else:
        return responses.method_not_allowed_405("GET")


@bp.route('/<user_id>', methods=['GET', 'POST', 'PUT', 'PATCH', 'DELETE'])
def users_id(user_id):
    # View a user
    if request.method == 'GET':
        if "application/json" in request.accept_mimetypes:
            key = client.key(constants.users, user_id)
            user = client.get(key=key)
            if user is not None:
                user.update({"id": user_id, "self": request.base_url})
                return json.dumps(user), 200
            else:
                return json.dumps(constants.invalid_user_id_404), 404
        # Client doesn't support json
        else:
            return responses.not_acceptable_406()

    # Invalid method
    else:
        return responses.method_not_allowed_405("GET")



