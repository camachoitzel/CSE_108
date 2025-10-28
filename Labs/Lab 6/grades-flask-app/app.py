from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
import json
import os



app = Flask(__name__)
GRADES_FILE = 'grades.json'
CORS(app)


def load_grades():
    if not os.path.exists(GRADES_FILE):
        with open(GRADES_FILE, 'w') as file:
            json.dump({}, file)
    with open(GRADES_FILE, 'r') as file:
        return json.load(file)
    

def save_grades(grades):
    with open(GRADES_FILE, 'w') as file:
        json.dump(grades, file, indent=4)

@app.route('/')
def index():
    return render_template('index.html')

# GET
@app.route('/grades', methods=['GET'])
def get_grades():
    grades = load_grades()
    return jsonify(grades)

@app.route('/grades/<string:name>', methods=['GET'])
def get_grade(name):
    grades = load_grades()
    grade = grades.get(name)
    if grade is not None:
        return jsonify({name: grade})
    else:
        return jsonify({"error": "Student not found"}), 404
    
# POST
@app.route('/grades', methods=['POST'])
def add_grade():
    grades = load_grades()
    data = request.json
    if not data:
        return jsonify({"error" : "No data was input"}), 400
    

    name = data.get('name')
    grade = data.get('grade')

    if not name or grade is None:
        return jsonify({"error" : "Missing name or grade"}), 400
    
    try:
        grade = int(grade)
    
    except (ValueError, TypeError):
        return jsonify({"error": "Grade must be number"}), 400


    if len(name) > 32 or any(char in name for char in "<>'\""):
        return jsonify({"error": "Student name invalid"}), 400
    if name in grades:
        return jsonify({"error": "Student already exists"}), 400
  
    grades[name] = grade
    save_grades(grades)
    return jsonify(grades), 201

# PUT
@app.route('/grades/<string:name>', methods=['PUT'])
def edit_grade(name):
    grades = load_grades()
    if name not in grades:
        return jsonify({"error": "Student not found"}), 404
    data = request.json
    if not data or 'grade' not in data:
        return jsonify({"error": "Missing grade"}), 400
    # Try to convert grade to a number
    try:
        new_grade = int(data.get('grade'))
    except (ValueError, TypeError):
        return jsonify({"error": "Grade must be a number"}), 400

    grades[name] = new_grade
    save_grades(grades)
    return jsonify(grades)

# DELETE
@app.route('/grades/<string:name>', methods=['DELETE'])
def delete_grade(name):
    grades = load_grades()
    if name not in grades:
        return jsonify({"error": "Student not found"}), 404
    deleted_grade = grades.pop(name)
    save_grades(grades)
    return jsonify(grades)


if __name__ == '__main__':
    app.run(debug=True)



