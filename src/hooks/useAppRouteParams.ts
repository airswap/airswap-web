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
  langInRoute: boolean;
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
    return {
      tokenFrom: swapWithLangMatch.params.tokenFrom,
      tokenTo: swapWithLangMatch.params.tokenTo,
      route: swapWithLangMatch.params.route,
      lang:
        transformStringToSupportedLanguage(swapWithLangMatch.params.lang) ||
        DEFAULT_LOCALE,
      url: swapWithLangMatch.url,
      urlWithoutLang: `/${swapWithLangMatch.params.route}/${swapWithLangMatch.params.tokenFrom}/${swapWithLangMatch.params.tokenTo}`,
      langInRoute: true,
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
      langInRoute: false,
    };
  }

  if (routeWithLangMatch) {
    return {
      route: routeWithLangMatch.params.route,
      lang:
        transformStringToSupportedLanguage(routeWithLangMatch.params.lang) ||
        DEFAULT_LOCALE,
      url: routeWithLangMatch.url,
      urlWithoutLang: `/${routeWithLangMatch.params.route}`,
      langInRoute: true,
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
      langInRoute: !!lang,
    };
  }

  return {
    lang: getUserLanguage(),
    url: "/",
    urlWithoutLang: "/",
    langInRoute: false,
  };
};

export default useAppRouteParams;
