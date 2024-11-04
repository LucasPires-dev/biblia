const fs = require('fs');
const path = require('path');

// Carrega o JSON com os dados dos livros e capítulos
const biblia = require('./nvi.json');

// Pasta onde os arquivos .sql serão salvos
const pastaSQL = './sql_livros';

// Cria a pasta de saída se não existir
if (!fs.existsSync(pastaSQL)) {
  fs.mkdirSync(pastaSQL);
}

// Função para gerar arquivos .sql para cada livro
let idVersiculoGlobal = 0; // ID global que começa do 0 e incrementa

biblia.forEach((livro, indexLivro) => {
  const book = livro.abbrev; // Abreviação do livro
  const chapterId = indexLivro; // O ID do capítulo é o índice do livro

  const linhasSQL = [];

  livro.chapters.forEach((chapterVerses, chapterIndex) => {
    const chapter = chapterIndex + 1;

    chapterVerses.forEach((verseText, verseIndex) => {
      const verseNumber = verseIndex + 1; // Número do versículo dentro do capítulo
      const textoSanitizado = verseText.replace(/"/g, '""'); // Escapa aspas duplas para SQL

      // Cria o comando INSERT para cada versículo
      linhasSQL.push(`INSERT INTO verses (id, number, text, chapter_id) VALUES (${idVersiculoGlobal}, ${verseNumber}, "${textoSanitizado}", ${chapterId});`);
      idVersiculoGlobal++; // Incrementa o ID do versículo global
    });
  });

  // Gera o nome do arquivo baseado no livro
  const nomeArquivo = path.join(pastaSQL, `${book}.sql`);

  // Salva o conteúdo no arquivo .sql
  fs.writeFileSync(nomeArquivo, linhasSQL.join('\n'), 'utf8');
  console.log(`Arquivo criado: ${nomeArquivo}`);
});

console.log('Todos os arquivos .sql foram gerados com sucesso!');
