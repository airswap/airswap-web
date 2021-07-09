// import { Story, Meta } from "@storybook/react";
// import { Provider } from "react-redux";
// import TokenSelection, { TokenSelectionProps } from "./TokenSelection";
// import { store } from "../../app/store";

// export default {
//   title: "components/TokenSelection/TokenSelection",
//   component: TokenSelection,
//   argTypes: {
//     closeModal: { control: { type: "function" } },
//     signerToken: { control: { type: "text" } },
//     senderToken: { control: { type: "function" } },
//     setSignerToken: { control: { type: "boolean" } },
//     setSenderToken: { control: { type: "boolean" } },
//     tokenSelctType: { control: { type: "string" } },
//   },
// } as Meta;

// const Template: Story<TokenSelectionProps> = (args) => (
//   <Provider store={store}>
//     <TokenSelection {...args} />
//   </Provider>
// );

// export const Default = Template.bind({});
// Default.args = {
//   closeModal: () => void 1,
//   signerToken: "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2",
//   senderToken: "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2",
//   setSignerToken: () => void 1,
//   setSenderToken: () => void 1,
//   tokenSelectType: "senderToken",
// };

export {};