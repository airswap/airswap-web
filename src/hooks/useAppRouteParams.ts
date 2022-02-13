import { useRouteMatch } from "react-router-dom";

import {
  DEFAULT_LOCALE,
  getUserLanguage,
  SUPPORTED_LOCALES,
  SupportedLocale,
} from "../constants/locales";
import { AppRoutes, SwapRoutes } from "../routes";

interface AppRouteParams {
  lang: SupportedLocale;
  route?: AppRoutes;
  tokenFrom?: string;
  tokenTo?: string;
  url: string;
  urlWithoutLang: string;
  justifiedBaseUrl: string;
}

function transformStringToSupportedLanguage(
  value: string
): SupportedLocale | undefined {
  const locale = value as SupportedLocale;
  if (SUPPORTED_LOCALES.includes(locale)) {
    return locale;
  }

  return undefined;
}

const useAppRouteParams = (): AppRouteParams => {
  const routeMatch = useRouteMatch<{ routeOrLang?: string }>(`/:routeOrLang`);

  const routeWithLangMatch = useRouteMatch<{
    lang: SupportedLocale;
    route?: AppRoutes;
  }>(`/:lang/:route`);

  const swapMatch = useRouteMatch<{
    route?: AppRoutes.swap;
    tokenFrom?: string;
    tokenTo?: string;
  }>(`/:route/:${SwapRoutes.tokenFrom}/:${SwapRoutes.tokenTo}`);

  const swapWithLangMatch = useRouteMatch<{
    lang: SupportedLocale;
    route?: AppRoutes.swap;
    tokenFrom?: string;
    tokenTo?: string;
  }>(`/:lang/:route/:${SwapRoutes.tokenFrom}/:${SwapRoutes.tokenTo}`);

  if (swapWithLangMatch) {
    const lang =
      transformStringToSupportedLanguage(swapWithLangMatch.params.lang) ||
      DEFAULT_LOCALE;

    return {
      lang,
      tokenFrom: swapWithLangMatch.params.tokenFrom,
      tokenTo: swapWithLangMatch.params.tokenTo,
      route: AppRoutes.swap,
      url: swapWithLangMatch.url,
      urlWithoutLang: `/${AppRoutes.swap}/${swapWithLangMatch.params.tokenFrom}/${swapWithLangMatch.params.tokenTo}/`,
      justifiedBaseUrl: `/${lang}`,
    };
  }

  if (swapMatch) {
    return {
      tokenFrom: swapMatch.params.tokenFrom,
      tokenTo: swapMatch.params.tokenTo,
      route: swapMatch.params.route,
      lang: getUserLanguage(),
      url: swapMatch.url,
      urlWithoutLang: swapMatch.url,
      justifiedBaseUrl: `/`,
    };
  }

  if (routeWithLangMatch) {
    const lang =
      transformStringToSupportedLanguage(routeWithLangMatch.params.lang) ||
      DEFAULT_LOCALE;

    return {
      lang,
      route: routeWithLangMatch.params.route,
      url: routeWithLangMatch.url,
      urlWithoutLang: `/${routeWithLangMatch.params.route}`,
      justifiedBaseUrl: `/${lang}`,
    };
  }

  if (routeMatch) {
    const { routeOrLang } = routeMatch.params;
    const lang = transformStringToSupportedLanguage(routeOrLang as string);

    return {
      route: lang ? undefined : (routeMatch.params.routeOrLang as AppRoutes),
      lang: lang || DEFAULT_LOCALE,
      url: routeMatch.url,
      urlWithoutLang: lang ? "/" : routeMatch.url,
      justifiedBaseUrl: lang ? `/${lang}` : "/",
    };
  }

  return {
    lang: getUserLanguage(),
    url: "/",
    urlWithoutLang: "/",
    justifiedBaseUrl: "/",
  };
};

export default useAppRouteParams;
