import React from "react";
import { CollapsibleText } from "./CollapsibleText";

function Footer() {
  return (
    <div className="fixed-bottom text-footer text-center fs-6 bg-dark bg-opacity-75 rad-gradient">
      <CollapsibleText triggerText="Credits" className="m-0">
        <p className="text-footer fw-bold m-0">- Weather backgrounds designed by me -</p>
        <p className="text-footer m-0">
          Home bg:{" "}
          <a className="text-footer" href="https://www.instagram.com/jonadinges/" target="_blank">
            Jona Dinges
          </a>{" "}
          ! Weather icons:{" "}
          <a className="text-footer" href="https://www.flaticon.com/authors/freepik" target="_blank">
            Freepik
          </a>
        </p>
      </CollapsibleText>
    </div>
  );
}

export { Footer };
