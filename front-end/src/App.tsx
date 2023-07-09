import React from "react";
import "./App.css";

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
      setError(undefined);
      setIsLoading(true);
    } catch (error) {
      setError("Image is invalid or too large.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return setFile(undefined);
    }

    const newFile = e.target.files[0];
    const newFileNameArr = newFile.name.split(".");
    const fileExtension = newFileNameArr.pop()?.toUpperCase();

    setFile(e.target.files[0]);
    setFormat(fileExtension);
    setError(undefined);
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
                height={height}
                onChange={(e) => setHeight(e.target.value)}
              />
              <input
                className="numberInput"
                type="number"
                placeholder="width"
                width={width}
                onChange={(e) => setWidth(e.target.value)}
              />

              <p id="error">{error}</p>
              <button
                type="submit"
                className="btn"
                id="submit-btn"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Upload"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
