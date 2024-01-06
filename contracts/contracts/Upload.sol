// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract Upload {
  
  struct Access {
    address user; 
    bool access; // true or false
  }
  
  struct File {
    string url;
    string fileName; 
    string fileSize;   
    uint views;
    uint downloads;
    string emailAddress;
  }
  
  mapping(address => File[]) private files;
  mapping(address => mapping(address => bool)) private ownership;
  mapping(address => Access[]) private accessList;
  mapping(address => mapping(address => bool)) private previousData;

  function uploadFile(string memory _url, string memory _fileName, string memory _fileSize, string memory _emailAddress) external {
    files[msg.sender].push(File({
      url: _url,
      fileName: _fileName,
      fileSize: _fileSize,
      views: 0,
      downloads: 0,
      emailAddress: _emailAddress
    }));
  }

  
  function addView(address _user, uint _fileIndex) external {
    require(_user == msg.sender || ownership[msg.sender][_user], "You don't have access");
    files[_user][_fileIndex].views++;
  }
  
  function addDownload(address _user, uint _fileIndex) external {
    require(_user == msg.sender || ownership[msg.sender][_user], "You don't have access");
    files[_user][_fileIndex].downloads++;
  }

  function allow(address user) external {//def
      ownership[msg.sender][user]=true; 
      if(previousData[msg.sender][user]){
         for(uint i=0;i<accessList[msg.sender].length;i++){
             if(accessList[msg.sender][i].user==user){
                  accessList[msg.sender][i].access=true; 
             }
         }
      }else{
          accessList[msg.sender].push(Access(user,true));  
          previousData[msg.sender][user]=true;  
      }
    
  }

  function disallow(address user) public{
      ownership[msg.sender][user]=false;
      for(uint i=0;i<accessList[msg.sender].length;i++){
          if(accessList[msg.sender][i].user==user){ 
              accessList[msg.sender][i].access=false;  
          }
      }
  }

  function display(address _user) external view returns (File[] memory) {
    require(_user == msg.sender || ownership[_user][msg.sender], "You don't have access");
    return getFiles(_user);
  }


  function getFiles(address _user) internal view returns (File[] memory) {
    return files[_user];
  }

  function shareAccess() external view returns (Access[] memory) {
    return accessList[msg.sender];
  }
}
