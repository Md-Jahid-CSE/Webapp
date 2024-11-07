const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

const DATA_FILE = './teams.json';

// Function to read data from file
const readData = () => {
    if (!fs.existsSync(DATA_FILE)) {
        return [];
    }
    const data = fs.readFileSync(DATA_FILE);
    return JSON.parse(data);
};

// Function to write data to file
const writeData = (data) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// Endpoint to get all teams
app.get('/teams', (req, res) => {
    res.json(readData());
});

// Endpoint to add a new team
app.post('/teams', (req, res) => {
    const { leader, group, presentation } = req.body;
    const teams = readData();

    // Check for duplicate
    if (teams.some(team => team.leader === leader && team.group === group)) {
        return res.status(400).json({ error: 'This team leader and group number combination already exists.' });
    }

    teams.push({ leader, group, presentation });
    writeData(teams);
    res.json({ message: 'Team added successfully.' });
});

// Endpoint to delete a team
app.delete('/teams', (req, res) => {
    const { leader, group, password } = req.body;

    if (password !== 'Jahid@126') {
        return res.status(403).json({ error: 'Incorrect password.' });
    }

    let teams = readData();
    const newTeams = teams.filter(team => !(team.leader === leader && team.group === group));

    if (newTeams.length === teams.length) {
        return res.status(404).json({ error: 'Team not found.' });
    }

    writeData(newTeams);
    res.json({ message: 'Team deleted successfully.' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
