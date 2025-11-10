const express = require('express');
const app = express();
const port = 3000;

// Middleware para parsear dados de formulários
app.use(express.urlencoded({ extended: true }));

// Array para armazenar feedbacks em memória
let feedbacks = [];
let nextId = 1;

// Rota inicial: Formulário de feedback com header
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Coleta de Feedbacks</title>
      <style>
        * { box-sizing: border-box; }
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          margin: 0; 
          background-color: #f4f6f9; 
          color: #333;
        }
        header {
          background: linear-gradient(135deg, #4CAF50, #45a049);
          color: white;
          text-align: center;
          padding: 30px 20px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        header h1 {
          margin: 0;
          font-size: 2rem;
          font-weight: 600;
        }
        .container { 
          max-width: 600px; 
          margin: 30px auto; 
          padding: 20px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        h2 { 
          color: #4CAF50; 
          text-align: center; 
          margin-bottom: 20px;
        }
        label { 
          display: block; 
          margin: 10px 0 5px; 
          font-weight: 500;
        }
        input, textarea { 
          width: 100%; 
          padding: 10px; 
          border: 1px solid #ccc; 
          border-radius: 6px; 
          font-size: 1rem;
          margin-bottom: 15px;
        }
        textarea { height: 120px; resize: vertical; }
        button { 
          background-color: #4CAF50; 
          color: white; 
          border: none; 
          padding: 12px 20px; 
          font-size: 1rem; 
          border-radius: 6px; 
          cursor: pointer; 
          width: 100%;
          transition: background 0.3s;
        }
        button:hover { background-color: #45a049; }
      </style>
    </head>
    <body>
      <header>
        <h1>Coleta de Feedbacks de Alunos para um Curso Online</h1>
      </header>

      <div class="container">
        <h2>Enviar Feedback</h2>
        <form action="/feedbacks/enviar" method="POST">
          <label for="nome">Nome:</label>
          <input type="text" id="nome" name="nome" required placeholder="Seu nome completo">

          <label for="comentario">Comentário:</label>
          <textarea id="comentario" name="comentario" required placeholder="Escreva seu feedback sobre o curso..."></textarea>

          <button type="submit">Enviar Feedback</button>
        </form>
      </div>
    </body>
    </html>
  `);
});

// Rota para cadastrar feedback
app.post('/feedbacks/enviar', (req, res) => {
  const { nome, comentario } = req.body;
  if (nome && comentario) {
    feedbacks.push({ id: nextId++, nome, comentario });
  }
  res.redirect('/feedbacks/lista');
});

// Rota para listar feedbacks
app.get('/feedbacks/lista', (req, res) => {
  let listaHtml = feedbacks.map(fb => `
    <li style="border: 1px solid #ddd; padding: 15px; margin-bottom: 10px; border-radius: 8px; background: #f9f9f9;">
      <strong>Nome:</strong> ${fb.nome}<br>
      <strong>Comentário:</strong> ${fb.comentario}<br>
      <form action="/feedbacks/remover" method="POST" style="margin-top: 10px;">
        <input type="hidden" name="id" value="${fb.id}">
        <button type="submit" style="background-color: #e74c3c; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 0.9rem;">
          Remover
        </button>
      </form>
    </li>
  `).join('');

  res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Lista de Feedbacks</title>
      <style>
        * { box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; background-color: #f4f6f9; }
        header {
          background: linear-gradient(135deg, #4CAF50, #45a049);
          color: white;
          text-align: center;
          padding: 30px 20px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        header h1 { margin: 0; font-size: 2rem; font-weight: 600; }
        .container { max-width: 700px; margin: 30px auto; padding: 20px; background: white; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        h2 { color: #4CAF50; text-align: center; }
        ul { list-style: none; padding: 0; }
        .empty { text-align: center; color: #777; font-style: italic; }
        a { 
          display: inline-block; 
          margin-top: 20px; 
          color: #4CAF50; 
          text-decoration: none; 
          font-weight: 500;
          padding: 10px 15px;
          border: 1px solid #4CAF50;
          border-radius: 6px;
          transition: all 0.3s;
        }
        a:hover { background-color: #4CAF50; color: white; }
      </style>
    </head>
    <body>
      <header>
        <h1>Coleta de Feedbacks de Alunos para um Curso Online</h1>
      </header>

      <div class="container">
        <h2>Feedbacks Enviados</h2>
        ${feedbacks.length > 0 
          ? `<ul>${listaHtml}</ul>` 
          : '<p class="empty">Nenhum feedback enviado ainda.</p>'
        }
        <a href="/">Enviar novo feedback</a>
      </div>
    </body>
    </html>
  `);
});

// Rota para remover feedback
app.post('/feedbacks/remover', (req, res) => {
  const idToRemove = parseInt(req.body.id);
  feedbacks = feedbacks.filter(fb => fb.id !== idToRemove);
  res.redirect('/feedbacks/lista');
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});