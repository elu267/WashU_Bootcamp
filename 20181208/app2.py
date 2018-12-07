import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

from flask import Flask, jsonify


#################################################
# Database Setup
#################################################
engine = create_engine("sqlite:///Resources/hawaii.sqlite")

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(engine, reflect=True)

# Save reference to the table
Measurement = Base.classes.measurement
Station = Base.classes.station

# Create our session (link) from Python to the DB
session = Session(engine)

#################################################
# Flask Setup
#################################################
app = Flask(__name__)


#################################################
# Flask Routes
#################################################

@app.route("/")
def welcome():
    """List all available api routes."""
    return (
        f"Welcome to the Honolulu, Hawaii Climate API<br/>"
        f"Available Routes:<br/>"
        f"/api/v1.0/precipitation<br/>"
        f"/api/v1.0/stations<br/>"
        f"/api/v1.0/tobs<br/>"
        f"/api/v1.0/&ltstart&gt  for example: /api/v1.0/2017-08-01 (YYYY-MM-DD)<br/>"
        f"/api/v1.0/&ltstart&gt/&ltend&gt for example: /api/v1.0/2017-08-01/2017-08-15 (YYYY-MM-DD)<br/>"
    )

@app.route("/api/v1.0/precipitation")
def precipitation():
    """Return a list precipitation values for weather stations located in Hawaii for the last 12 months of precipitation data"""
    # Query past year of data for precipation amount by date
    precip_by_date = session.query(Measurement.date, Measurement.prcp).filter(Measurement.date >= '2016-08-23')\
    .order_by(Measurement.date).all()

    # changing the list of tuples to a list of lists
    modified_precip = [list(elem) for elem in precip_by_date]
    # removing the None values
    mod_precip = []
    for item in modified_precip:
        if item[1] is not None:
            mod_precip.append(item)
    # convert list of lists to list of dictionaries
    keys = ['date', 'prcp']
    mod_precip_dict = [dict(zip(keys, l)) for l in mod_precip]
    mod_precip_dict
    
    return jsonify(mod_precip_dict)

@app.route("/api/v1.0/stations")
def stationLoc():
    """Return a list weather stations located in Hawaii"""
    # List the stations and the counts in descending order.
    stationLoc = (session.query(Station.station, Station.name).
            group_by(Station.station).all())

    return jsonify(stationLoc)

@app.route("/api/v1.0/tobs")
def temperatureObs():
    """Return the temperatures by date for the past year from the last data point"""
    # List the temperature observations for the past year.
    tempObs = (session.query(Measurement.date, Measurement.tobs).filter(Measurement.date >= '2016-08-23').all())

    return jsonify(tempObs)

@app.route("/api/v1.0/<start>")
def calc_temps(start):
    """ Fetch the TMIN, TAVG, and TMAX for a given start date and end date."""
    
    results = (session.query(func.min(Measurement.tobs), func.avg(Measurement.tobs),
    func.max(Measurement.tobs)).filter(Measurement.date >= start).all())



    return jsonify(results)
# @app.route("/api/v1.0/<start>/<end>")

@app.route("/api/v1.0/<start>/<end>")
def calc_temperatures(start, end):
    """TMIN, TAVG, and TMAX for a list of dates.
    
    Args:
        start_date (string): A date string in the format %Y-%m-%d
        end_date (string): A date string in the format %Y-%m-%d
        
    Returns:
        TMIN, TAVE, and TMAX
    """
    resultValue = session.query(func.min(Measurement.tobs), func.avg(Measurement.tobs), func.max(Measurement.tobs)).\
        filter(Measurement.date >= start).filter(Measurement.date <= end).all()

    return jsonify(resultValue)

if __name__ == "__main__":
    app.run(debug=True)