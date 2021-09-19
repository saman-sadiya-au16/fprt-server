const express = require('express');
const { isSignedIn, isAuthenticated } = require('../controllers/auth');
const { getUserById, addToGallery, updateGalleryImage, deleteImageFromGallery, getAllImageFromGallery, getPrivateImageFromGallery, getAllUsersPublicImage } = require('../controllers/user');
const router = express.Router();

//all of params
router.param("userId", getUserById);

router.post(
  "/user/:userId/image",
  isSignedIn,
  isAuthenticated,
  addToGallery
);

router.put(
  "/user/:userId/image/:imageId",
  isSignedIn,
  isAuthenticated,
  updateGalleryImage
);

router.delete(
  "/user/:userId/image/:imageId",
  isSignedIn,
  isAuthenticated,
  deleteImageFromGallery,
);

router.get(
  "/user/:userId/image",
  isSignedIn,
  isAuthenticated,
  getAllImageFromGallery,
);

router.get(
  "/user/:userId/image/private",
  isSignedIn,
  isAuthenticated,
  getPrivateImageFromGallery,
);

router.get(
  "/user/image/public",
  getAllUsersPublicImage,
);

module.exports = router;
