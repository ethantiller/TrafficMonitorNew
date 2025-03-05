from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route('/test', methods=['POST'])
def test_json_string():
    # Hardcoded example JSON data
    example_data = {
        "name": "John Doe",
        "age": 30,
        "city": "New York"
    }
    
    # Simulate receiving JSON data from a request
    json_string = request.get_json()
    
    # Print the received JSON data
    print(json_string)
    
    # Return the hardcoded example data as a JSON response
    return jsonify(example_data)


if __name__ == '__main__':
    app.run(host="127.0.0.1", port=5500, debug=True)