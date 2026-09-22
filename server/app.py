from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from datetime import datetime
import json
import os

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(BASE_DIR, 'studentProgressData.json')


# --- Helper JSON Loaders ---
def load_user_data():
    json_path = os.path.join(BASE_DIR, 'userData.json')
    if os.path.exists(json_path):
        with open(json_path, 'r', encoding='utf-8') as file:
            return json.load(file)
    return {}

def load_faculty_data():
    json_path = os.path.join(BASE_DIR, 'facultyData.json')
    if os.path.exists(json_path):
        with open(json_path, 'r', encoding='utf-8') as file:
            return json.load(file)
    return {}

def load_notification_data():
    json_path = os.path.join(BASE_DIR, 'notiData.json')
    if os.path.exists(json_path):
        with open(json_path, 'r', encoding='utf-8') as file:
            return json.load(file)
    return []

def load_file_data():
    json_path = os.path.join(BASE_DIR, 'fileData.json')
    if os.path.exists(json_path):
        with open(json_path, 'r', encoding='utf-8') as file:
            return json.load(file)
    return []

def get_formatted_file_size(file_bytes):
    if file_bytes < 1024 * 1024:
        return f"{round(file_bytes / 1024, 1)} KB"
    else:
        return f"{round(file_bytes / (1024 * 1024), 1)} MB"


# --- Helper Functions for Student Progress Data ---
def load_data():
    if not os.path.exists(DATA_FILE):
        return []
    with open(DATA_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_data(data):
    dir_name = os.path.dirname(DATA_FILE)
    if dir_name:
        os.makedirs(dir_name, exist_ok=True)
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4)

def calculate_overall_score(student):
    sems = student.get('semesters', {})
    total_sgpa = sum([s.get('sgpa', 0) for s in sems.values() if isinstance(s, dict)])
    total_backlogs = sum([s.get('backlogs', 0) for s in sems.values() if isinstance(s, dict)])
    count = len(sems) if len(sems) > 0 else 1

    avg_sgpa = total_sgpa / count
    sgpa_score = (avg_sgpa / 10.0) * 60
    
    attendance_score = (student.get('attendance', 0) / 100.0) * 25
    
    total_assign = student.get('totalAssignments', 1) or 1
    assign_ratio = student.get('assignmentsCompleted', 0) / total_assign
    assignment_score = assign_ratio * 15

    final_score = sgpa_score + attendance_score + assignment_score - (total_backlogs * 2)
    return round(max(0, min(100, final_score)), 2)


# --- Student Login Check ---
@app.route('/loginCheck', methods=['POST'])
def login_check():
    data = request.get_json()
    username = data.get('inputusername')
    password = data.get('passwordinput')
    
    users = load_user_data()
    
    target_user = users.get(username)
    if not target_user:
        for u_key, u_val in users.items():
            if u_val.get('username') == username:
                target_user = u_val
                break

    if target_user:
        if target_user.get('password') == password:
            user_data = target_user.copy()
            user_data.pop('password', None)
            return jsonify({
                'status': 'success',
                'message': 'Login successful',
                'username': username,
                'user': user_data
            }), 200
        else:
            return jsonify({
                'status': 'error',
                'message': 'Invalid password'
            }), 401
    else:
        return jsonify({
            'status': 'error',
            'message': 'Username not found'
        }), 404


# --- Faculty Login Check Route ---
@app.route('/loginCheckFaculty', methods=['POST'])
def login_check_faculty():
    data = request.get_json()
    username = data.get('inputusername')
    password = data.get('passwordinput')
    
    faculties = load_faculty_data()
    
    target_faculty = faculties.get(username)
    if not target_faculty:
        for f_key, f_val in faculties.items():
            if f_val.get('username') == username:
                target_faculty = f_val
                break

    if target_faculty:
        if target_faculty.get('password') == password:
            user_data = target_faculty.copy()
            user_data.pop('password', None)
            
            return jsonify({
                'status': 'success',
                'message': 'Faculty login successful',
                'username': username,
                'user': user_data
            }), 200
        else:
            return jsonify({
                'status': 'error',
                'message': 'Invalid password'
            }), 401
    else:
        return jsonify({
            'status': 'error',
            'message': 'Faculty username not found'
        }), 404


# --- Get Student Details ---
@app.route('/getUser', methods=['GET'])
def get_user():
    username = request.args.get('username')
    if not username:
        return jsonify({
            'status': 'error',
            'message': 'Username parameter is missing'
        }), 400

    users = load_user_data()

    target_user = users.get(username)
    if not target_user:
        for key, value in users.items():
            if value.get('username') == username:
                target_user = value
                break

    if target_user:
        user_info = target_user.copy()
        user_info.pop('password', None)
        
        return jsonify({
            'status': 'success',
            'user': user_info
        }), 200
    else:
        return jsonify({
            'status': 'error',
            'message': 'User not found'
        }), 404


# --- Get Faculty Details ---
@app.route('/getFaculty', methods=['GET'])
def get_faculty():
    username = request.args.get('username')
    if not username:
        return jsonify({
            'status': 'error',
            'message': 'Username parameter is missing'
        }), 400

    faculties = load_faculty_data()

    target_faculty = faculties.get(username)
    if not target_faculty:
        for key, value in faculties.items():
            if value.get('username') == username:
                target_faculty = value
                break

    if target_faculty:
        faculty_info = target_faculty.copy()
        faculty_info.pop('password', None)
        
        return jsonify({
            'status': 'success',
            'user': faculty_info
        }), 200
    else:
        return jsonify({
            'status': 'error',
            'message': 'Faculty user not found'
        }), 404


# --- Student Registration Route (Updated to create empty progress record) ---
@app.route('/registerStudent', methods=['POST'])
def register_student():
    data = request.get_json()
    
    username = data.get('username')
    password = data.get('password')
    student_name = data.get('studentName')
    father_name = data.get('fatherName')
    mother_name = data.get('motherName')
    last_name = data.get('lastName')
    mobile = data.get('mobile')
    email = data.get('email', 'N/A')
    roll_no = data.get('rollNo')
    branch = data.get('branch')
    class_semester = data.get('classSemester')

    if not all([username, password, student_name, father_name, mother_name, last_name, mobile, roll_no, branch, class_semester]):
        return jsonify({
            'status': 'error',
            'message': 'Please fill all required fields'
        }), 400

    users = load_user_data()

    if username in users:
        return jsonify({
            'status': 'error',
            'message': 'Username already exists'
        }), 400

    full_name = data.get('name', f"{student_name} {father_name} {last_name}")

    sem_num = int(class_semester.split('st')[0].split('nd')[0].split('rd')[0].split('th')[0])
    year_num = (sem_num + 1) // 2
    suffix = 'st' if year_num == 1 else 'nd' if year_num == 2 else 'rd' if year_num == 3 else 'th'
    academic_year = f"{year_num}{suffix} Year"

    users[username] = {
        'username': username,
        'password': password,
        'name': full_name,
        'studentName': student_name,
        'fatherName': father_name,
        'motherName': mother_name,
        'lastName': last_name,
        'mobile': mobile,
        'email': email,
        'rollNo': roll_no,
        'branch': branch,
        'classSemester': class_semester,
        'year': academic_year
    }

    json_path = os.path.join(BASE_DIR, 'userData.json')
    try:
        with open(json_path, 'w', encoding='utf-8') as file:
            json.dump(users, file, indent=4)

        # --- Automatically Create Empty Student Progress Record ---
        students_progress = load_data()
        
        # Check if progress record already exists for this roll number
        if not any(s.get('rollNo') == roll_no for s in students_progress):
            empty_progress = {
                "rollNo": roll_no,
                "name": full_name,
                "branch": branch,
                "semester": sem_num,
                "attendance": 0,
                "assignmentsCompleted": 0,
                "totalAssignments": 10,
                "semesters": {
                    "sem1": {"sgpa": 0.0, "backlogs": 0},
                    "sem2": {"sgpa": 0.0, "backlogs": 0},
                    "sem3": {"sgpa": 0.0, "backlogs": 0}
                }
            }
            empty_progress['overallScore'] = calculate_overall_score(empty_progress)
            students_progress.append(empty_progress)
            save_data(students_progress)

        return jsonify({
            'status': 'success',
            'message': 'Student registered successfully'
        }), 200
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': f'Failed to save data: {str(e)}'
        }), 500


# --- Notifications Routes ---
@app.route('/getNotification', methods=['GET'])
def get_notification():
    notifications = load_notification_data()

    if notifications:
        return jsonify({
            'status': 'success',
            'notifications': notifications
        }), 200
    else:
        return jsonify({
            'status': 'error',
            'message': 'No notifications found',
            'notifications': []
        }), 404


@app.route('/addNotification', methods=['POST'])
def add_notification():
    data = request.get_json()

    title = data.get('title')
    category = data.get('category')
    semester = data.get('semester')
    venue = data.get('venue')
    description = data.get('description')
    date_str = data.get('date')
    time_str = data.get('time')
    is_new = data.get('isNew', True)

    if not all([title, category, semester, venue, description]):
        return jsonify({
            'status': 'error',
            'message': 'All required fields must be filled'
        }), 400

    notifications = load_notification_data()
    
    new_id = max([int(n.get('id', 0)) for n in notifications if str(n.get('id', '')).isdigit()], default=0) + 1

    new_notification = {
        "id": new_id,
        "title": title,
        "category": category,
        "isNew": is_new,
        "semester": semester,
        "description": description,
        "date": date_str,
        "time": time_str,
        "venue": venue
    }

    notifications.insert(0, new_notification)

    json_path = os.path.join(BASE_DIR, 'notiData.json')
    try:
        with open(json_path, 'w', encoding='utf-8') as file:
            json.dump(notifications, file, indent=4)
        return jsonify({
            'status': 'success',
            'message': 'Notification published successfully'
        }), 200
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': f'Failed to save notification: {str(e)}'
        }), 500


@app.route('/deleteNotification/<int:notif_id>', methods=['DELETE'])
def delete_notification(notif_id):
    json_path = os.path.join(BASE_DIR, 'notiData.json')
    
    try:
        if not os.path.exists(json_path):
            return jsonify({'status': 'error', 'message': 'Data file not found'}), 404

        notifications = load_notification_data()

        file_to_delete = next((n for n in notifications if int(n.get('id', 0)) == notif_id), None)

        if not file_to_delete:
            return jsonify({
                'status': 'error',
                'message': f'Notification with ID {notif_id} not found'
            }), 404

        updated_list = [n for n in notifications if int(n.get('id', 0)) != notif_id]

        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(updated_list, f, indent=4)

        return jsonify({'status': 'success', 'message': 'Notification deleted successfully'}), 200

    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500


# --- Study Files & Upload Routes ---
@app.route('/getStudyFiles', methods=['GET'])
def get_study_files():
    files = load_file_data()

    if files:
        return jsonify({
            'status': 'success',
            'files': files
        }), 200
    else:
        return jsonify({
            'status': 'error',
            'message': 'No files found',
            'files': []
        }), 404


@app.route('/uploadStudyFile', methods=['POST'])
def upload_study_file():
    title = request.form.get('title')
    subject = request.form.get('subject')
    semester = request.form.get('semester')
    uploaded_by = request.form.get('uploadedBy', 'Faculty')

    if 'file' not in request.files:
        return jsonify({
            'status': 'error',
            'message': 'No file part attached'
        }), 400

    uploaded_file = request.files['file']

    if uploaded_file.filename == '':
        return jsonify({
            'status': 'error',
            'message': 'No selected file'
        }), 400

    if not title or not subject or not semester:
        return jsonify({
            'status': 'error',
            'message': 'Please fill all required fields'
        }), 400

    file_bytes = len(uploaded_file.read())
    uploaded_file.seek(0)
    formatted_size = get_formatted_file_size(file_bytes)

    filename = uploaded_file.filename
    ext = os.path.splitext(filename)[1].replace('.', '').upper()
    file_format = ext if ext else 'PDF'

    upload_dir = os.path.join(BASE_DIR, 'uploads')
    os.makedirs(upload_dir, exist_ok=True)
    save_path = os.path.join(upload_dir, filename)
    uploaded_file.save(save_path)

    formatted_date = datetime.now().strftime("%d %b %Y")

    files_list = load_file_data()
    new_id = max([f.get('id', 0) for f in files_list], default=0) + 1

    new_file_record = {
        "id": new_id,
        "title": title,
        "fileName": filename,
        "uploadedBy": uploaded_by,
        "subject": subject,
        "semester": semester,
        "date": formatted_date,
        "size": formatted_size,
        "format": file_format
    }

    files_list.insert(0, new_file_record)

    json_path = os.path.join(BASE_DIR, 'fileData.json')
    try:
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(files_list, f, indent=4)

        return jsonify({
            'status': 'success',
            'message': 'File metadata saved successfully',
            'file': new_file_record
        }), 200
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': f'Failed to update file database: {str(e)}'
        }), 500


@app.route('/downloadFile/<path:filename>', methods=['GET'])
def download_file(filename):
    upload_folder = os.path.join(BASE_DIR, 'uploads')
    
    if not os.path.exists(os.path.join(upload_folder, filename)):
        return jsonify({
            'status': 'error',
            'message': 'Requested file does not exist on server'
        }), 404

    return send_from_directory(
        directory=upload_folder,
        path=filename,
        as_attachment=True
    )


@app.route('/deleteStudyFile/<int:file_id>', methods=['DELETE'])
def delete_study_file(file_id):
    files = load_file_data()
    file_to_delete = None
    
    for f in files:
        if f.get('id') == file_id:
            file_to_delete = f
            break

    if not file_to_delete:
        return jsonify({
            'status': 'error',
            'message': 'File not found'
        }), 404

    updated_files = [f for f in files if f.get('id') != file_id]

    filename = file_to_delete.get('fileName')
    if filename:
        file_path = os.path.join(BASE_DIR, 'uploads', filename)
        if os.path.exists(file_path):
            try:
                os.remove(file_path)
            except Exception as e:
                print(f"Error removing physical file: {e}")

    json_path = os.path.join(BASE_DIR, 'fileData.json')
    try:
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(updated_files, f, indent=4)
            
        return jsonify({
            'status': 'success',
            'message': 'File deleted successfully'
        }), 200
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': f'Failed to update database: {str(e)}'
        }), 500


# --- Student Progress & Leaderboard Routes ---
@app.route('/getStudentProgress', methods=['GET'])
def get_student_progress():
    students = load_data()
    return jsonify({'status': 'success', 'data': students})


@app.route('/updateStudentProgress', methods=['POST'])
def update_student_progress():
    payload = request.json
    students = load_data()
    
    updated = False
    for i, s in enumerate(students):
        if s['rollNo'] == payload['rollNo']:
            students[i] = payload
            students[i]['overallScore'] = calculate_overall_score(payload)
            updated = True
            break
            
    if not updated:
        payload['overallScore'] = calculate_overall_score(payload)
        students.append(payload)
        
    save_data(students)
    return jsonify({'status': 'success', 'message': 'Student progress updated successfully!'})


@app.route('/getLeaderboard', methods=['GET'])
def get_leaderboard():
    students = load_data()
    sorted_students = sorted(students, key=lambda x: x.get('overallScore', 0), reverse=True)
    
    leaderboard = []
    for index, student in enumerate(sorted_students):
        leaderboard.append({
            'rank': index + 1,
            'rollNo': student.get('rollNo'),
            'name': student.get('name'),
            'branch': student.get('branch'),
            'semester': student.get('semester'),
            'attendance': student.get('attendance'),
            'overallScore': student.get('overallScore', 0)
        })
        
    return jsonify({'status': 'success', 'data': leaderboard})


if __name__ == '__main__':
    app.run(debug=True, port=5000)