import React, { Component } from "react";
import "./App.css";

class ShareVideo extends Component {
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
                            <video 
                                src={`https://w3s.link/ipfs/${this.props.currentVideoHash}`} 
                                controls
                            ></video>
                        </div>
                        <div className="ml-3 ml-5">
                            <h3>
                                <b>
                                    <i className="video-title">{this.props.currentVideoTitle}</i>
                                </b>
                            </h3>
                            <div className="mt-3">
                                <p>
                                    IPFS CID:{" "}
                                    <span className="text-secondary">
                                        {this.props.currentVideoHash}
                                    </span>
                                </p>
                                <p>
                                    Share IPFS URL:{" "}
                                    <a href={`https://w3s.link/ipfs/${this.props.currentVideoHash}`}
                                        target="_blank"
                                        rel="nooperner noreferrer"
                                        >{`https://w3s.link/ipfs/${this.props.currentVideoHash}`}</a>
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div 
                        className="col-md-2 border border-secondary overflow-auto text-center" 
                        style={{maxHeight:"1400px", minWidth:"175px"}}
                        >
                            <h5 className="feed-title">
                                <b>Video Feed</b>
                            </h5>
                            <br></br>
                            <form
                                onSubmit={(event) => {
                                    event.preventDefault();
                                    const title = this.videoTitle.value;
                                    this.props.uploadVideo(title);
                                }}
                            >
                                &nbsp;
                                <input
                                    type="file"
                                    ref="fileUpload"
                                    accept=".mp4, .mov, .mkv, .ogg, .wmv"
                                    onChange={this.props.captureFile}
                                    style={{width: "250px"}} 
                                />
                                <br></br>
                                <div className="form-group mr-sm-2">
                                    <input
                                        id="videoTitle"
                                        type="text"
                                        ref={(input) => {
                                            this.videoTitle = input;
                                        }}
                                        className="form-control-sm mt-3 mr-3"
                                        placeholder="请输入视频名字"
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

                            {this.props.videos.map((video, key) => {
                                return (
                                    <div
                                        className="card mb-4 text-center bg-secondary mx-auto"
                                        style={{width: "250px", height: "175px"}}
                                        key={key}
                                    >
                                        <div className="card-title bg-dark">
                                            <small className="text-white">
                                                <b>{video.title}</b>
                                            </small>
                                        </div>
                                        <div>
                                            <p onClick={() => this.props.changeVideo(video.videoIpfsHash, video.title)}>
                                                <video
                                                    src={`https://w3s.link/ipfs/${video.videoIpfsHash}`}
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

export default ShareVideo;