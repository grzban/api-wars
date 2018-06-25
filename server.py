from flask import Flask, render_template, url_for, session, request, redirect
import data_manager


app = Flask(__name__, static_url_path='/static')
app.secret_key = "secretkey"


@app.route("/")
def index():
    if "username" in session:
        username = session["username"]
        return render_template('index.html', username=username)
    else:
        return render_template('index.html')


@app.route("/login", methods=["POST"])
def login():
    user = request.form
    print(data_manager.is_user_in_database(user["username-login"]))
    if data_manager.is_user_in_database(user["username-login"]):
        if data_manager.login(user["username-login"], user["password-login"]):
            session["username"] = user["username-login"]
            return redirect(url_for("index"))
    else:
        msg = "Invalid data, try again"
        return render_template("index.html", msg=msg)


@app.route("/registration", methods=["POST"])
def registration():
    user = request.form

    if data_manager.is_user_in_database(user["username-signup"]):
        msg = "Please choose a different username"
        return render_template("index.html", msg=msg)
    else:
        data_manager.register_user(user["username-signup"], user["password-signup"])
        session["username"] = user["username-signup"]
        return redirect(url_for("index"))


@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("index"))


@app.route("/voting")
def voting():
    return "Voting not implemented yet"


if __name__ == '__main__':
    app.run(
        # host='192.168.100.8',
        # port=5000,
        debug=True
    )
