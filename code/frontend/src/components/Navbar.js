import React, { Component } from "react";
import Identicon from "identicon.js";
import dtube from "./dtube.png";

class Navbar extends Component {
    render() {
        return (
            <nav className="navbar navbar-dark fixed-top bg-white flex-md-nowrap p-1 shadow font-monospace">
                <div>
                    <li onClick={() => this.props.showSubTap("image")}>image</li>
                    <li onClick={() => this.props.showSubTap("video")}>video</li>
                </div>

                <div className="px-5">
                    <a 
                        className="navbar-brand col-sm-3 col-md-2 mr-0" 
                        href="/" 
                        rel="noopener noreferrer">
                            <img 
                                src={dtube}
                                width="30" 
                                height="30" 
                                className="d-inline-block align-top" 
                                alt="DTube logo" 
                                />
                    </a>
                    <small id="account">{this.props.account}</small>
                </div>
                <ul className="navbar-nav px-5">
                    <li className="nav-item text-nowrap h5 d-none d-sm-none d-sm-block">
                        <small className="text-secondary px-1">
                            <small id="account">{this.props.account}</small>
                        </small>
                        {this.props.account ? (
                            <img 
                                className="ml-2"
                                width="30"
                                height="30"
                                src={`data:image/png;base64,${new Identicon(
                                    this.props.account,
                                    30
                                ).toString()}`}
                                />
                        ) : (<span></span>)}
                    </li>
                </ul>
            </nav>
        )
    }
}

export default Navbar;