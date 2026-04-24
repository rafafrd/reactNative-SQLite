import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Home from "./src/screens/home";
import Produtos from "./src/screens/produtos";
import Categorias from "./src/screens/categorias";

// rootstackparamlist é um tipo que define as rotas
export type RootStackParamList = { // deixando undefined apenas para o typeScript entender
  Home: undefined;
  Produtos: undefined;
  Categorias: undefined;
};

// criando a pilha de navegação
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: "#0f172a",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          contentStyle: {
            backgroundColor: "#f8fafc",
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ title: "Home" }}
        />
        <Stack.Screen
          name="Produtos"
          component={Produtos}
          options={{ title: "Produtos" }}
        />
        <Stack.Screen
          name="Categorias"
          component={Categorias}
          options={{ title: "Categorias" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}