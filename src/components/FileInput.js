import React, { useState } from "react";
import styled from "styled-components";
import Dropzone from "react-dropzone";
import { List, ListItem } from "cobra-ui";

// processFiles adds the base64 payload into the file data
const processFiles = files =>
  new Promise(resolve => {
    const processedFiles = [];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (f => event => {
        processedFiles.push({
          name: encodeURIComponent(f.name),
          payload: event.target.result.split(",")[1]
        });
        if (processedFiles.length === files.length) resolve(processedFiles);
      })(file);
      reader.readAsDataURL(file);
    });
  });

const FilesList = ({ files, onRemoveFile }) => (
  <List style={{ width: "100%" }}>
    {files.map((file, i) => (
      <ListItem
        style={{
          display: "flex",
          justifyContent: "space-between"
        }}
        key={`file-item-${i}`}
      >
        <span style={{ textAlign: "left" }}>{decodeURIComponent(file.name)}</span>
        <div>
          <FileItemRemove
            className="material-icons"
            onClick={() => onRemoveFile(i)}
          >
            close
          </FileItemRemove>
        </div>
      </ListItem>
    ))}
  </List>
);

const FileInput = ({ files, setFiles, multiple = true }) => {
  const [processing, setProcessing] = useState(false);
  return (
    <FileInputWrapper>
      <Dropzone
        multiple={multiple}
        style={DropZoneStyle}
        acceptStyle={DropZoneAcceptStyle}
        disabled={processing}
        disableClick={processing}
        onDrop={(accFiles, _rejFiles) => {
          setProcessing(true);
          processFiles(accFiles).then(processedFiles => {
            setProcessing(false);
            setFiles([...files, ...processedFiles]);
          });
        }}
      >
        <span>
          {!processing
            ? "Drop your files here or click to select them"
            : "Processing your files..."}
        </span>
      </Dropzone>
      <FilesList
        files={files}
        onRemoveFile={idx => setFiles(files.filter((_f, i) => i !== idx))}
      />
    </FileInputWrapper>
  );
};

const FileInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const FileItemRemove = styled.i`
  font-size: 11px;
  color: red;
  cursor: pointer;
  margin-left: 5px;
`;

const DropZoneAcceptStyle = {
  border: "1px solid green",
  background: "lightgreen"
};

const DropZoneStyle = {
  border: "1px dashed gray",
  width: "200px",
  padding: "10px",
  height: "100px",
  display: "flex",
  borderRadius: "2px",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer"
};

export default FileInput;
