from flask import Flask, request, jsonify, Response
from flask_cors import CORS
import requests
import uuid
from AIChatbot import ChatBotAPI

app = Flask(__name__)
CORS(app)

# Store the chatbot response
chatbot_response_storage = {}
latest_chatbot_response = None

# Endpoint to get user input and forward it to the chatbot
@app.route('/userresponse', methods=['POST'])
def get_user_response():
    website_to_user_input = request.json.get('user_input')
    chatbot_url_and_endpoint = "https://revuc-2025.github.io/TrafficMonitor/chatbotresponse"
    response = requests.post(chatbot_url_and_endpoint, json={'user_input': website_to_user_input})
    chatbot_response = response.text  # Get the response as plain text
    return Response(chatbot_response, mimetype='text/plain')

# Endpoint to get chatbot response
@app.route('/chatbotresponse', methods=['POST'])
def get_chatbot_response():
    global latest_chatbot_response
    user_input_to_chat = request.json.get('user_input')
    chatbot_response_prejson = ChatBotAPI.chatBotResponse(user_input_to_chat)
    
    # Convert the response to a plain string
    chatbot_response_ready = chatbot_response_prejson

    # Generate a unique identifier for the response
    response_id = str(uuid.uuid4())
    chatbot_response_storage[response_id] = chatbot_response_ready

    # Update the latest chatbot response
    latest_chatbot_response = chatbot_response_ready

    # Return the response as a plain string
    return Response(chatbot_response_ready, mimetype='text/plain')

# Endpoint to fetch the stored chatbot response
@app.route('/fetchresponse', methods=['GET'])
def fetch_chatbot_response():
    if (latest_chatbot_response is None):
        return Response("No response available", mimetype='text/plain')
    return Response(latest_chatbot_response, mimetype='text/plain')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

CORS(app, resources={
    r"/*": {
        "origins": [
            "https://revuc-2025.github.io",
            "http://localhost:8000"  # For local testing
        ]
    }
})