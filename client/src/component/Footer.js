import React, { useState } from "react";

function MyFooter({ input, setInput, output, activeTab, handleTabClick }) {
	return (
		<div style={{ height: "100%", width: "100%" }} className="p-0 m-0">
			<ul className="nav nav-tabs">
				<li className="nav-item">
					<a
						className={`nav-link ${activeTab === "input" ? "active" : ""}`}
						onClick={() => handleTabClick("input")}
						href="#"
						style={{ color: `${activeTab === "input" ? "black" : "white"}` }}
					>
						Input
					</a>
				</li>
				<li className="nav-item">
					<a
						className={`nav-link ${activeTab === "output" ? "active" : ""}`}
						onClick={() => handleTabClick("output")}
						href="#"
						style={{ color: `${activeTab === "output" ? "black" : "white"}` }}
					>
						Output
					</a>
				</li>
			</ul>
			<div style={{ height: "85%", width: "100%" }} className="tab-content">
				<div
					style={{ height: "100%", width: "100%" }}
					className={`tab-pane fade ${
						activeTab === "input" ? "show active" : ""
					}`}
				>
					<div style={{ height: "100%", width: "100%" }}>
						<textarea
							placeholder="Enter Input Here "
							style={{
								height: "100%",
								width: "100%",
								background: "black",
								color: "white",
							}}
							value={input}
							onChange={(e) => setInput(e.target.value)}
						></textarea>
					</div>
				</div>
				<div
					style={{ height: "100%", width: "100%" }}
					className={`tab-pane fade ${
						activeTab === "output" ? "show active" : ""
					}`}
				>
					<div style={{ height: "100%", width: "100%" }}>
						<textarea
							style={{
								height: "100%",
								width: "100%",
								background: "black",
								color: "white",
							}}
							readOnly
							value={output}
						></textarea>
					</div>
				</div>
			</div>
		</div>
	);
}

export default MyFooter;
