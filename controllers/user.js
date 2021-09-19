const User = require("../models/user");
const cloudinary = require('cloudinary').v2;
const {
    v1: uuidv1
} = require("uuid");


exports.getUserById = (req, res, next, id) => {
    User.findById(id, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "No user was found in DB"
            })
        }
        req.profile = user;
        next();
    });
};

exports.getUser = (req, res) => {
    req.profile.salt = undefined;
    req.profile.encry_password = undefined;
    return res.json(req.profile);
};

exports.updateUser = (req, res) => {
    User.findByIdAndUpdate(
        { _id: req.profile._id },
        { $set: req.body },
        { new: true, useFindAndModify: false },
        (err, user) => {
        if (err) {
            return res.status(400).json({
            error: "You are not authorized to update this user"
            });
        }
        user.salt = undefined;
        user.encry_password = undefined;
        res.json(user);
        }
    );
};


exports.addToGallery = (req, res) => {
    console.log(req.files);
    console.log('req.body :', req.body);
        //     i. title (title for the image)
        //    ii. description (about image)
        //    iii. image_by (author of the image)
        //    iv. is_private
        //destructure the fields
        const { title, description, image_by, is_private } = req.body;
        if (!title || !description ) {
            return res.status(400).json({
            error: "Please include all fields"
            });
        }

        let imageObject = {
            id: uuidv1(),
            image_by: req.profile.name,
            ...req.body,
        }
        console.log(imageObject);
        console.log(req.files.image);
    if(req.files.image) {
        cloudinary.uploader.upload(req.files.image.tempFilePath, (err, result) => {
            console.log()
        if (err) {
            console.log(err)
            res.status(400).json({
            messge: 'someting went wrong while processing your request',
            data: {
            err
            }
            })
        }
        console.log(result)
        const image = result.url;
        imageObject.uploadImageUrl = image;
        User.findByIdAndUpdate(
            { _id: req.profile._id },
            { $push: { images: imageObject } },
            { new: true, useFindAndModify: false },
            (err, user) => {
            if (err) {
                console.log(err);
                return res.status(400).json({
                error: "You are not authorized to update this user"
                });
            }
            user.salt = undefined;
            user.encry_password = undefined;
            res.json(user);
            }
        );
        });
        }
    };


exports.updateGalleryImage = (req, res) => {
    console.log(req.files);
    console.log('req.body :', req.body, req.params.imageId);
    console.log(req.profile)
        //     i. title (title for the image)
        //    ii. description (about image)
        //    iii. image_by (author of the image)
        //    iv. is_private
        //destructure the fields
        const { title, description, is_private } = req.body;

        if (!title || !description || !is_private ) {
            return res.status(400).json({
                error: "Please include all fields"
            });
        }

        let imageObject = {
            image_by: req.profile.name,
            ...req.body,
        }
        console.log(imageObject);
        console.log(req.files.image);
    if(req.files.image) {
    cloudinary.uploader.upload(req.files.image.tempFilePath, (err, result) => {
        console.log()
        if (err) {
            console.log(err)
            res.status(400).json({
            messge: 'someting went wrong while processing your request',
            data: {
            err
            }
            })
        }
        console.log(result)
        const image = result.url;
        imageObject.uploadImageUrl = image;
        const isImageExists = req.profile.images.filter(image => image === req.params.imageId);
        let newImagesArray = []
        if (isImageExists.length > 0) {
            newImagesArray = req.profile.images.map(image => {
                if (image.id == req.params.imageId) {
                    return {...image, ...imageObject};
                }
                return image;
            })
        } else {
            return res.status(404).json({
                error: 'Image not Found'
            })
        }
        User.findByIdAndUpdate(
            { _id: req.profile._id },
            { $set: { images: newImagesArray } },
            { new: true, useFindAndModify: false },
            (err, user) => {
            if (err) {
                console.log(err);
                return res.status(400).json({
                error: "You are not authorized to update this user"
                });
            }
            user.salt = undefined;
            user.encry_password = undefined;
            res.json(user);
            }
        );
        });
        }
    };

exports.deleteImageFromGallery = (req, res) => {
    User.findByIdAndUpdate(
        { _id: req.profile._id },
        { $pull: { images: { id: req.params.imageId} } },
        { new: true, useFindAndModify: false },
        (err, user) => {
        if (err) {
            console.log(err);
            return res.status(400).json({
            error: "You are not authorized to update this user"
            });
        }
        user.salt = undefined;
        user.encry_password = undefined;
        res.json(user);
        }
    );
}


exports.getAllImageFromGallery = (req, res) => {
    return res.json(req.profile.images);
}

exports.getPrivateImageFromGallery = (req, res) => {
    const privateImageArray = req.profile.images.filter(image => image.is_private === "granted");
    return res.json(privateImageArray);
}

exports.getAllUsersPublicImage = (req, res) => {
    User.find((err, users) => {
        if (err || !users) {
            return res.status(400).json({
                error: "No User Found"
            });
        }

        // res.json(users);
        let AllpublicImageArray = users.map(user => user.images);
        console.log(AllpublicImageArray);
        const newArray = AllpublicImageArray.flat();
        const AllPublicImage = newArray.filter(image => image.is_private === "denied");
        return res.json(AllPublicImage);
    })
}