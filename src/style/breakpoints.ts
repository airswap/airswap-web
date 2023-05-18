export const breakpointSizes = {
  tinyScreen: "320px",
  phone: "480px",
  phoneLandscape: "400px",
  tabletPortrait: "768px",
  tabletLandscape: "1024px",
  desktop: "1448px",
  bigDesktop: "1800px",
};

const breakPoints = {
  tinyScreenOnly: `(max-width: ${breakpointSizes.tinyScreen})`,
  phoneOnly: `(max-width: ${breakpointSizes.phone})`,
  phoneLandscape: `(orientation: landscape) and (max-height: ${breakpointSizes.phoneLandscape})`,
  shallowScreenOnly: `(max-width: 1430px) and (max-height: 664px)`,
  tabletPortraitUp: `(min-width: ${breakpointSizes.tabletPortrait})`,
  tabletLandscapeUp: `(min-width: ${breakpointSizes.tabletLandscape})`,
  desktopUp: `(min-width: ${breakpointSizes.desktop})`,
  bigDesktopUp: `(min-width: ${breakpointSizes.bigDesktop})`,
};

export default breakPoints;
