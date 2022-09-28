import React from "react";
import "./App.css";

export default function Footer() {
    return (
        <div className="footer bg-white shadow">
            <section className="content-container">
                <div className="text-center p-5">
                    <a 
                        href="https://github.com/gstarkg?tab=repositories"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        GitHub repository
                    </a>
                    <br />
                    <br />
                    <span className="text-secondary">
                        <i>
                            分享你的视频
                        </i>
                    </span>
                </div>
            </section>
        </div>
    )
}