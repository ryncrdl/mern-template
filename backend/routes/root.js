const express = require('express');
const router = express.Router()
const path = require('path')
const filePath = path.join(__dirname, '..', "views", "index.html")
router.get('^/$|index(.html)?', (req, res) => res.sendFile(filePath))

module.exports = router