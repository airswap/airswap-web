import { FC } from "react";
import { useTranslation } from "react-i18next";

import Icon from "../../../Icon/Icon";
import { CommitButton, Container, GithubButton } from "./GithubInfo.styles";

const githubLink = "https://github.com/airswap/airswap-web";
const githubInfo = process.env.BUILD_VERSION;
const commitDate = process.env.BUILD_DATE;
const commitReadableHash = githubInfo ? githubInfo.substr(0, 6) : undefined;
const commitReadableDate = commitDate ? commitDate.substr(0, 10) : undefined;
const commitLink = `${githubLink}/commit/${githubInfo}`;

const GithubInfo: FC = () => {
  const { t } = useTranslation();

  return (
    <Container>
      <GithubButton target="_blank" aria-label="github" href={githubLink}>
        <Icon name="github" />
      </GithubButton>
      {githubInfo && (
        <CommitButton
          target="_blank"
          aria-label={t("wallet.latestGithubCommit")}
          href={commitLink}
        >
          {commitReadableHash}
        </CommitButton>
      )}
      {commitDate && (
        <CommitButton
          target="_blank"
          aria-label={t("wallet.latestGithubCommit")}
          href={commitLink}
        >
          {commitReadableDate}
        </CommitButton>
      )}
    </Container>
  );
};

export default GithubInfo;
