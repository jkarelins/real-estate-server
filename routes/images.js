const { Router } = require("express");
const router = new Router();
require("dotenv").config();
const cloudinary = require("cloudinary");
const formData = require("express-form-data");

const Image = require("../models/image/image");
const AdvertImage = require("../models/image/advert_image");
const Advert = require("../models/advert");
const auth = require("../middleware/auth");
const { isAdvertOwner } = require("../middleware/userroles");

//USE ACCESS TOKENS FROM .ENV IN ROOT
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

router.use(formData.parse());

//ROUTE TO UPLOAD ONE IMAGE
router.post("/upload/:advertId", auth, isAdvertOwner, (req, res, next) => {
  const path = req.files.image.path;
  cloudinary.uploader
    .upload(path, { quality: "auto", fetch_format: "auto" })
    .then(data => {
      Image.create({ url: data.url, public_id: data.public_id })
        .then(image => {
          AdvertImage.create({ imageId: image.id, advertId: req.advert.id })
            .then(() => {
              res.send({ url: data.url });
            })
            .catch(next);
        })
        .catch(next);
    })
    .catch(next);
});

module.exports = router;

// function advertNotFound(res) {
//   return res.status(400).send({
//     message: "Sorry advert with provided id not found"
//   });
// }

//received image object:
// {
//   public_id: 'vtpq80p4jjnyam0swxmv',
//   version: 1585051068,
//   signature: '297c9604ac5c49d4344d01c76e426dbedefb1543',
//   width: 1056,
//   height: 1408,
//   format: 'jpg',
//   resource_type: 'image',
//   created_at: '2020-03-24T11:57:48Z',
//   tags: [],
//   bytes: 134452,
//   type: 'upload',
//   etag: '67abbcda4308a112740ce38a2940f296',
//   placeholder: false,
//   url: 'http://res.cloudinary.com/dpjzmbojz/image/upload/v1585051068/vtpq80p4jjnyam0swxmv.jpg',
//   secure_url: 'https://res.cloudinary.com/dpjzmbojz/image/upload/v1585051068/vtpq80p4jjnyam0swxmv.jpg',
//   original_filename: '75jsxC7I6P3NO00QJzK9gwum',
//   original_extension: 'jpeg'
// }

//ROUTE TO LOAD ARRAY OF FILES
// router.post("/upload", (req, res, next) => {
//   // const values = Object.values(req.files);
//   // const promises = values.map(image => {
//   //   cloudinary.uploader.upload(image.path);
//   // });
//   // Promise.all(promises)
//   //   .then(results => res.json(results))
//   //   .catch(next);
// });

// console.log(process.env);
// cloudinary.uploader.upload(
//   "sample.jpg",
//   { crop: "limit", tags: "samples", width: 3000, height: 2000 },
//   function(result) {
//     console.log(result);
//   }
// );
