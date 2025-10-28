from flask import Flask, jsonify, request, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///grades.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
from flask_cors import CORS
CORS(app)

class Grade(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(32), unique=True, nullable=False)
    grade = db.Column(db.Float, nullable=False)

def get_all_grades():
    grades = Grade.query.all()
    grades_dict = {grade.name: grade.grade for grade in grades}
    return jsonify(grades_dict)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/grades', methods=['GET'])
def get_grades():
    return get_all_grades()

@app.route('/grades/<string:name>', methods=['GET'])
def get_grade(name):
    grade = Grade.query.filter_by(name=name).first()
    if not grade:
        return jsonify({"error" : "Student not Found"}), 404
    return jsonify({grade.name : grade.grade})


@app.route('/grades', methods=['POST'])
def add_grade():
    data = request.json
    name = data.get('name')
    
    if not name or len(name) > 32 or ',' in name or '.' in name:
        return jsonify({"error": "Invalid name"}), 400
    
    if Grade.query.filter_by(name=name).first():
        return jsonify({"error": "Duplicate name"}), 400
    
    try:
        grade = float(data.get('grade'))
    
    except (TypeError, ValueError):
        return jsonify({"error": "Invalid grade value"}), 400
    
    new_grade = Grade(name=name, grade=grade)
    db.session.add(new_grade)
    db.session.commit()
    return get_all_grades()


@app.route('/grades/<string:name>', methods=['PUT'])
def edit_grade(name):
    grade = Grade.query.filter_by(name=name).first()

    if not grade:
        return jsonify({"error": "Student not found"}), 404
    

    data = request.json


    try:
        new_grade = float(data.get('grade'))
    except (TypeError, ValueError):
        return jsonify({"error": "Invalid grade value"}), 400
    grade.grade = new_grade
    db.session.commit()
    return get_all_grades()


@app.route('/grades/<string:name>', methods=['DELETE'])
def delete_grade(name):
    grade = Grade.query.filter_by(name=name).first()
    
    if not grade:
        return jsonify({"error": "Student not found"}), 404
    
    db.session.delete(grade)
    db.session.commit()
    return get_all_grades()


def setup_database():
    with app.app_context():
        db.create_all()
        print("Database setup complete.")

if __name__ == "__main__":
    setup_database()