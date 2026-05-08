import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet, Alert, Modal, TextInput } from 'react-native';
import { initDB, resetDB } from '../../database/database';
import { CategoriasRepository } from '../../repository/CategoriaRepository';
import { Categoria } from '../../models/Categoria';

// Tela principal de gestão de categorias: lista, cria, edita e exclui categorias do banco de dados
export default function CategoriaScreen() {

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [nomeCategoria, setNomeCategoria] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState<Categoria | null>(null);

  const categoriaRepo = new CategoriasRepository(); // O construtor que exigia db foi removido do CategoriaRepository.ts. Agora todos os métodos chamam getDB() internamente, igual ao que findAll já fazia antes — 
  // o que é o padrão correto para um singleton de banco de dados. O erro na linha 15 da tela desaparece sem precisar alterar o arquivo categorias/index.tsx.

  // Inicializa o banco de dados e carrega os dados ao montar o componente (executa apenas uma vez)
  useEffect(() => {
    // Garante que o banco está criado antes de tentar buscar os dados
    const setup = async () => {
      // await resetDB(); // Limpa o banco para testes
      await initDB();
      loadData();
    }
    setup();
  }, [])

  // Busca todas as categorias do banco e atualiza o estado; também fecha o modal ao final
  async function loadData(): Promise<void> {
    const data = await categoriaRepo.findAll();
    setCategorias(data);
    setModalVisible(false);
  }

  // Salva a categoria: cria uma nova se nenhuma estiver selecionada, ou atualiza a existente
  async function Salvar() {
    if (!nomeCategoria.trim()) return;
    if (selectedCategoria) {
      await categoriaRepo.update(new Categoria(nomeCategoria, selectedCategoria.Id));
    } else {
      await categoriaRepo.create(new Categoria(nomeCategoria, 0));
    }
    await loadData();
    closeModal();
  }

  async function handleDelete(id: number): Promise<void> {
    Alert.alert(
      "Confirmação",
      "Tem certeza que deseja excluir esta categoria?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            await categoriaRepo.delete(id);
            await loadData();
          }
        }
      ]
    );
  }

  function openCreate(): void {
    setSelectedCategoria(null);
    setNomeCategoria('');
    setModalVisible(true);
  }

  function openEdit(item: Categoria): void {
    setSelectedCategoria(item);
    setNomeCategoria(item.Nome);
    setModalVisible(true);
  }

  function closeModal(): void {
    setSelectedCategoria(null);
    setNomeCategoria('');
    setModalVisible(false);
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titleScreen}>Gestão de categorias</Text>

        <TouchableOpacity style={styles.addButton} onPress={openCreate}>
          <Text style={styles.addButtonText}>+ Nova</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={categorias}
        keyExtractor={(item) => String(item.Id)}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.sideBar} />

            <View style={styles.cardInner}>
              <View style={styles.cardContent}>
                <Text style={styles.title}>ID: {item.Id}</Text>
                <Text style={styles.title}>Produto: {item.Nome}</Text>
              </View>

              <View style={styles.actions}>
                <TouchableOpacity
                  style={[styles.iconButton]}
                  onPress={() => openEdit(item)}
                >
                  <Text style={styles.iconText}>✏️ Editar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.iconButton]}
                  onPress={() => handleDelete(item.Id)}
                >
                  <Text style={styles.iconText}>🗑️ Excluir</Text>
                </TouchableOpacity>
              </View>
            </View>

          </View>
        )}
      />

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>

            <Text style={styles.modalTitle}>
              {selectedCategoria ? "Editar Categoria" : "Nova Categoria"}
            </Text>


            <TextInput
              placeholder="Digite o nome"
              value={nomeCategoria}
              onChangeText={setNomeCategoria}
              style={styles.input}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={Salvar}
              >
                <Text style={{ color: "#fff" }}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View >
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6'
  },
  sideBar: {
    width: 6,
    backgroundColor: "#FF9800", // laranja 🍊
  },

  cardInner: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 20,
  },

  titleScreen: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1E293B",
  },
  
  addButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },

  addButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  card: {
    flexDirection: 'row',
    width: '95%',
    backgroundColor: "#ffffff",
    borderRadius: 12,
    // padding: 0,
    marginTop: 12,
    marginHorizontal: 10,
    overflow: 'hidden',

    // sombra iOS
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    
    // sombra Android
    elevation: 4,
  },
  
  cardContent: {
    marginBottom: 12,
  },

  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: 'center',
    gap: 20
  },
  
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  
  editButton: {
    backgroundColor: "#2196F3",
    marginRight: 6,
  },

  deleteButton: {
    backgroundColor: "#F44336",
    marginLeft: 6,
  },
  
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  
  modalContainer: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    marginBottom: 16,
  },
  
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  
  modalButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginLeft: 8,
  },

  cancelButton: {
    backgroundColor: "#eee",
  },
  
  saveButton: {
    backgroundColor: "#4CAF50",
  },
  iconButton: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  
  iconText: {
    fontSize: 14,
    fontWeight: "600",
  },
});