import * as SQLite from "expo-sqlite";
import * as FileSystem from "expo-file-system/legacy";

let db: SQLite.SQLiteDatabase | undefined;

export async function getDB(): Promise<SQLite.SQLiteDatabase | undefined> {
  try {
    if (!db) {
      db = SQLite.openDatabaseSync("app.db");
      await db.execAsync(`PRAGMA foreign_keys = ON;`); // Habilita chaves estrangeiras pois SQLite as desabilita por padrão
    }
    return db;
  } catch (error) {
    console.error("Erro ao obter database:", error);
    throw new Error ("Erro ao obter database"); // Repassa o erro para ser tratado onde getDB for chamado
  }
}

export async function initDB(): Promise<void> {
  try {
    if (!db) {
      db = await getDB(); // esperando o db ser inicializado antes de criar as tabelas
    }
    if (db) {
      db.execSync(`CREATE TABLE IF NOT EXISTS categorias (
        Id INTEGER PRIMARY KEY AUTOINCREMENT,
        Nome TEXT NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS produtos (
        Id INTEGER PRIMARY KEY AUTOINCREMENT,
        Nome TEXT NOT NULL,
        CategoriaId INTEGER,
        Valor REAL,
        DataCad TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (CategoriaId) REFERENCES categorias(Id) ON DELETE CASCADE
      );
      `);
    }
  } catch (error) {
    console.error("Erro ao inicializar database:", error);
    throw new Error("Erro ao inicializar database"); // Repassa o erro para ser tratado onde initDB for chamado
  }
}

export async function resetDB(): Promise<void> {
  try {
    await SQLite.deleteDatabaseAsync("app.db");
    db = undefined; // Limpa a referência para forçar reabertura na próxima chamada de getDB
    console.log("Database resetada com sucesso.");
  } catch (error) {
    console.error("Erro ao resetar database:", error);
    throw new Error("Erro ao resetar database"); // Repassa o erro para ser tratado onde resetDB for chamado
  }
}
