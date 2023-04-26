import React, { useState, useEffect } from "react";
import imageCompression from "browser-image-compression";

function SubirFoto({ setImage }) {
  const handleImageUpload = async (e) => {
    const imageFile = e.target.files[0];

    console.log("originalFile instanceof Blob", imageFile instanceof Blob); // true
    console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`);

    const options = {
      maxSizeMB: 0.3,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    try {
      const compressedFile = await imageCompression(imageFile, options);
      //   console.log(
      //     "compressedFile instanceof Blob",
      //     compressedFile instanceof Blob
      //   ); // true

      //   console.log(
      //     `compressedFile size ${compressedFile.size / 1024 / 1024} MB`
      //   ); // smaller than maxSizeMB

      await uploadToServer(compressedFile); // write your own logic
    } catch (error) {
      console.log(error);
    }
  };

  const uploadToServer = async (img) => {
    const url = `https://api.imgbb.com/1/upload?expiration=600&key=4224ad473b203cf0187d7de1c66fbade&name=${img.name}`;
    const data = new FormData();
    data.append("image", img);

    try {
      const response = await fetch(url, {
        method: "POST",
        body: data,
      });

      const responseData = await response.json();

      // Do something with the response data

      setImage(responseData.data.url);

      return responseData;
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <input
      type="file"
      name="imagen"
      onChange={handleImageUpload}
      style={{ border: "none", padding: "0" }}
    />
  );
}

export default SubirFoto;
