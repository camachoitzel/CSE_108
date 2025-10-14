// ========================================
// GRADES MANAGEMENT SYSTEM - JAVASCRIPT
// ========================================

// This is the URL of our backend server where grades are stored
// It's like the address of a library where we can GET, POST, PUT, and DELETE data
const API_URL = 'https://amhep.pythonanywhere.com/grades';

// Pagination settings - controls how many students show per page
const rowsPerPage = 5; // Show 5 students per page (change this number to show more or less)

// This array stores ALL the students we get from the server
// We store them here so we can split them into pages
let allStudentsData = [];

// This keeps track of which page the user is currently viewing
// If currentPage = 2, we show students 6-10, etc.
let currentPage = 1;


// ========================================
// HELPER FUNCTIONS
// ========================================

// Function to show success or error messages to the user
// elementId: the HTML element to put the message in
// text: the message to display
// type: either 'success' or 'error' (this changes the color)
function showMessage(elementId, text, type) {
    const element = document.getElementById(elementId);
    element.textContent = text;
    element.className = 'message ' + type;
    
    // Hide message after 3 seconds so it doesn't clutter the screen
    setTimeout(() => {
        element.className = 'message';
    }, 3000);
}

// Function to create pagination buttons (the page numbers at the bottom)
// This is the function you provided - it creates buttons for each page
function createPagination(totalItems) {
    // Calculate how many pages we need
    // Math.ceil rounds UP (so 11 items with 5 per page = 3 pages)
    const totalPages = Math.ceil(totalItems / rowsPerPage);
    
    let paginationHTML = '';
    
    // Create a button for each page
    for (let i = 1; i <= totalPages; i++) {
        // Check if this is the current page - if so, add 'active' class to highlight it
        let activeClass = (i === currentPage) ? 'active' : '';
        
        // Create a button with onclick that goes to page i
        paginationHTML += '<button class="page-btn ' + activeClass + '" onclick="goToPage(' + i + ')">' + i + '</button>';
    }
    
    // Put all the buttons into the HTML element with id='pagination'
    document.getElementById('pagination').innerHTML = paginationHTML;
}

// Function to change which page the user is viewing
// pageNumber: the page they clicked on (1, 2, 3, etc.)
function goToPage(pageNumber) {
    currentPage = pageNumber;
    displayStudents(); // Show the students on that page
}

// Function to display students for the current page
// This is where the magic happens - it takes ALL students and shows only the ones for this page
function displayStudents() {
    // Calculate which students to show on this page
    // If currentPage = 2 and rowsPerPage = 5:
    // startIndex = (2-1) * 5 = 5 (start at student #6)
    // endIndex = 5 + 5 = 10 (end at student #10)
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    
    // slice() is like cutting a piece from an array
    // allStudentsData.slice(5, 10) = students at positions 5 through 9
    const studentsOnPage = allStudentsData.slice(startIndex, endIndex);
    
    // Check if there are any students to show
    if (studentsOnPage.length === 0) {
        document.getElementById('allStudents').innerHTML = '<div class="empty">No students found</div>';
        document.getElementById('pagination').innerHTML = '';
        return;
    }

    // Build an HTML table to display the students
    let html = '<table>';
    html += '<tr><th>Student Name</th><th>Grade</th><th>Actions</th></tr>';
    
    // Loop through each student on this page
    for (let i = 0; i < studentsOnPage.length; i++) {
        let student = studentsOnPage[i];
        html += '<tr>';
        html += '<td>' + student.name + '</td>';
        html += '<td>' + student.grade + '</td>';
        html += '<td>';
        // The onclick passes the student name - be careful with quotes!
        html += '<button class="edit-btn" onclick="showEditForm(\'' + student.name + '\')">Edit</button>';
        html += '<button class="delete-btn" onclick="deleteStudent(\'' + student.name + '\')">Delete</button>';
        html += '</td>';
        html += '</tr>';
    }
    
    html += '</table>';
    
    // Put the table into the HTML page
    document.getElementById('allStudents').innerHTML = html;
    
    // Create the pagination buttons
    createPagination(allStudentsData.length);
}


// ========================================
// FUNCTION 1: SEARCH FOR ONE STUDENT
// ========================================

async function searchStudent() {
    // Get the name the user typed in
    const name = document.getElementById('searchName').value;
    
    // Check if the user actually entered a name
    if (name === '') {
        showMessage('searchMessage', 'Please enter a student name', 'error');
        return; // Stop the function here if no name
    }

    try {
        // Make a GET request to the server
        // This is like asking the server: "Hey, do you have a student named 'John Doe'?"
        // encodeURIComponent(name) converts spaces to %20 so the URL works
        // Example: "John Doe" becomes "John%20Doe"
        const response = await fetch(API_URL + '/' + encodeURIComponent(name));
        
        // Check if the server responded successfully (status 200-299)
        if (!response.ok) {
            throw new Error('Student not found');
        }

        // response.json() reads the server's response and converts it from JSON to a JavaScript object
        // await means "wait for this to finish before continuing"
        const student = await response.json();
        
        // Build an HTML table with the student's information
        let html = '<table>';
        html += '<tr><th>Student Name</th><th>Grade</th></tr>';
        html += '<tr><td>' + student.name + '</td><td>' + student.grade + '</td></tr>';
        html += '</table>';
        
        // Put the table on the page
        document.getElementById('searchResult').innerHTML = html;
        showMessage('searchMessage', 'Student found!', 'success');
    } 
    catch (error) {
        // If something goes wrong, show the error message
        document.getElementById('searchResult').innerHTML = '';
        showMessage('searchMessage', 'Error: ' + error.message, 'error');
    }
}


// ========================================
// FUNCTION 2: GET ALL STUDENTS
// ========================================

async function getAllStudents() {
    try {
        // Make a GET request to get ALL students from the server
        // This is simpler than Function 1 - no name needed
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error('Failed to get students');
        }

        // Store all students in our global variable
        // This is important for pagination - we need ALL students to split them into pages
        allStudentsData = await response.json();
        
        // Reset to page 1 when we load new students
        currentPage = 1;
        
        // Display the students for page 1
        displayStudents();
        
        showMessage('allMessage', 'All students loaded!', 'success');
    }
    catch (error) {
        // Clear the table and pagination if there's an error
        document.getElementById('allStudents').innerHTML = '';
        document.getElementById('pagination').innerHTML = '';
        showMessage('allMessage', 'Error: ' + error.message, 'error');
    }
}


// ========================================
// FUNCTION 3: ADD A NEW STUDENT
// ========================================

async function addStudent() {
    // Get the name and grade from the input fields
    const name = document.getElementById('newName').value;
    const grade = document.getElementById('newGrade').value;
    
    // Check if the user filled in both fields
    if (name === '' || grade === '') {
        showMessage('addMessage', 'Please fill in both fields', 'error');
        return;
    }

    try {
        // Make a POST request to CREATE a new student
        // POST is like saying to the server: "Add this new student to your database"
        const response = await fetch(API_URL, {
            method: 'POST', // This tells the server we're CREATING new data
            headers: {
                // This header tells the server "I'm sending you JSON data"
                'Content-Type': 'application/json'
            },
            // JSON.stringify converts a JavaScript object into JSON text
            // Example: {name: "John", grade: 95} becomes '{"name":"John","grade":95}'
            body: JSON.stringify({
                name: name,
                grade: parseFloat(grade) // parseFloat converts "95" to 95 (a number)
            })
        });

        if (!response.ok) {
            throw new Error('Failed to add student');
        }

        // Clear the input fields so they're ready for the next entry
        document.getElementById('newName').value = '';
        document.getElementById('newGrade').value = '';
        
        showMessage('addMessage', 'Student added successfully!', 'success');
    }
    catch (error) {
        showMessage('addMessage', 'Error: ' + error.message, 'error');
    }
}


// ========================================
// FUNCTION 4: EDIT A STUDENT'S GRADE
// ========================================

// This function shows a prompt asking for the new grade
function showEditForm(name) {
    // prompt() creates a popup window where the user can type something
    // It returns the text they typed, or null if they clicked Cancel
    const newGrade = prompt('Enter new grade for ' + name + ':', '');
    
    if (newGrade === null) {
        return; // User clicked Cancel, so stop here
    }

    if (newGrade === '') {
        showMessage('allMessage', 'Please enter a grade', 'error');
        return;
    }

    // Call the function that actually updates the grade on the server
    updateGrade(name, parseFloat(newGrade));
}

// This function sends the updated grade to the server
async function updateGrade(name, newGrade) {
    try {
        // Make a PUT request to UPDATE an existing student's grade
        // PUT is like saying to the server: "Update this student's grade"
        const response = await fetch(API_URL + '/' + encodeURIComponent(name), {
            method: 'PUT', // This tells the server we're UPDATING data
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
        getAllStudents(); // Refresh the table to show the updated grade
    }
    catch (error) {
        showMessage('allMessage', 'Error: ' + error.message, 'error');
    }
}


// ========================================
// FUNCTION 5: DELETE A STUDENT
// ========================================

async function deleteStudent(name) {
    // confirm() creates a popup asking "Are you sure?" 
    // It returns true if they click OK, or false if they click Cancel
    const confirmed = confirm('Are you sure you want to delete ' + name + '?');
    
    if (!confirmed) {
        return; // User clicked Cancel, so don't delete
    }

    try {
        // Make a DELETE request to REMOVE a student
        // DELETE is like saying to the server: "Remove this student from your database"
        const response = await fetch(API_URL + '/' + encodeURIComponent(name), {
            method: 'DELETE' // This tells the server we're DELETING data
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


// ========================================
// KEYBOARD SHORTCUT
// ========================================

// This adds a keyboard shortcut - press Enter in the search box to search
// addEventListener watches for when the user does something
document.getElementById('searchName').addEventListener('keypress', function(event) {
    // event.key tells us which key was pressed
    if (event.key === 'Enter') {
        searchStudent(); // Run the search function
    }
});