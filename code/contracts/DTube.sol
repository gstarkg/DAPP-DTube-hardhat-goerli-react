// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract DTube {
    uint256 public videoCount = 0;
    uint256 public imageCount = 0;
    string public name = "DTube";
    mapping(uint256 => Video) public videos;
    mapping(uint256 => Image) public images;

    struct Video {
        uint256 id;
        string videoIpfsHash;
        string title;
        address author;
    }

    struct Image {
        uint256 id;
        string imageIpfsHash;
        string title;
        address author;
    }

    event VideoUploaded(
        uint256 id,
        string videoIpfsHash,
        string title,
        address author
    );

    event ImageUploaded(
        uint256 id,
        string imageIpfsHash,
        string title,
        address author
    );

    event SendEthToAuthor(address receiver, address sender, uint256 amount);

    constructor() public {}

    function uploadVideo(string memory _videoIpfsHash, string memory _title)
        public
    {
        require(bytes(_videoIpfsHash).length > 0);
        require(bytes(_title).length > 0);
        require(msg.sender != address(0));

        videoCount++;
        videos[videoCount] = Video(
            videoCount,
            _videoIpfsHash,
            _title,
            msg.sender
        );

        emit VideoUploaded(videoCount, _videoIpfsHash, _title, msg.sender);
    }

    function uploadImage(string memory _imageIpfsHash, string memory _title)
        public
    {
        require(bytes(_imageIpfsHash).length > 0);
        require(bytes(_title).length > 0);
        require(msg.sender != address(0));

        imageCount++;
        images[imageCount] = Image(
            imageCount,
            _imageIpfsHash,
            _title,
            msg.sender
        );

        emit ImageUploaded(imageCount, _imageIpfsHash, _title, msg.sender);
    }

    // sendEthToAuthor() 向作品的作者发送指定eth
    function sendEthToAuthor(address payable _to) public payable {
        require(_to != address(0));

        _to.transfer(msg.value);

        emit SendEthToAuthor(_to, msg.sender, msg.value);
    }
}
