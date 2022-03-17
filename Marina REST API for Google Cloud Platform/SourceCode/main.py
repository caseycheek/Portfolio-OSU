# Author: Casey Cheek
# Date: 12/3/2021
# Description: CS493 - Final Project

from flask import Flask, render_template
import boat
import load
import user

app = Flask(__name__)
app.register_blueprint(boat.bp)
app.register_blueprint(load.bp)
app.register_blueprint(user.bp)
app.secret_key = '' # insert secret key here


# Displays the webapp welcome page with a link to create a JWT
@app.route('/')
def index():
    return render_template("welcome.html")


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)
