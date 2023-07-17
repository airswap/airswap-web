# Contributing

Thank you for your interest in contributing to the AirSwap web app! We welcome contributions no matter their size.

## Issues

While we use GitHub for issue tracking and project management, development is generally coordinated on the [Discord server](https://chat.airswap.io/), which you should join to learn more about how and where to contribute.

## Key libraries

- [Craco](https://www.npmjs.com/package/@craco/craco) (Create React App Configuration Override)
- [AirSwap protocols](https://github.com/airswap/airswap-protocols)
- [ethers](https://docs.ethers.io/)
- [Redux](https://redux-toolkit.js.org/)
- [Styled components](https://www.npmjs.com/package/styled-components)

## Code Style

When multiple people are working on the same body of code, it is important that everyone conforms to a style. We use a linter for code style, which you can use with a simple command.

```
$ yarn lint
```

For code formatting we use [prettier](https://www.npmjs.com/package/prettier). This will be run after you commit your code but can also be run manually. 

```
$ yarn prettier
```

## Styled components

We use styled-components for styling. When styling a component put your scss in a separate *.styles.tsx file in the `src/component` folder. We also have a `src/styled-components` folder purely for components only meant for styling.

We define dimensions using `rem` based on 16px, so use units like `0.125rem`, `0.25rem`, etc.

The order of css properties should be based on matter of importance it has on the box-model. For instance these properties are sorted by their importance: `display`, `position`, `margin`, `border`, `width`, `padding`, `line-height`, `font-size`, `z-index`, `background`. This could be a little arbitrary so we're not very strict about this. 
## React components

When making a new component please take a look at the current components to get an idea what style we are using. Here's an example of the interface of a simple component:

```typescript
interface CheckboxProps {
  hideLabel?: boolean;
  label: string;
  subLabel?: string;
  onChange: (isChecked: boolean) => void;
  className?: string;
}
```

For naming conventions please refer to [this article of David Linau](https://dlinau.wordpress.com/2016/02/22/how-to-name-props-for-react-components/).
The order of properties are as following: first we have modifiers (ie: `isActive`, `hideLabel`), then other data properties (ie: `items`, `label`), then event handlers (ie: `onClick`, `onChange`) and finally the `className?` which every components needs to have so it can be styled by it's parent.

## Redux

We use [redux toolkit](https://redux-toolkit.js.org) for store management. Use [createAsyncThunk](https://redux-toolkit.js.org/api/createAsyncThunk) for all asynchronous actions. Errors should be transformed to `AppError`, processed in the action and saved in the store. An example:

```typescript
const UsersComponent = () => {
  const { user, isLoading, error } = useSelector((state) => state.users)
  const dispatch = useDispatch()

  const fetchUser = (userId) => {
    dispatch(fetchUserById(userId));
  }

  // render UI here
}
```

```typescript
const fetchUserById = createAsyncThunk (
  'users/fetchByIdStatus',
  async (userId: string, { dispatch }) => {
    const user = await userAPI.fetchById(userId);

    if (isAppError(user)) {
      dispatch(setStatus("failed"));
      dispatch(setError(user));
      showToast('failed fetching user');
      return;
    }

    dispatch(setStatus("success"));
    dispatch(setUser(user))
    showToast('success', `Fetched ${user.name}`)
  }
);
```

## Translations (POEditor)

New translations should be added manually to `public/locales/en/translation.json` first. After your PR is merged an admin will add the new translations in [POEditor](https://poeditor.com/). Everything in `public/locales` will eventually be overwritten by POEditor. If you want to help with translating please let us know.

## Pull Requests (PRs)

It’s a good idea to make PRs early on. A PR represents the start of a discussion, and doesn’t necessarily need to be the final, completed submission. Create a [draft PR](https://github.blog/2019-02-14-introducing-draft-pull-requests/) if you're looking for feedback but not ready for a final review. If the PR is in response to a GitHub issue, make sure to notate the issue as well.

Usually your PR is connected to a ticket number, so please put the ticket number (for example 101) in the description of your PR like so:

`Fixes #101`

GitHub’s documentation for working on PRs is available [here](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/about-pull-requests).

Once your PR is ready, ensure all checks are passing and request a review.
