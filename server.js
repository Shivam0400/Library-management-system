const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

const seatsFilePath = path.join(__dirname, 'seats.json');

app.use(express.static('public'));
app.use(express.json());

// Serve homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Serve availability page
app.get('/availability', (req, res) => {
  const seats = JSON.parse(fs.readFileSync(seatsFilePath));
  res.json({ seats });
});

// Handle seat allocation POST request
app.post('/allocate-seat', (req, res) => {
  const { index } = req.body;
  if (index === undefined) return res.status(400).json({ error: 'Seat index is required' });

  const seats = JSON.parse(fs.readFileSync(seatsFilePath));
  if (seats[index]) {
    return res.status(409).json({ error: 'Seat already occupied' });
  }

  seats[index] = true; // mark seat as occupied
  fs.writeFileSync(seatsFilePath, JSON.stringify(seats));

  res.json({ success: true, message: `Seat ${index + 1} allocated successfully.` });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
