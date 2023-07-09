import React from "react";
import "./App.css";
import { convertFileToBase64, downloadBase64File } from "./helper-functions";

function App() {
  const [file, setFile] = React.useState<File | undefined>(undefined);

  const [format, setFormat] = React.useState<undefined | string>(undefined);
  const [height, setHeight] = React.useState<undefined | string>(undefined);
  const [width, setWidth] = React.useState<undefined | string>(undefined);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<undefined | string>(undefined);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();

      if (!file) {
        return setError("Image not found.");
      }

      if (!height) {
        return setError("Invalid or missing height");
      }

      if (!width) {
        return setError("Invalid or missing width");
      }

      if (!format || ["PNG", "JPG", "JPEG"].indexOf(format) === -1) {
        return setError("Invalid or missing format");
      }

      var data = new FormData();
      data.append("file", file);
      data.append("height", height);
      data.append("width", width);
      data.append("format", format);

      setError(undefined);
      setIsLoading(true);

      const rawResponse = await fetch("http://localhost/upload", {
        method: "POST",
        body: data,
      });

      if (rawResponse.status === 200) {
        const content = await rawResponse.json();

        downloadBase64File(content.imageBase64, format.toLocaleLowerCase());
      } else {
        const content = await rawResponse.json();
        setError(content.message);
      }
    } catch (error: any) {
      setError("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return setFile(undefined);
    }

    const newFile = e.target.files[0];
    const newFileNameArr = newFile.name.split(".");
    const newFileFormat = newFileNameArr.pop()?.toUpperCase();

    const imageBase64 = await convertFileToBase64(newFile);

    const image = new Image();
    image.src = imageBase64;
    image.onload = () => {
      const { height, width } = image;

      setFile(newFile);

      setHeight(String(height));
      setWidth(String(width));
      setFormat(newFileFormat);

      setError(undefined);
    };
  };

  return (
    <div className="container">
      <h1>Sharpio - Your go-to tool for image operations</h1>

      <div className="card">
        <div className="drop_box">
          <h3>Upload File here</h3>
          <p>Files Supported: PNG, JPG, and JPEG</p>

          <form onSubmit={handleSubmit}>
            <div className="form">
              <input
                type="file"
                className="fileInput"
                accept=".png,.jpg,.jpeg"
                id="file"
                disabled={isLoading}
                onChange={handleFileChange}
              />
              <label>Output Format:</label>

              <select
                name="format"
                id="format"
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                defaultValue="Format"
              >
                <option value="Format" disabled>
                  Format
                </option>
                <option value="PNG">PNG</option>
                <option value="JPG">JPG</option>
                <option value="JPEG">JPEG</option>
              </select>

              <label>Output Dimensions:</label>
              <input
                className="numberInput"
                type="number"
                placeholder="height"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
              <input
                className="numberInput"
                type="number"
                placeholder="width"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
              />

              <p id="error">{error}</p>

              <button
                type="submit"
                className="btn"
                id="submit-btn"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Convert & Download"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
