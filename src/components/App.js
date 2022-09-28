import './App.css';
import React, { Component } from "react";
import DTube from "../abis/DTube.json";
import Web3 from "web3";
import Navbar from './Navbar';
import Footer from './Footer';
import Main from './Main';
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
    } else {
      window.alert("请安装MetaMask！")
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3;
    // Load account
    const accounts = await web3.eth.getAccounts();
    this.setState({account: accounts[0]});
    // Network ID
    const networkId = await web3.eth.net.getId();
    const dtube = new web3.eth.Contract(DTube.abi, "0x9F4aba259F3d188401eD777b7Ec806EaB2ad0C73");
      this.setState({ dtube });
      const videosCount = await dtube.methods.videoCount().call();
      this.setState({ videosCount });
      // Load videos, sort by newest
      for (var i = videosCount; i >= 1; i--) {
        const video = await dtube.methods.videos(i).call();
        this.setState({
          videos: [...this.state.videos, video],
        });
      }
      // Set latest video with title to view as default
      const latest = await dtube.methods.videos(videosCount).call();
      this.setState({
        currentHash: latest.videoIpfsHash,
        currentTitle: latest.title,
      });
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
    this.setState({ loading: true});
    this.state.dtube.methods
      .uploadVideo(cid, title)
      .send({ from: this.state.account })
      .on("transactionHash", (hash) => {
        this.setState({ loading: false });
      });
  }

  changeVideo = (hash, title) => {
    this.setState({currentHash: hash});
    this.setState({currentTitle: title});
  }

  constructor(props) {
    super(props);
    this.state = {
      file: null,
      account: "",
      dtube: null,
      videos: [],
      loading: true,
      currentHash: null,
      currentTitle: null,
    };

    this.uploadVideo = this.uploadVideo.bind(this);
    this.captureFile = this.captureFile.bind(this);
    this.changeVideo = this.changeVideo.bind(this);

  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        {this.state.loading ? (
          <div>
            <p>Loading...</p>
          </div>
        ) : (
          <>
            <Main
              videos={this.state.videos}
              account={this.state.account}
              uploadVideo={this.uploadVideo}
              captureFile={this.captureFile}
              changeVideo={this.changeVideo}
              currentHash={this.state.currentHash}
              currentTitle={this.state.currentTitle}
             />
            <Footer />
          </>
        )}
      </div>
    )
  }
}

export default App;
