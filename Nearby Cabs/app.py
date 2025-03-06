from flask import Flask, request, jsonify, render_template
import math
import requests

app = Flask(__name__)
RADIUS_EARTH = 6357.00
CAB_DRIVER_FILE = 'Car_Driver.txt'

@app.route('/')
def home():
    return render_template("index.html")

@app.route('/find_cabs', methods=['POST'])
def find_cabs():
    data = request.json
    lat, lon = get_coordinates(data.get("location"))

    if lat is None or lon is None:
        return jsonify({"result": "Invalid location.", "cabs": []})

    cabs = search_cabs(lat, lon)
    if not cabs:
        return jsonify({"result": "No nearby cabs available within 100 km.", "cabs": []})

    result = "\n".join([f"Name: {cab['name']}\nDriver ID: {cab['id']}\nPhone: {cab['phone']}\nDistance: {cab['distance']:.2f} km\n"
                         "--------------------------" for cab in cabs])
    
    return jsonify({"result": result, "cabs": cabs})


import requests

def get_coordinates(location):
    """Fetch coordinates from OpenStreetMap if a city name is provided."""
    headers = {
        "User-Agent": "MyCabFinderApp/1.0 (cabfinder50@gmail.com)"  # Use a valid email
    }
    
    try:
        response = requests.get("https://nominatim.openstreetmap.org/search",
                                params={"q": location, "format": "json", "limit": 1},
                                headers=headers)  # Include headers

        response.raise_for_status()  # Raise an error for HTTP errors (403, 500, etc.)
        data = response.json()

        if data and isinstance(data, list) and len(data) > 0:
            return float(data[0]["lat"]), float(data[0]["lon"])
        else:
            print(f"Warning: No results found for location: {location}")
            return None, None

    except requests.exceptions.HTTPError as e:
        print(f"HTTP Error: {e}")
    except requests.exceptions.RequestException as e:
        print(f"Network Error: {e}")
    except (ValueError, IndexError) as e:
        print(f"Data Parsing Error: {e}")
    except Exception as e:
        print(f"Unexpected Error: {e}")
    
    return None, None  # Return None if an error occurs


def distance(lat1, lon1, lat2, lon2):
    """Calculate the distance between two geographic coordinates."""
    lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])
    alpha = math.acos(math.sin(lat1) * math.sin(lat2) + math.cos(lat1) * math.cos(lat2) * math.cos(lon1 - lon2))
    return alpha * RADIUS_EARTH

def search_cabs(lat, lon):
    """Search for nearby cabs and return structured JSON with coordinates."""
    cabs = []
    
    try:
        with open(CAB_DRIVER_FILE, 'r') as file:
            for line in file:
                details = line.strip().split()
                if len(details) >= 5:
                    driver_lat, driver_lon = float(details[1]), float(details[2])
                    d = distance(lat, lon, driver_lat, driver_lon)
                    if d <= 100.0:
                        cabs.append({
                            "id": details[0],
                            "lat": driver_lat,
                            "lon": driver_lon,
                            "name": details[3],
                            "phone": details[4],
                            "distance": d
                        })

        return cabs
    except Exception as e:
        print(f"Error: {e}")
        return []


if __name__ == '__main__':
    app.run(debug=True)
