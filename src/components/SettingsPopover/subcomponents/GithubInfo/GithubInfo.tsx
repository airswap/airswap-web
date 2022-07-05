import { FC } from "react";
import { useTranslation } from "react-i18next";

import Icon from "../../../Icon/Icon";
import { CommitButton, Container, GithubButton } from "./GithubInfo.styles";

const githubLink = "https://github.com/airswap/airswap-web";
const githubLastCommitId = process.env.BUILD_VERSION;
const commitDate = process.env.BUILD_DATE;
const readableCommitId = githubLastCommitId
  ? githubLastCommitId.substr(0, 6)
  : undefined;
const readableCommitDate = commitDate ? commitDate.substr(0, 10) : undefined;
const commitLink = `${githubLink}/commit/${githubLastCommitId}`;

const GithubInfo: FC = () => {
  const { t } = useTranslation();

  return (
    <Container>
      <GithubButton target="_blank" aria-label="github" href={githubLink}>
        <Icon name="github" />
      </GithubButton>
      {githubLastCommitId && (
        <CommitButton
          target="_blank"
          aria-label={t("wallet.latestGithubCommit")}
          href={commitLink}
        >
          {readableCommitId}
        </CommitButton>
      )}
      {commitDate && (
        <CommitButton
          target="_blank"
          aria-label={t("wallet.latestGithubCommit")}
          href={commitLink}
        >
          {readableCommitDate}
        </CommitButton>
      )}
    </Container>
  );
};

export default GithubInfo;
