import { FC } from "react";
import {CommitButton, Container, GithubButton} from "./CommitHash.styles";
import Icon from "../../../Icon/Icon";

const githubLink = "https://github.com/airswap/airswap-web";
const commitHash = process.env.BUILD_VERSION;
const commitDate = process.env.BUILD_DATE;
const commitReadableHash = (commitHash || '').substr(0, 6);
const commitReadableDate = (commitDate || '').substr(0, 10);
const commitLink = `${githubLink}/commit/${commitHash}`

const CommitHash: FC = () => {
  return (
    <Container>
      <GithubButton
        target="_blank"
        to={githubLink}
      >
        <Icon name="github" />
      </GithubButton>
      {commitHash && (
        <CommitButton
          target="_blank"
          to={commitLink}
        >
          {commitReadableHash}
        </CommitButton>
      )}
      {commitDate && (
        <CommitButton
          target="_blank"
          to={commitLink}
        >
          {commitReadableDate}
        </CommitButton>
      )}
    </Container>
  );
};

export default CommitHash;
