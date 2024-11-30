const express = require('express');
const router = express.Router();
const { Services } = require('../models');
const serviceController = require('../controllers/serviceController');
const { isAuthenticated } = require('../../utilis/auth');
const multer = require('multer');
var ImageKit = require("imagekit");

const upload = multer({ storage: multer.memoryStorage() });

// SDK initialization
var imagekit = new ImageKit({
  publicKey: "public_5J27hETdJ/Qqdmt102EjAbUOOd4=",
  privateKey: "private_rI5739WSAbOayuMXnydJW74H40k=",
  urlEndpoint: "https://ik.imagekit.io/rw05vsmbv"
});

router.get('/dashboard', isAuthenticated, async (req, res) => {
  const totalActiveServices = await Services.count({ where: { status: 1 } });
  const totalServices = await Services.count();

  res.render('dashboard', { totalActiveServices, totalServices });
});


router.get('/services', isAuthenticated, serviceController.GetAllServices);
router.get('/services/add-view', isAuthenticated, serviceController.AddServiceView);
router.post('/services/add', isAuthenticated, upload.any(), serviceController.AddService);
router.get('/services/edit-view/:id', isAuthenticated, serviceController.EditServiceView);
router.post('/services/edit/:id', isAuthenticated, upload.any(), serviceController.EditService);
router.get('/services/status/:id', isAuthenticated, serviceController.ChangeStatusService);
router.get('/services/delete/:id', isAuthenticated, serviceController.DeleteService);

router.post('/upload-image', isAuthenticated, upload.single('file'), (req, res) => {
  const file = req.file;

  if (file) {
    imagekit.upload({
      file: file.buffer, // Buffer from multer
      fileName: file.originalname, // File name from the uploaded file
    }, function (error, result) {
      if (error) {
        return res.status(500).json({ error: 'Image upload failed', details: error });
      }
      // Send back the image URL
      res.json({ url: result.url });
    });
  } else {
    res.status(400).json({ error: 'No file uploaded' });
  }
});


module.exports = router;
