import { useState } from "react";
import axios from "axios";
import lighthouse from "@lighthouse-web3/sdk";
import "./FileUpload.css";

const FileUpload = ({ contract, account, provider }) => {
  const [file, setFile] = useState([]);
  const [fileName, setFileName] = useState("No File selected");
  const lightapi = "609989b0.b85f2616ce1a490eb457e1fd4d7bc994";

  const [loading, setLoading] = useState(false)

  const progressCallback = (progressData) => {
    let percentageDone =
      100 - (progressData?.total / progressData?.uploaded)?.toFixed(2)
    console.log(percentageDone)
  }

  const uploadFile = async (file) => {
    setFileName(file[0].name)
    setLoading(true);
    try {
      const output = await lighthouse.upload(
        file,
        lightapi,
        false,
        null,
        progressCallback
      );
      console.log("File Status:", output);
      console.log(
        "Visit at https://gateway.lighthouse.storage/ipfs/" + output.data.Hash
      );
      contract.add(account, `https://gateway.lighthouse.storage/ipfs/${output.data.Hash}`);
      alert("Successfully Image Uploaded");
      return output.data.Hash;
    } finally {
      setLoading(false);
      setFileName("No File selected") // Set loading back to false when uploading is complete
    }
  };

  return (
    <div className="flex justify-center items-center">
      <form className="form">
        <label
          htmlFor="file-upload"
          className="mb-5 cursor-pointer py-2 flex justify-center text-white items-center bg-[#8364E2] hover:shadow-xl hover:bg-purple-700 rounded-md px-4 text-sm font-semibold"
        >
          {loading ? "Uploading..." : "Choose File"}
        </label>
        <input
          disabled={!account}
          type="file"
          id="file-upload"
          name="data"
          onChange={(e) => {
            uploadFile(e.target.files);
          }}
        />

        <span className="flex justify-center items-center font-semibold text-black">
          File: {fileName}
        </span>
        {/* <button
          type="submit"
          className="cursor-pointer mt-5 w-full py-2 flex justify-center text-white items-center bg-green-500 hover:shadow-xl hover:bg-green-600 rounded-md px-4 text-sm font-semibold"
          disabled={!file}
        >
          Upload File
        </button> */}
      </form>
    </div>
  );
};

export default FileUpload;
