from __main__ import (
    app,
    session,
    redirect,
    render_template,
    request,
    jsonify,
    uuid4,
    USERS,
)
from json import (
    dumps,
)  # https://stackoverflow.com/questions/11994325/how-to-divide-flask-app-into-multiple-py-files

### LOGIN ###
@app.route("/login")
def login():
    if "user" in session:
        return redirect("/")

    return render_template("login.html")


@app.route("/login", methods=["POST"])
def post_login():
    username = request.json["username"]
    password = request.json["password"]

    # user = list(
    #     filter(
    #         lambda x: x["username"] == username and x["password"] == password,
    #         [*USERS.find({})],
    #     )
    # )

    user = USERS.find_one({"username": username, "password": password})

    if not user:
        return jsonify(
            {
                "data": {},
                "error": [
                    {"field": "username", "message": "incorrect credentials"},
                    {"field": "password", "message": "incorrect credentials"},
                ],
            },
        )

    # login into account which shouldss be included in database
    # connect flask session cookies

    session["user"] = user

    return jsonify(
        {
            "data": user,
            "error": None,
        },
    )


### LOGIN end ###


### REGISTER ###
@app.route("/register")
def register():
    if "user" in session:
        return redirect("/")

    return render_template("register.html")


@app.route("/register", methods=["POST"])
def post_register():

    username = request.json["username"]
    password1 = request.json["password1"]

    # user = list(filter(lambda x: x["username"] == username, [*USERS.find({})]))

    user = USERS.find_one(
        {
            "username": username,
        }
    )

    if user:
        return jsonify(
            {
                "data": {},
                "error": [
                    {"field": "username", "message": "username already taken"},
                ],
            },
        )

    # add more text verification

    user = {
        "_id": "cl_" + str(uuid4()),
        "username": username,
        "password": password1,
        "privledge": "CLIENT",
        "cart": [],
    }

    # save user to database
    # connect cookies with flask session

    # USERS.append(user)
    USERS.insert_one(user)

    session["user"] = user

    return jsonify(
        {
            "data": dumps(user),
            "error": None,
        },
    )


### REGISTER end ###


@app.route("/logout")
def logout():
    session.pop("user", None)
    return redirect("/")
