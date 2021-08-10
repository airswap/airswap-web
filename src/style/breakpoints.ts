const sizes = {
  tinyScreen: "320px",
  phone: "480px",
  tabletPortrait: "768px",
  tabletLandscape: "1024px",
  desktop: "1448px",
  bigDesktop: "1800px",
};

const breakPoints = {
  tinyScreenOnly: `(max-width: ${sizes.tinyScreen})`,
  phoneOnly: `(max-width: ${sizes.phone})`,
  tabletPortraitUp: `(min-width: ${sizes.tabletPortrait})`,
  tabletLandscapeUp: `(min-width: ${sizes.tabletLandscape})`,
  desktopUp: `(min-width: ${sizes.desktop})`,
  bigDesktopUp: `(min-width: ${sizes.bigDesktop})`,
};

export default breakPoints;
