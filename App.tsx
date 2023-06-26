import 'react-native-get-random-values'
import './src/libs/dayjs';

import { ThemeProvider } from 'styled-components';
import { SignIn } from './src/screens/SignIn';
import theme from './src/theme';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import { Loading } from './src/components/Loading';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider, UserProvider } from '@realm/react';
import { REAL_APP_ID } from '@env';
import { Routes } from './src/routes';
import { RealmProvider, syncConfig } from './src/libs/realm';
import { TopMessage } from './src/components/TopMessage';
import { WifiSlash } from 'phosphor-react-native';
import { useNetInfo } from '@react-native-community/netinfo';

export default function App() {
  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold });
  const netInfo = useNetInfo();

  if (!fontsLoaded) {
    return (
      <Loading />
    );
  }

  return (
    // compartilhar a integração com o atlas com nosso app
    <AppProvider id={REAL_APP_ID}>
      <ThemeProvider theme={theme}>
        <SafeAreaProvider style={{ flex: 1, backgroundColor: theme.COLORS.GRAY_800 }}>
          <StatusBar
            barStyle='light-content'
            backgroundColor='transparent'
            translucent
          />
          {
            !netInfo.isConnected &&
            <TopMessage
              title='Você está off-line'
              icon={WifiSlash}
            />
          }
          {/* UserProvider vai ser responsável pela parte de autenticação mesmo */}
          {/* O fallback basicamente fala se não tiver nenhum usuário autenticado, então a gente chama esse método (componente SignIn) para autenticar */}
          <UserProvider fallback={<SignIn />}>
            {/* Se o usuário já estiver autenticado ele renderiza esse cara dentro do UserProvider */}

            {/* importante que o realm provider esteja dentro do useProvider, pq dai ele já compartilha o nosso user logado dentro do realm */}
            {/* Enquanto está no processo de abrir banco de dados, e etc... a gente deixa o Loading */}
            <RealmProvider sync={syncConfig} fallback={Loading}>
              <Routes />
            </RealmProvider>
            {/* Ou seja, oq vai rolar aq? se o usuário não estiver autenticado ele vai ser levado pra nossa fallback, e vai ser levado pra nossa tela de login, e se 
          o usuário já estiver autenticado vai ser levado para o nossa home */}
          </UserProvider>
        </SafeAreaProvider>
      </ThemeProvider>
    </AppProvider>
  );
}


