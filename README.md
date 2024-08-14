# Equipment Management System

## Description
This repository contains a web application for managing equipment issuance and returns using a SQLite database. The system provides functionality for equipment management, user and admin administration, and data search capabilities.

## Key Features
- Equipment issuance and return tracking
- Automatic generation of unique issuance numbers
- User-friendly interface for equipment returns
- Admin panel for comprehensive management
- Search functionality across all records
- Excel export of all equipment records
- User and admin management
- Equipment type management

## Technologies Used
- Backend: Node.js with Express.js
- Frontend: HTML, CSS, JavaScript
- Database: SQLite
- View Engine: EJS (Embedded JavaScript templating)
- Authentication: Express-session for session management
- Password Hashing: bcrypt
- Excel Export: ExcelJS

## Project Structure
- `/views`: Contains EJS templates for views
- `/public`: Stores static files (CSS, client-side JavaScript)
- `/db`: Houses the SQLite database file
- `app.js`: Main server file with Express configuration and route handlers
- `package.json`: Node.js dependencies and script commands

## Installation and Setup
1. Clone the repository:
   ```
   git clone [repository-url]
   cd [repository-name]
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Start the server:
   ```
   node app.js
   ```
4. Access the application at `http://localhost:4000`

## Main Pages and Functionality

### Home Page
- Options for equipment issuance and admin panel access

### Equipment Issuance Page
- Form for recording equipment issuance details
- Automatic generation of issuance numbers

### Equipment Return Page
- User-friendly interface for employees to mark equipment as returned
- Displays active issuances for the selected user

### Admin Panel
- Comprehensive view of all equipment issuances
- Search functionality across all fields
- Option to confirm equipment returns
- Excel export of all records
- Access to user management and equipment type management

### Equipment Type Management
- Add, edit, or remove equipment types

### User Management
- Add new admin users
- Change admin passwords

## Business Logic

### Equipment Issuance
- Automatic assignment of issuance numbers in the format IT[YY]-[NNNN]
- Recording of issuance details in the database

### Equipment Return
- Two-step return process: user marks return, admin confirms
- Timestamp recording for return actions

### Admin Functions
- View and search all equipment records
- Confirm equipment returns
- Manage equipment types
- Manage admin users

## Security
- Password hashing using bcrypt
- Session-based authentication for admin access

## Future Enhancements
- Implement more advanced search techniques for large datasets
- Add pagination for equipment records
- Implement user roles with varying levels of access
- Add email notifications for overdue equipment

## Contributing
Contributions to improve the system are welcome. Please follow these steps:
1. Fork the repository
2. Create a new branch (`git checkout -b feature-branch`)
3. Make your changes and commit (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin feature-branch`)
5. Create a new Pull Request

### Managing Admin Users

This section describes how to manage admin users, including how to remove an admin and update an admin's password.

#### Removing an Admin

To remove an admin user, follow these steps:

1. **Access the Admin Panel**: Log in with a user that has the 'god' role.
2. **Navigate to Delete Admin**:
   - Go to the URL `/confirm-delete/:username`, replacing `:username` with the username of the admin you want to delete.
   - The page will show a confirmation prompt.
3. **Confirm Deletion**:
   - Confirm the deletion to permanently remove the admin from the database.

   > **Note**: Only users with the 'god' role can delete other admins. This action is irreversible, so proceed with caution.

#### Updating an Admin's Password

To update the password for an admin user, follow these steps:

1. **Access the Password Reset Form**:
   - Log in with a user that has the 'god' role.
   - Navigate to the URL `/reset-password`.
2. **Submit the New Password**:
   - Fill out the form with the username of the admin whose password you wish to update and the new password.
   - Submit the form, and the password will be securely hashed and updated in the database.

   > **Note**: This action requires 'god' role permissions. Ensure that the new password meets security requirements.