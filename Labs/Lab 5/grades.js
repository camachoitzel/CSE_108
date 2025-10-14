// This is the URL of our backend server
const API_URL = 'https://amhep.pythonanywhere.com/grades';

// Pagination settings
const rowsPerPage = 10; // Show 10 students per page
let allStudentsData = []; // Store all students
let currentPage = 1; // Keep track of current page

function showMessage(elementId, text, type) {
    const element = document.getElementById(elementId);
    element.textContent = text;
    element.className = 'message ' + type;
    
    // Hide message after 3 seconds
    setTimeout(() => {
        element.className = 'message';
    }, 3000);
}

// PAGINATION FUNCTION 1: Create pagination buttons
function createPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / rowsPerPage);
    let paginationHTML = '';
    
    for (let i = 1; i <= totalPages; i++) {
        let activeClass = (i === currentPage) ? 'active' : '';
        paginationHTML += '<button class="page-btn ' + activeClass + '" onclick="goToPage(' + i + ')">' + i + '</button>';
    }
    
    document.getElementById('pagination').innerHTML = paginationHTML;
}

// PAGINATION FUNCTION 2: Go to a specific page
function goToPage(pageNumber) {
    currentPage = pageNumber;
    displayStudents();
}

// PAGINATION FUNCTION 3: Display students for the current page
function displayStudents() {
    // Calculate which students to show on this page
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const studentsOnPage = allStudentsData.slice(startIndex, endIndex);
    
    // Check if there are any students
    if (studentsOnPage.length === 0) {
        document.getElementById('allStudents').innerHTML = '<div class="empty">No students found</div>';
        document.getElementById('pagination').innerHTML = '';
        return;
    }

    // Create a table with students
    let html = '<table>';
    html += '<tr><th>Student Name</th><th>Grade</th><th>Actions</th></tr>';
    
    for (let i = 0; i < studentsOnPage.length; i++) {
        let student = studentsOnPage[i];
        html += '<tr>';
        html += '<td>' + student.name + '</td>';
        html += '<td>' + student.grade + '</td>';
        html += '<td>';
        html += '<button class="edit-btn" onclick="showEditForm(\'' + student.name + '\')">Edit</button>';
        html += '<button class="delete-btn" onclick="deleteStudent(\'' + student.name + '\')">Delete</button>';
        html += '</td>';
        html += '</tr>';
    }
    
    html += '</table>';
    document.getElementById('allStudents').innerHTML = html;
    
    // Create pagination buttons
    createPagination(allStudentsData.length);
}

// Function 1: Search for one student's grade
async function searchStudent() {
    const name = document.getElementById('searchName').value;
    
    if (name === '') {
        showMessage('searchMessage', 'Please enter a student name', 'error');
        return;
    }

    try {
        // Make a GET request to find the student
        const response = await fetch(API_URL + '/' + encodeURIComponent(name));
        
        if (!response.ok) {
            throw new Error('Student not found');
        }

        const student = await response.json();
        const studentName = Object.keys(student)[0];
        const studentGrade = student[studentName];
            
        // Display the result in a table
        let html = '<table>';
        html += '<tr><th>Student Name</th><th>Grade</th></tr>';
        html += '<tr><td>' + studentName + '</td><td>' + studentGrade + '</td></tr>';
        html += '</table>';
        
        document.getElementById('searchResult').innerHTML = html;
        showMessage('searchMessage', 'Student found!', 'success');
    } 
    catch (error) {
        document.getElementById('searchResult').innerHTML = '';
        showMessage('searchMessage', 'Error: ' + error.message, 'error');
    }
}

// Function 2: Get all students
async function getAllStudents() {
    try {
        // Make a GET request to get all students
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error('Failed to get students');
        }

        const data = await response.json();
        console.log('Raw data from server:', data);
        console.log('Type of data:', typeof data);
        
        // The server returns an OBJECT where keys are names and values are grades
        // We need to convert it to an array of objects
        if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
            allStudentsData = [];
            
            // Loop through each key-value pair
            for (let name in data) {
                // Only include properties that belong to the object itself, not inherited
                if (data.hasOwnProperty(name)) {
                    allStudentsData.push({
                        name: name,
                        grade: data[name]
                    });
                }
            }
            console.log('Converted object to array');
        }
        // If it's already an array, use it directly
        else if (Array.isArray(data)) {
            allStudentsData = data;
        }
        else {
            throw new Error('Unexpected data format from server');
        }
        
        console.log('Final allStudentsData:', allStudentsData);
        console.log('Number of students:', allStudentsData.length);
        
        currentPage = 1; // Reset to first page
        
        displayStudents();
        showMessage('allMessage', 'All students loaded!', 'success');
    }
    catch (error) {
        console.error('Error in getAllStudents:', error);
        document.getElementById('allStudents').innerHTML = '';
        document.getElementById('pagination').innerHTML = '';
        showMessage('allMessage', 'Error: ' + error.message, 'error');
    }
}

// Function 3: Add a new student
async function addStudent() {
    const name = document.getElementById('newName').value;
    const grade = document.getElementById('newGrade').value;
    
    if (name === '' || grade === '') {
        showMessage('addMessage', 'Please fill in both fields', 'error');
        return;
    }

    try {
        // Make a POST request to create a new student
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                grade: parseFloat(grade)
            })
        });

        if (!response.ok) {
            throw new Error('Failed to add student');
        }

        // Clear the input fields
        document.getElementById('newName').value = '';
        document.getElementById('newGrade').value = '';
        
        showMessage('addMessage', 'Student added successfully!', 'success');
    }
    catch (error) {
        showMessage('addMessage', 'Error: ' + error.message, 'error');
    }
}

// Function 4: Edit a student's grade
function showEditForm(name) {
    const newGrade = prompt('Enter new grade for ' + name + ':', '');
    
    if (newGrade === null) {
        return; // User cancelled
    }

    if (newGrade === '') {
        showMessage('allMessage', 'Please enter a grade', 'error');
        return;
    }

    updateGrade(name, parseFloat(newGrade));
}

async function updateGrade(name, newGrade) {
    try {
        // Make a PUT request to update the grade
        const response = await fetch(API_URL + '/' + encodeURIComponent(name), {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                grade: newGrade
            })
        });

        if (!response.ok) {
            throw new Error('Failed to update grade');
        }

        showMessage('allMessage', 'Grade updated successfully!', 'success');
        getAllStudents(); // Refresh the table
    }
    catch (error) {
        showMessage('allMessage', 'Error: ' + error.message, 'error');
    }
}

// Function 5: Delete a student
async function deleteStudent(name) {
    const confirmed = confirm('Are you sure you want to delete ' + name + '?');
    
    if (!confirmed) {
        return; // User cancelled
    }

    try {
        // Make a DELETE request to remove the student
        const response = await fetch(API_URL + '/' + encodeURIComponent(name), {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to delete student');
        }

        showMessage('allMessage', 'Student deleted successfully!', 'success');
        getAllStudents(); // Refresh the table and pagination
    }
    catch (error) {
        showMessage('allMessage', 'Error: ' + error.message, 'error');
    }
}

// Let users press Enter to search
document.getElementById('searchName').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        searchStudent();
    }
});