import React, { Component } from "react";
import "./App.css";
import Web3 from "web3";

class ShareImage extends Component {
    render() {
        return (
            <div className="container-fluid font-monospace main p-2">
                <br></br>
                &nbsp;
                <br></br>
                <br></br>

                <div className="row">
                    <div className="col-md-10">
                        <div 
                            className="ratio ratio-16x9" 
                            style={{maxHeight: "720px"}}
                        >
                            <img 
                                src={`https://w3s.link/ipfs/${this.props.currentImageHash}`} 
                                controls
                            ></img>
                        </div>
                        <div className="ml-3 ml-5">
                            <h3>
                                <b>
                                    <i className="video-title">{this.props.currentImageTitle}</i>
                                </b>
                            </h3>
                            <div className="mt-3">
                                <p>
                                    IPFS CID:{" "}
                                    <span className="text-secondary">
                                        {this.props.currentImageHash}
                                    </span>
                                </p>
                                <p>
                                    Share IPFS URL:{" "}
                                    <a href={`https://w3s.link/ipfs/${this.props.currentImageHash}`}
                                        target="_blank"
                                        rel="nooperner noreferrer"
                                        >{`https://w3s.link/ipfs/${this.props.currentImageHash}`}</a>
                                </p>
                                <form
                                    onSubmit={(event) => {
                                        event.preventDefault();
                                        this.props.sendEthToAuthor(
                                            this.props.currentImageAuthor, 
                                            Web3.utils.toWei(this.sendEthToAuthorInput.value, 'ether')
                                        );
                                    }}
                                >
                                    <input 
                                        id="sendEthToAuthorInput" 
                                        type="text" 
                                        ref={(input) => {
                                            this.sendEthToAuthorInput = input;
                                        }}
                                        placeholder="转账金额 ETH"></input>
                                    <button className="btn border border-dark btn-primary btn-block btn-sm">
                                            发送
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                    
                    <div 
                        className="col-md-2 border border-secondary overflow-auto text-center" 
                        style={{maxHeight:"1400px", minWidth:"175px"}}
                        >
                            <h5 className="feed-title">
                                <b>Image Feed</b>
                            </h5>
                            <br></br>
                            <form
                                onSubmit={(event) => {
                                    event.preventDefault();
                                    const title = this.imageTitle.value;
                                    this.props.uploadImage(title);
                                }}
                            >
                                &nbsp;
                                <input
                                    type="file"
                                    ref="fileUpload"
                                    accept=".webp, .bmp, .jpg, .png, .tif .gif .gpeg"
                                    onChange={this.props.captureFile}
                                    style={{width: "250px"}} 
                                />
                                <br></br>
                                <div className="form-group mr-sm-2">
                                    <input
                                        id="imageTitle"
                                        type="text"
                                        ref={(input) => {
                                            this.imageTitle = input;
                                        }}
                                        className="form-control-sm mt-3 mr-3"
                                        placeholder="请输入图片名字"
                                        required
                                    />
                                </div>
                                <br></br>
                                <button
                                    type="submit"
                                    className="btn border border-dark btn-primary btn-block btn-sm"
                                >
                                    Upload
                                </button>
                                <br></br>
                                &nbsp;
                            </form>

                            {this.props.images.map((image, key) => {
                                return (
                                    <div
                                        className="card mb-4 text-center bg-secondary mx-auto"
                                        style={{width: "250px", height: "175px"}}
                                        key={key}
                                    >
                                        <div className="card-title bg-dark">
                                            <small className="text-white">
                                                <b>{image.title}</b>
                                            </small>
                                        </div>
                                        <div>
                                            <p onClick={() => this.props.changeImage(image.imageIpfsHash, image.title)}>
                                                <img
                                                    src={`https://w3s.link/ipfs/${image.imageIpfsHash}`}
                                                    style={{ width: "200px", height: "110px"}} 
                                                />
                                            </p>
                                        </div>
                                    </div>
                                )
                            })}
                    </div>
                </div>
                
            </div>
        )
    }
}

export default ShareImage;