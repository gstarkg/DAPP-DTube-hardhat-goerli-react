// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract DTube {
    uint256 public videoCount = 0;
    string public name = "DTube";
    mapping(uint256 => Video) public videos;

    struct Video {
        uint256 id;
        string videoIpfsHash;
        string title;
        address author;
    }

    event VideoUploaded(
        uint256 id,
        string videoIpfsHash,
        string title,
        address author
    );

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
}
