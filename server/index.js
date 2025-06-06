const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Sambung ke MongoDB (cuma buat feedback)
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB nyambung bro!'))
  .catch(err => console.error('Gagal nyambung MongoDB:', err));

// Schema buat feedback
const feedbackSchema = new mongoose.Schema({
  email: String,
  feedback: String,
  timestamp: { type: Date, default: Date.now },
});
const Feedback = mongoose.model('Feedback', feedbackSchema);

// Endpoint tes
app.get('/', (req, res) => {
  res.send('Yo bro, backend lo udah nyala!');
});

// Endpoint buat terima feedback (tanpa login)
app.post('/feedback', async (req, res) => {
  const { feedback, email } = req.body;

  if (!feedback) {
    return res.status(400).json({ error: 'Feedback tidak boleh kosong' });
  }

  try {
    const feedbackData = new Feedback({
      email: email || 'Anonymous',
      feedback: feedback,
    });
    await feedbackData.save();

    console.log('Feedback diterima:', { email: feedbackData.email, feedback, timestamp: feedbackData.timestamp });
    res.status(200).json({ message: 'Feedback berhasil diterima' });
  } catch (err) {
    console.error('Error saving feedback:', err);
    res.status(500).json({ error: 'Gagal simpan feedback' });
  }
});

// Endpoint buat lihat semua feedback (tanpa autentikasi, buat tes)
app.get('/feedbacks', async (req, res) => {
  try {
    const allFeedbacks = await Feedback.find();
    res.status(200).json(allFeedbacks);
  } catch (err) {
    res.status(500).json({ error: 'Gagal ambil feedback' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log('Server nyala di http://localhost:3000');
});