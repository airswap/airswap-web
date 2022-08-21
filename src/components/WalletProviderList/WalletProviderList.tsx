import React, { useState, useEffect } from "react";

import UAuth from "@uauth/js";

import { useReducedMotion } from "framer-motion";

import SUPPORTED_WALLET_PROVIDERS, {
  WalletProvider,
} from "../../constants/supportedWalletProviders";
import { overlayShowHideAnimationDuration } from "../Overlay/Overlay";
import "./Ud.css";
import { StyledWalletProviderList } from "./WalletProviderList.styles";
import WalletProviderButton from "./subcomponents/WalletProviderButton/WalletProviderButton";

export type WalletProviderListProps = {
  onProviderSelected: (provider: WalletProvider) => void;
  onClose: () => void;
  className?: string;
};

const WalletProviderList = ({
  onProviderSelected,
  onClose,
  className,
}: WalletProviderListProps) => {
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);
  const [userWallet, setUserWallet] = useState("");

  const uauth = new UAuth({
    clientID: "59c7e5a9-a907-4501-a599-7a18453a749d",
    redirectUri: "https://airswap1.netlify.app",
    scope: "openid wallet"
  });

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const showButton = () => {
    if (window.innerWidth <= 960) {
      setButton(false);
    } else {
      setButton(true);
    }
  };

  useEffect(() => {
    showButton();
  }, []);

  window.addEventListener("resize", showButton);

  //useEffect model
  useEffect(() => {
    // setUserWallet("Login With Unstoppable")
    uauth
      .user()
      .then((user) => {
        setUserWallet(user.sub);
        // user exists
        console.log("User information:", user);
      })
      .catch((err: any) => {
        console.log(err);
        // user does not exist
      });
  }, []);

  //login button
  const login = async () => {
    try {
      const authorization = await uauth.loginWithPopup();
      uauth.user().then((user) => {
        setUserWallet(user.sub);
        // user exist
        console.log("User information:", user);
      });
      console.log(authorization);
    } catch (err) {
      console.error(err);
    }
  };

  const logout = async () => {
    try {
      await uauth.logout();
      setUserWallet("");
    } catch (err) {
      console.error(err);
    }
  };

  const shouldReduceMotion = useReducedMotion();
  const onProviderButtonClick = (provider: WalletProvider) => {
    onClose();

    setTimeout(
      () => {
        onProviderSelected(provider);
      },
      shouldReduceMotion ? 0 : overlayShowHideAnimationDuration * 1000
    );
  };

  return (
    <>
      <StyledWalletProviderList className={className}>
        {SUPPORTED_WALLET_PROVIDERS.map((provider, i) => (
          <WalletProviderButton
            key={i}
            provider={provider}
            onClick={() => onProviderButtonClick(provider)}
          />
        ))}
        {userWallet ? (
          <>
            <button className="ud-btn" onClick={() => logout()}>
              {userWallet}
            </button>
          </>
        ) : (
          <button className="ud-btn" onClick={() => login()}>
            Login with Unstoppable
          </button>
        )}
      </StyledWalletProviderList>
    </>
  );
};

export default WalletProviderList;
