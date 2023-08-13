const express = require('express');
const session = require('express-session');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

let usersData = [];
let isAdminPanelOpen = false;
let adminCredentials = []; // Данные для аутентификации администратора
let actionHistory = [];

app.set('trust proxy', 1);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  proxy: true // Установите этот параметр в true
}));
app.use(express.static(path.join(__dirname, 'images')));

// Read initial data from JSON files
function initializeData() {
  try {
    const usersJson = fs.readFileSync('users.json');
    usersData = JSON.parse(usersJson);
  } catch (error) {
    usersData = [];
  }

  try {
    const adminJson = fs.readFileSync('admin.json');
    adminCredentials = JSON.parse(adminJson);
  } catch (error) {
    adminCredentials = [];
  }

  try {
    const actionHistoryJson = fs.readFileSync('action_history.json');
    actionHistory = JSON.parse(actionHistoryJson);
  } catch (error) {
    actionHistory = [];
  }
}

// Write data to JSON files
function writeDataToFiles() {
  fs.writeFileSync('users.json', JSON.stringify(usersData, null, 2));
  fs.writeFileSync('admin.json', JSON.stringify(adminCredentials, null, 2));
}

// Function to read data from the file
function readDataFromFile() {
  try {
    const data = fs.readFileSync('users.json');
    usersData = JSON.parse(data);
  } catch (error) {
    usersData = [];
  }
}

// Function to write data to the file
function writeDataToFile() {
  fs.writeFileSync('users.json', JSON.stringify(usersData));
}

// Function to read admin credentials from the file
function readAdminCredentials() {
  try {
    const data = fs.readFileSync('admin.json');
    adminCredentials = JSON.parse(data);
  } catch (error) {
    adminCredentials = []; // Изменяем на массив
  }
}

// Function to write admin data to the file
function writeAdminDataToFile(adminData) {
  const adminJson = JSON.stringify(adminData);
  fs.writeFileSync('admin.json', adminJson);
}

// Function to read action history from the file
function readActionHistory() {
  try {
    const data = fs.readFileSync('action_history.json');
    actionHistory = JSON.parse(data);
  } catch (error) {
    actionHistory = [];
  }
}

// Function to write action history to the file
function writeActionHistoryToFile() {
  fs.writeFileSync('action_history.json', JSON.stringify(actionHistory));
}

// Home page with user form
app.get('/user-form', (req, res) => {
  res.render('user-form.ejs');
});

app.post('/submit', (req, res) => {
  const { lastName, firstName, birthDate, equipment, returnDate, admin, adminpost } = req.body;

  const userData = {
    lastName,
    firstName,
    birthDate,
    equipment,
    returnDate,
    admin,
    adminpost,
    status: "Выдано", // Add the status field with initial value "Выдано"
  };

  usersData.push(userData);
  writeDataToFile();

  res.redirect('/'); // Redirect back to the user form
});

// Admin login page
app.get('/admin-login', (req, res) => {
  res.render('admin-login.ejs');
});

// Admin login handler
app.post('/login', (req, res) => {
  const { adminUsername, adminPassword } = req.body;

  readAdminCredentials();

  // Используем метод some() для проверки аутентификации
  if (
    adminCredentials.some(
      (admin) =>
        admin.username === adminUsername && admin.password === adminPassword
    )
  ) {
    console.log('login adminUsername:', adminUsername,'req.session.adminUsername:', req.session.adminUsername);

    // Генерируем уникальный сессионный ключ
    const sessionKey = generateUniqueSessionKey(adminUsername);
    
    // Сохраняем сессионный ключ в сессии
    req.session.adminSessionKey = sessionKey;
    req.session.adminUsername = adminUsername; // Store the admin username in the session
    console.log('login adminUsername:', adminUsername,'req.session.adminUsername:', req.session.adminUsername);
    isAdminPanelOpen = true;
    readDataFromFile();
    res.redirect('/admin');
  } else {
    res.send('Incorrect username or password');
  }
});


// Admin panel page displaying all users
app.get('/admin', (req, res) => {
  if (isAdminPanelOpen) {
    res.render('admin-panel.ejs', { users: usersData, adminUsername: req.session.adminUsername });
    console.log('admin req.session.adminUsername:', req.session.adminUsername);
  } else {
    res.redirect('/admin-login');
  }
});

// Delete user from the admin panel
app.post('/delete/:index', (req, res) => {
  const { index } = req.params;
  usersData.splice(index, 1);
  writeDataToFile();
  res.redirect('/admin');
});

// Return to the user form from the admin panel
app.post('/return', (req, res) => {
  isAdminPanelOpen = false;
  res.redirect('/');
});

// Home page with user form
app.get('/', (req, res) => {
  res.render('main-page.ejs');
});

// Submit user form data and redirect back to the form
app.post('/submit', (req, res) => {
  const { lastName, firstName, birthDate, equipment, adminpost } = req.body;

  const userData = {
    lastName,
    firstName,
    birthDate,
    equipment,
    adminpost,
    status: "Выдано", // Add the status field with initial value "Выдано"
  };

  usersData.push(userData);
  writeDataToFile();

  res.redirect('/'); // Redirect back to the user form
});

// Page for returning equipment
app.get('/return-equipment', (req, res) => {
  readDataFromFile();
  res.render('return-equipment.ejs', { users: usersData });
});

// Return equipment route
app.post('/return-equipment/:index', (req, res) => {
  const { index } = req.params;
  usersData[index].status = "На подтверждении"; // Update the status to "На подтверждении"
  usersData[index].returnedDate = new Date().toLocaleString('ru-RU'); // Add the returned date
  writeDataToFile();

  // Redirect to the Возврат оборудования page
  res.redirect('/return-equipment');
});

///////////////////////////////////////////////////
app.post('/return/:index', (req, res) => {
  const { index } = req.params;
  const user = usersData[index];

  if (user.status === "На подтверждении") {
    user.confirm = true;
    writeDataToFiles();

    // Чтение истории действий перед добавлением новой записи
    readActionHistory();
    console.log('return req.session.adminUsername:', req.session.adminUsername);

    const admin = req.session.adminUsername || 'Unknown'; // Use req.session.adminUsername here
    const deleteDate = new Date().toLocaleString('ru-RU'); // Форматирование даты как "дд.мм.гггг, чч:мм"
    actionHistory.push({
      ...user,
      admin,
      deleteDate,
    });
    writeActionHistoryToFile();

    // Удаление записи из массива usersData
    usersData.splice(index, 1);
    writeDataToFiles();
  } else {
    // Возврат предупреждающего сообщения, если оборудование еще не возвращено
    res.send('<script>alert("Оборудование еще не возвращено"); window.location.href="/admin-panel";</script>');
    return;
  }

  res.redirect('/admin-panel');
});

// Admin panel route
app.get('/admin-panel', (req, res) => {
  readDataFromFile();
  res.render('admin-panel.ejs', { users: usersData, adminUsername: req.session.adminUsername });
  console.log('admin-panel req.session.adminUsername:', req.session.adminUsername);
});

// Search and filter the admin panel
app.post('/admin-panel', (req, res) => {
  const searchTerm = req.body.searchTerm.toLowerCase();
  readDataFromFile();

  const filteredUsers = usersData.filter(
    (user) =>
      user.lastName.toLowerCase().includes(searchTerm) ||
      user.firstName.toLowerCase().includes(searchTerm) ||
      user.equipment.toLowerCase().includes(searchTerm) ||
      user.adminpost.toLowerCase().includes(searchTerm) ||
      user.birthDate.toLowerCase().includes(searchTerm)
  );

  res.render('admin-panel.ejs', { users: filteredUsers });
});

// Confirm equipment return
app.post('/confirm-return/:index', (req, res) => {
  const { index } = req.params;
  usersData.splice(index, 1);
  writeDataToFiles();

  // Add action to the history
  const admin = req.session.adminUsername; // Access the stored admin username from the session
  const deleteDate = new Date().toLocaleString('ru-RU'); // Format date as "дд.мм.гггг, чч:мм"
  actionHistory.push({
    ...usersData[index], // Use user data, not actionHistory[index]
    admin,
    deleteDate,
  });
  writeActionHistoryToFile(); // Save action history to file

  res.redirect('/admin-panel');
});

// Display action history
app.get('/action-history', (req, res) => {
  readActionHistory();
  res.render('action-history.ejs', { history: actionHistory });
});

// Page for changing admin password (requires authentication)
app.get('/change-password', requireAuth, (req, res) => {
  res.render('change-password.ejs');
});

// Handle changing admin password
app.post('/change-password', requireAuth, (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const admin = req.session.adminUsername;

  const adminIndex = adminCredentials.findIndex(a => a.username === admin);

  if (adminIndex !== -1 && adminCredentials[adminIndex].password === oldPassword) {
    adminCredentials[adminIndex].password = newPassword;
    writeAdminDataToFile(adminCredentials);
    res.redirect('/admin-panel');
  } else {
    res.send('Incorrect old password');
  }
});

// Page for adding new admin (requires authentication)
app.get('/add-admin', requireAuth, (req, res) => {
  res.render('add-admin.ejs');
});

// Handle adding new admin
app.post('/add-admin', requireAuth, (req, res) => {
  const { newUsername, newPassword } = req.body;
  const newAdmin = { username: newUsername, password: newPassword };

  adminCredentials.push(newAdmin);
  writeAdminDataToFile(adminCredentials);

  res.redirect('/admin-panel');
});

// Middleware for checking authentication
function requireAuth(req, res, next) {
  if (
    req.session.adminUsername &&
    req.session.adminSessionKey &&
    req.session.adminSessionKey === generateUniqueSessionKey(req.session.adminUsername) &&
    isAdminPanelOpen
  ) {
    // User is authenticated and admin panel is open, proceed
    next();
  } else {
    // User is not authenticated or admin panel is not open, redirect to login
    res.redirect('/admin-login');
  }
}

// Функция для генерации уникального сессионного ключа
function generateUniqueSessionKey(username) {
  // Здесь вы можете использовать любой способ для генерации уникального ключа,
  // например, комбинировать имя администратора
  return `${username}`;
}

// Start the server
app.listen(port, () => {
  initializeData(); // Read initial data from JSON files
  console.log(`Server is running on http://localhost:${port}`);
});
