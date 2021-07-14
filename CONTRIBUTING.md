# Contributing

Thank you for your interest in contributing to the AirSwap web app! We welcome contributions no matter their size.

## Issues

While we use GitHub for issue tracking and project management, development is generally coordinated on the [Discord server](https://chat.airswap.io/), which you should join to learn more about how and where to contribute.

## Setup

First fork the `airswap-web` repository and then clone the project and install dependencies.

```
$ git clone https://github.com/<YOUR-GITHUB-USER>/airswap-web
$ cd airswap-web
$ yarn
```

## Code Style

When multiple people are working on the same body of code, it is important that everyone conforms to a style. We use a linter for code style, which you can use with a simple command.

```
$ yarn lint
```

## Styled components

We use styled-components for styling. When styling a component put your scss in a separate *.styles.tsx file in the component folder. When styling children give them a className, don't turn them into a styled component.

## Pull Requests (PRs)

It’s a good idea to make PRs early on. A PR represents the start of a discussion, and doesn’t necessarily need to be the final, completed submission. Create a [draft PR](https://github.blog/2019-02-14-introducing-draft-pull-requests/) if you're looking for feedback but not ready for a final review. If the PR is in response to a GitHub issue, make sure to notate the issue as well.

GitHub’s documentation for working on PRs is available [here](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/about-pull-requests).

Once your PR is ready, ensure all checks are passing and request a review.
