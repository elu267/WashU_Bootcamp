# dependencies
from flask import Flask, render_template, redirect
from flask_pymongo import PyMongo
# imports my scraping script
import scrape_mars

# Create an instance of Flask
app = Flask(__name__)

# Use PyMongo to establish Mongo connection
mongo = PyMongo(app, uri="mongodb://localhost:27017/mars_app")

# Route to render index.html template using data from Mongo
@app.route("/")
def echo():
    mars_data = mongo.db.mars_info.find_one()
    return render_template("mars_index.html", mars_data=mars_data)

# Route that will trigger the scrape function
@app.route("/scrape")
def scrape():

    # Run the scrape function
    mars_data = scrape_mars.scrape_info()

    # Update the Mongo database using update and upsert=True
    mongo.db.mars_info.update({}, mars_data, upsert=True)

    # print(mars_data)
    # Redirect back to home page
    return redirect("/")

@app.route("/sources.html")
def sources():
    return render_template("sources.html")

@app.route("/about.html")
def about():
    return render_template("about.html")

if __name__ == "__main__":
    app.run(debug=False)