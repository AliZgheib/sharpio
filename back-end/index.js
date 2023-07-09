const express = require("express");
const bodyParser = require("body-parser");
const sharp = require("sharp");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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

      if (!height || isNaN(height)) {
        throw new Error("Invalid height");
      }

      if (!width || isNaN(width)) {
        throw new Error("Invalid width");
      }

      if (!format || ["png", "jpg", "jpeg"].indexOf(format) === -1) {
        throw new Error("Invalid format");
      }

      sharp(tempPath)
        .resize({
          width: Number(width),
          height: Number(height),
        })
        .toFormat(format)
        .toBuffer((error, buffer) => {
          if (error) {
            throw new Error(error.message);
          }

          var encodedBuffer = buffer.toString("base64");

          res.status(200).send(encodedBuffer);
        });
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  }
);

const server = app.listen(8081, function () {
  const port = server.address().port;

  console.log("Example app listening at port", port);
});
