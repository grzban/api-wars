from flask import Flask, render_template, url_for

app = Flask(__name__, static_url_path='/static')


@app.route("/")
def index():
    return render_template('index.html')


if __name__ == '__main__':
    app.run(
        # host='192.168.100.8',
        # port=5000,
        debug=True
    )
