// Backend/routes/claudinary.route.js
const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer');

router.post('/upload-image', upload.array('images', 5), (req, res) => {
  try {
    return res.status(200).json({ imageUrl: req.file.path });
  } catch (err) {
    return res.status(500).json({ message: 'Image upload failed' });
  }
})

module.exports = router;
