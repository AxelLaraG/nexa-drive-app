import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useEffect } from 'react';

WebBrowser.maybeCompleteAuthSession();

export const useGoogleAuth = () => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: "511325417475-dfog343he49s4gl9vkenb8d3cf7q6ni5.apps.googleusercontent.com",
    androidClientId:"511325417475-u4s192994uc9rp6efbrm68hthu2lt522.apps.googleusercontent.com",
  });

  return { request, response, promptAsync };
};