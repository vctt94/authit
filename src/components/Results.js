import React from "react";
import styled from "styled-components";
import { Link, theme, List, ListItem } from "cobra-ui";
import { CopyToClipboard } from "./CopyToClipboard";
import { ResultsData, ListItemHeader } from "./CommonComponents";
import {
  SUCCESS,
  FILE_ALREADY_EXISTS,
  FILE_DOES_NOT_EXIST,
  DISABLED
} from "../constants";
import { convertTsToStringDate } from "../helpers/dates";
import { formatDigestToDownload } from "../helpers/format";
import { DownloadFileLink } from "./DownloadFileLink";

const getHumanReadableResult = result => {
  const mapCodeToMessage = {
    [SUCCESS]: "Success",
    [FILE_ALREADY_EXISTS]: "File already existent",
    [FILE_DOES_NOT_EXIST]: "File does not exist",
    [DISABLED]: "Disabled"
  };
  return mapCodeToMessage[result] || "Invalid result";
};

export const AuthenticationResult = ({ files }) => (
  <ResultWrapper>
    <ResultLabel>Uploaded digests</ResultLabel>
    <List>
      {files.map((file, i) => (
        <ListItem key={`file-result-${i}`} style={{ flexDirection: "column" }}>
          <div style={{ display: "flex" }}>
            <ListItemHeader>File</ListItemHeader>
            <ResultsData
              onMouseEnter={el => {
                el.target.setAttribute("title", file.name);
              }}
            >
              {file.name}
            </ResultsData>
          </div>
          <div style={{ display: "flex" }}>
            <ListItemHeader>Digest</ListItemHeader>
            <ResultsData style={{ fontFamily: "monospace" }}>
              <>
                <span>{file.digest}</span>
                <CopyToClipboard text={file.digest} />
              </>
            </ResultsData>
          </div>
          <div style={{ display: "flex" }}>
            <ListItemHeader>Result</ListItemHeader>
            <ResultsData>{getHumanReadableResult(file.result)}</ResultsData>
          </div>
        </ListItem>
      ))}
    </List>
  </ResultWrapper>
);

export const VerificationResult = ({ files }) => (
  <ResultWrapper>
    <ResultLabel>Verified digests</ResultLabel>
    <List>
      {files.map(
        (
          {
            name,
            digest: {
              result,
              chaininformation: { chaintimestamp, transaction }
            }
          },
          i
        ) => (
          <ListItem style={{ flexDirection: "column" }}>
            <div style={{ display: "flex" }}>
              <ListItemHeader>Anchored Date</ListItemHeader>
              <ResultsData>
                {chaintimestamp ? convertTsToStringDate(chaintimestamp) : "-"}
              </ResultsData>
            </div>
            <div style={{ display: "flex" }}>
              <ListItemHeader>File</ListItemHeader>
              <ResultsData
                onMouseEnter={el => {
                  el.target.setAttribute("title", name);
                }}
              >
                {decodeURIComponent(name)}
              </ResultsData>
            </div>
            <div style={{ display: "flex" }}>
              <ListItemHeader>Transaction</ListItemHeader>
              <ResultsData>
                {chaintimestamp && transaction ? (
                  <>
                    <Link
                      style={{ fontFamily: "monospace" }}
                      rel="nofollow noopener noreferrer"
                      target="_blank"
                      href={`https://testnet.dcrdata.org/tx/${transaction}`}
                    >
                      {transaction}
                    </Link>
                    <CopyToClipboard text={transaction} />
                  </>
                ) : (
                  "not anchored yet"
                )}
              </ResultsData>
            </div>
            <div style={{ display: "flex" }}>
              <ListItemHeader>Download</ListItemHeader>
              <ResultsData>
                <DownloadFileLink
                  data={formatDigestToDownload({
                    name: decodeURIComponent(name),
                    transaction,
                    date: convertTsToStringDate(chaintimestamp),
                    result: files[i]
                  })}
                  filename={"digest.json"}
                >
                  click here
                </DownloadFileLink>
              </ResultsData>
            </div>
            <div style={{ display: "flex" }}>
              <ListItemHeader>Result</ListItemHeader>
              <ResultsData>{getHumanReadableResult(result)}</ResultsData>
            </div>
          </ListItem>
        )
      )}
    </List>
  </ResultWrapper>
);

const ResultWrapper = styled.div`
  padding: 20px 0;
  text-align: left;
  width: 100%;
`;

const ResultLabel = styled.span`
  font-size: 16px;
  font-weight: bold;
  color: ${theme.darkGrayColor};
`;
