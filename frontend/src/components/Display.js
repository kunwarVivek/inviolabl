import { useState } from "react";
import "./Display.css";
import lighthouse from "@lighthouse-web3/sdk";


const Display = ({ contract, account }) => {
  const [data, setData] = useState("");
  const [fileDetails, setFileDetails] = useState([]);
  const getdata = async () => {
    let dataArray;
    const Otheraddress = document.querySelector(".address").value;
    try {
      if (Otheraddress) {
        dataArray = await contract.display(Otheraddress);
        console.log(dataArray);
      } else {
        dataArray = await contract.display(account);
      }
    } catch (e) {
      alert("You don't have access");
    }
    const isEmpty = Object.keys(dataArray).length === 0;
    console.log(dataArray)

    if (!isEmpty) {
      const str = dataArray.toString();
      const str_array = str.split(",");
      // console.log(str);
      // console.log(str_array);
      const getCIDFromUrl = (url) => {
        const parts = url.split('/');
        return parts[parts.length - 1];
      };

      const lighthouseUrls = str_array.filter(url => url.includes('lighthouse.storage'));

      const cids = lighthouseUrls.map(getCIDFromUrl);
      // console.log(cids);
      const fileInfoArray = [];

      const fileInfo = async (cid) => {
        try {
          const fileInfoResult = await lighthouse.getFileInfo(cid);
          fileInfoArray.push(fileInfoResult.data);
        } catch (error) {
          console.error(`Error retrieving file info for CID ${cid}: ${error.message}`);
        }
      };

      // Loop through each CID and retrieve file details
      const retrieveFileInfoForCids = async () => {
        for (const cid of cids) {
          await fileInfo(cid);
        }

        // Now, fileInfoArray contains an array of file details for each CID
        console.log(fileInfoArray);
        setFileDetails(fileInfoArray)
      };

      // Call the function to retrieve file details for each CID
      retrieveFileInfoForCids();
      console.log(fileDetails)
      const images = str_array.map((item, i) => {
        return (
          <a href={`https://gateway.lighthouse.storage/ipfs/${item.cid}`} key={i} target="_blank">
            {/* <Image
              key={i}
              src={icon}
              alt="new"
              className="bg-white"
            /> */}
            <div className="flex justify-center items-center ">
              <span className="bg-[#8364E2] hover:shadow-xl hover:bg-purple-700 rounded-md p-5 font-semibold text-white w-20">
                <svg className="fill-white" xmlns="http://www.w3.org/2000/svg" height="30" width="30" viewBox="0 0 384 512"><path d="M64 464c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16H224v80c0 17.7 14.3 32 32 32h80V448c0 8.8-7.2 16-16 16H64zM64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V154.5c0-17-6.7-33.3-18.7-45.3L274.7 18.7C262.7 6.7 246.5 0 229.5 0H64zm56 256c-13.3 0-24 10.7-24 24s10.7 24 24 24H264c13.3 0 24-10.7 24-24s-10.7-24-24-24H120zm0 96c-13.3 0-24 10.7-24 24s10.7 24 24 24H264c13.3 0 24-10.7 24-24s-10.7-24-24-24H120z" /></svg>
                <span>{`File ${i + 1}`}</span>

              </span>
            </div>
            <span>{item.fileName}</span>
            <span>{item.mimeType}</span>
          </a>
        );
      });
      setData(images);
    } else {
      alert("No image to display");
    }
  };
  return (
    <>
      <div className="p-5 justify-center flex items-center">{data}</div>
      <input
        type="text"
        placeholder="Enter Address"
        className="address"
      ></input>
      <div className="flex justify-center items-center">
        <button className="center button" onClick={getdata}>
          Get Data
        </button>
      </div>
    </>
  );
};
export default Display;
