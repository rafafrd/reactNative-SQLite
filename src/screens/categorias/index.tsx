import { useLayoutEffect, useState } from "react";
import { Alert, FlatList, Modal, Pressable, StyleSheet, Text, TextInput, View,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../../App";

type Props = NativeStackScreenProps<RootStackParamList, "Categorias">;

// Tipo da categoria
type Categoria = { id: number; nome: string };

// Dados de exemplo - será substituído pelo SQLite
const dadosIniciais: Categoria[] = [
  { id: 1, nome: "Eletrônicos" },
  { id: 2, nome: "Roupas" },
  { id: 3, nome: "Alimentos" },
];

export default function Categorias({ navigation }: Props) { //sonarQube fala para marcar como readonly
  const [data, setData] = useState<Categoria[]>(dadosIniciais);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [nomeInput, setNomeInput] = useState("");
  const [editandoId, setEditandoId] = useState<number | null>(null);

  // add botao "novo", que chama o modal zerado
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          style={styles.headerBtn}
          onPress={() => {
            setEditandoId(null);
            setNomeInput("");
            setModalVisivel(true); // muda o estado pra mostrar o modal
          }}
        >
          <Text style={styles.headerBtnTexto}>nova</Text>
        </Pressable>
      ),
    });
  }, [navigation]);

  // Abre modal preenchido para editar
  function abrirEditar(item: Categoria) {
    setEditandoId(item.id);
    setNomeInput(item.nome);
    setModalVisivel(true);
  }

  // Cria ou atualiza a categoria conforme editandoId
  function salvar() {
    if (!nomeInput.trim()) return;

    if (editandoId !== null) {
      // Atualiza existente
      setData((prev) =>
        prev.map((c) =>
          c.id === editandoId ? { ...c, nome: nomeInput.trim() } : c
        )
      );
    } else {
      // Insere novo com id único
      setData((prev) => [
        ...prev,
        { id: Date.now(), nome: nomeInput.trim() },
      ]);
    }

    setModalVisivel(false);
  }

  // Confirma e remove a categoria
  function excluir(id: number) {
    Alert.alert("Excluir categoria", "Tem certeza?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: () => setData((prev) => prev.filter((c) => c.id !== id)),
      },
    ]);
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.lista}
        ListEmptyComponent={
          <Text style={styles.vazio}>Nenhuma categoria cadastrada.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemNome}>{item.nome}</Text>

            <View style={styles.acoes}>
              <Pressable
                style={styles.btnEditar}
                onPress={() => abrirEditar(item)}
              >
                <Text style={styles.btnTexto}>Editar</Text>
              </Pressable>

              <Pressable
                style={styles.btnExcluir}
                onPress={() => excluir(item.id)}
              >
                <Text style={styles.btnTexto}>Excluir</Text>
              </Pressable>
            </View>
          </View>
        )}
      />

      {/* Modal de criar / editar categoria */}
      <Modal visible={modalVisivel} transparent animationType="slide">
        <View style={styles.modalFundo}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitulo}>
              {editandoId !== null ? "Editar Categoria" : "Nova Categoria"}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Nome da categoria"
              value={nomeInput}
              onChangeText={setNomeInput}
            />

            <Pressable style={styles.btnSalvar} onPress={salvar}>
              <Text style={styles.btnTexto}>Salvar</Text>
            </Pressable>

            <Pressable
              style={styles.btnCancelar}
              onPress={() => setModalVisivel(false)}
            >
              <Text style={styles.btnCancelarTexto}>Cancelar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  lista: {
    padding: 16,
    gap: 10,
  },

  // Cada item da lista
  item: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  itemNome: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
    flex: 1,
  },
  acoes: {
    flexDirection: "row",
    gap: 8,
  },
  btnEditar: {
    backgroundColor: "#f59e0b",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 3,
  },
  btnExcluir: {
    backgroundColor: "#ef4444",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 3,
  },
  btnTexto: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
  },
  vazio: {
    textAlign: "center",
    color: "#94a3b8",
    marginTop: 40,
    fontSize: 15,
  },

  // Botão no header
  headerBtn: {
    marginRight: 4,
    backgroundColor: "#3b82f6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  headerBtnTexto: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },

  // Modal
  modalFundo: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 24,
  },
  modalBox: {
    backgroundColor: "#fff",
    borderRadius: 4,
    padding: 24,
    gap: 12,
  },
  modalTitulo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 6,
    padding: 12,
    fontSize: 15,
    color: "#0f172a",
    backgroundColor: "#f8fafc",
  },
  btnSalvar: {
    backgroundColor: "#0f172a",
    padding: 14,
    borderRadius: 6,
    alignItems: "center",
  },
  btnCancelar: {
    alignItems: "center",
    padding: 10,
  },
  btnCancelarTexto: {
    color: "#64748b",
    fontSize: 14,
  },
});
