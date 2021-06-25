import { Story, Meta } from "@storybook/react";

import WalletProviderList, {
  WalletProviderListProps,
} from "./WalletProviderList";

export default {
  title: "components/Wallet/WalletProviderList",
  component: WalletProviderList,
} as Meta;

const Template: Story<WalletProviderListProps> = (args) => (
  <WalletProviderList {...args} onProviderSelected={() => {}} />
);

export const Standard = Template.bind({});
Standard.args = {};
