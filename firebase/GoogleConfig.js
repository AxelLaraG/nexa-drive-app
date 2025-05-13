import * as Google from "expo-auth-session/providers/google";
import { makeRedirectUri } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { useEffect } from "react";

WebBrowser.maybeCompleteAuthSession();

export const useGoogleAuth = () => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: "511325417475-ukqicv72d0gttq8tebf68hvgjjngb66s.apps.googleusercontent.com",
    androidClientId: "511325417475-u4s192994uc9rp6efbrm68hthu2lt522.apps.googleusercontent.com",
  });

  return { request, response, promptAsync };
};
