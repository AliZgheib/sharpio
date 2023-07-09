const express = require("express");
const bodyParser = require("body-parser");
const sharp = require("sharp");
const multer = require("multer");
const cors = require("cors");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const upload = multer({
  dest: "/uploads",
  // you might also want to set some limits: https://github.com/expressjs/multer#limits
});

app.post(
  "/upload",
  upload.single("file" /* name attribute of <file> element in your form */),
  async (req, res) => {
    try {
      const tempPath = req.file.path;

      const { height, width, format } = req.body;
      
      console.log(tempPath, height, width, format);

      if (!height || isNaN(height)) {
        throw new Error("Invalid or missing height");
      }

      if (!width || isNaN(height)) {
        throw new Error("Invalid or missing width");
      }

      if (!format || ["PNG", "JPG", "JPEG"].indexOf(format) === -1) {
        throw new Error("Invalid or missing format");
      }

      sharp(tempPath)
        .resize({
          width: Number(width),
          height: Number(height),
        })
        .toFormat(format.toLocaleLowerCase())
        .toBuffer((error, buffer) => {
          if (error) {
            return res
              .status(400)
              .send({ message: "Failed to process the image" });
          }

          const imageBase64 = buffer.toString("base64");

          res.status(200).send({
            imageBase64: imageBase64,
          });
        });
    } catch (error) {
      res.status(400).send({ message: "Failed to process the image" });
    }
  }
);

const server = app.listen(80, function () {
  const port = server.address().port;

  console.log("app listening at port", port);
});
