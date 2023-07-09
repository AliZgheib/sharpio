export const convertFileToBase64 = async (file: any): Promise<any> => {
  return new Promise((res, rej) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      res(reader.result);
    };
    reader.onerror = function (error) {
      console.log("Error: ", error);
      rej(error);
    };
  });
};
export const downloadBase64File = (base64Data: string, fileFormat: string) => {
  const linkSource = `data:${fileFormat};base64,${base64Data}`;
  const downloadLink = document.createElement("a");
  downloadLink.href = linkSource;
  downloadLink.download = `sharpio-${Date.now()}.${fileFormat}`;
  downloadLink.click();
};
