import './App.css';
import React, { Component } from "react";
import DTube from "../abis/DTube.json";
import Web3 from "web3";
import Navbar from './Navbar';
import Footer from './Footer';
import ShareVideo from './share_video';
import ShareImage from './share_image';
import { Web3Storage } from "web3.storage";
// import 'dotenv/config';

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDliN2QyODQ5REIyOWNBMTZhRDYxMWFFZWY3ODE2MDhFZjkwRTdlNDMiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjQzNTg4NzcxODUsIm5hbWUiOiJ0b2tlbjEifQ.8iyZik4cuG60jFOTy04jn22PqiF7lu_wfVlhrhQWXC0";
// const token = process.env.IPFS_WEB3_API_TOKEN;
const client = new Web3Storage({token});  

class App extends Component {
  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.request({
        method: "eth_requestAccounts",
      });
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
      // this.setState({ loading: false });
    } else {
      window.alert("请安装MetaMask！")
      // this.setState({ loading: false });
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3;
    // Load account
    const accounts = await web3.eth.getAccounts();
    this.setState({account: accounts[0]});
    // Network ID
    const networkId = await web3.eth.net.getId();
    // 部署新的合约后需要改这里!!!!
    const dtube = new web3.eth.Contract(DTube.abi, "0xb7CC15bf4Ae2cE8C4E4935bEEf4bf2dA4D2ea0F1");
    this.setState({ dtube });
    const videosCount = await dtube.methods.videoCount().call();
    const imagesCount = await dtube.methods.imageCount().call();
    this.setState({ videosCount });
    this.setState({ imagesCount });
    // Load videos, sort by newest
    for (var i = videosCount; i >= 1; i--) {
      const video = await dtube.methods.videos(i).call();
      this.setState({
        videos: [...this.state.videos, video],
      });
    }
    // Load images, sort by newest
    for (var i = imagesCount; i >= 1; i--) {
      const image = await dtube.methods.images(i).call();
      this.setState({
        images: [...this.state.images, image],
      })
    }
    // Set latest video with title to view as default
    const latestVideo = await dtube.methods.videos(videosCount).call();
    this.setState({
      currentVideoHash: latestVideo.videoIpfsHash,
      currentVideoTitle: latestVideo.title,
      currentVideoAuthor: latestVideo.author,
    });
    // Set latest image with title to view as default
    const latestImage = await dtube.methods.images(imagesCount).call();
    this.setState({
      currentImageHash: latestImage.imageIpfsHash,
      currentImageTitle: latestImage.title,
      currentImageAuthor: latestImage.author,
    })

    this.setState({ loading: false });
    // if (networkData) {
    //   const dtube = new web3.eth.Contract(DTube.abi, networkData.address);
    //   this.setState({ dtube });
    //   const videosCount = await dtube.methods.videoCount().call();
    //   this.setState({ videosCount });
    //   // Load videos, sort by newest
    //   for (var i = videosCount; i >= 1; i--) {
    //     const video = await dtube.methods.videos(i).call();
    //     this.setState({
    //       videos: [...this.state.videos, video],
    //     });
    //   }
    //   // Set latest video with title to view as default
    //   const latest = await dtube.methods.videos(videosCount).call();
    //   this.setState({
    //     currentHash: latest.videoIpfsHash,
    //     currentTitle: latest.title,
    //   });
    //   this.setState({ loading: false });
    // } else {
    //   window.alert("DTube contract not deployed to detected network.")
    // }
  }

  captureFile = (event) => {
    event.preventDefault();
    const file = document.querySelector('input[type="file"]')
    return this.setState({ file: file });
  };

  async uploadVideo(title) {
    console.log("Submitting file to IPFS...");
    const videoFile = this.state.file;
    // adding file to the IPFS
    const cid = await client.put(videoFile.files, {wrapWithDirectory: false});
    this.setState({ loading: true });
    this.state.dtube.methods
      .uploadVideo(cid, title)
      .send({ from: this.state.account })
      .on("transactionHash", (hash) => {
        this.setState({ loading: false });
      });
  }

  async uploadImage(title) {
    const imageFile = this.state.file;
    const cid = await client.put(imageFile.files, {wrapWithDirectory: false});
    this.setState({ loading: true });
    this.state.dtube.methods
      .uploadImage(cid, title)
      .send({ from: this.state.account })
      .on("transactionHash", (hash) => {
        this.setState({ loading: false });
      })
  }

  async sendEthToAuthor(author, amount) {
    this.setState({ loading: true });
    this.state.dtube.methods
      .sendEthToAuthor(author)
      .send({from: this.state.account, value: amount})
      .on("transactionHash", (hash) => {
        this.setState({ loading: false });
      })
  }

  changeVideo = (hash, title, author) => {
    this.setState({ currentVideoHash: hash });
    this.setState({ currentVideoTitle: title });
    this.setState({ currentVideoAuthor: author});
  }

  changeImage = (hash, title, author) => {
    this.setState({ currentImageHash: hash });
    this.setState({ currentImageTitle: title });
    this.setState({ currentImageAuthor: author});
  }

  showSubTap = (name) => {
    this.setState({subTab: name});
  }

  subTapComponent = () => {
    switch(this.state.subTab) {
      case 'image': return <ShareImage 
                              images={this.state.images}
                              account={this.state.account}
                              uploadImage={this.uploadImage}
                              captureFile={this.captureFile}
                              changeImage={this.changeImage}
                              currentImageHash={this.state.currentImageHash}
                              currentImageTitle={this.state.currentImageTitle}
                              currentImageAuthor={this.state.currentImageAuthor}
                              sendEthToAuthor={this.sendEthToAuthor}
                              />
      case 'video': return <ShareVideo
                              videos={this.state.videos}
                              account={this.state.account}
                              uploadVideo={this.uploadVideo}
                              captureFile={this.captureFile}
                              changeVideo={this.changeVideo}
                              currentVideoHash={this.state.currentVideoHash}
                              currentVideoTitle={this.state.currentVideoTitle}
                              currentVideoAuthor={this.state.currentVideoAuthor}
                              sendEthToAuthor={this.sendEthToAuthor}
                              />
      default: return <ShareImage 
                        images={this.state.images}
                        account={this.state.account}
                        uploadImage={this.uploadImage}
                        captureFile={this.captureFile}
                        changeImage={this.changeImage}
                        currentImageHash={this.state.currentImageHash}
                        currentImageTitle={this.state.currentImageTitle}
                        currentImageAuthor={this.state.currentImageAuthor}
                        sendEthToAuthor={this.sendEthToAuthor}
                        />
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      file: null,
      account: "",
      dtube: null,
      loading: true,

      videos: [],
      currentVideoHash: null,
      currentVideoTitle: null,
      currentVideoAuthor: null,

      images: [],
      currentImageHash: null,
      currentImageTitle: null,
      currentImageAuthor: null,

      subTab: "",
    };

    this.uploadVideo = this.uploadVideo.bind(this);
    this.uploadImage = this.uploadImage.bind(this);

    this.captureFile = this.captureFile.bind(this);

    this.changeVideo = this.changeVideo.bind(this);
    this.changeImage = this.changeImage.bind(this);

    this.sendEthToAuthor = this.sendEthToAuthor.bind(this);

    this.showSubTap = this.showSubTap.bind(this);

  }

  render() {
    return (
      <div>
        <Navbar 
          account={this.state.account}
          showSubTap={this.showSubTap}
         />
        
        {this.state.loading ? (
          <div>
            <br></br>
            &nbsp;
            <br></br>
            <br></br>
            <p>Loading...</p>
            <a href='https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn'>请安装MetaMask!</a>
          </div>
        ) : (
          <>
            {this.subTapComponent()}
            <Footer />
          </>
        )}
      </div>
    )
  }
}

export default App;
