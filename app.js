// app.js
// Defina a URL do seu backend. Substitua "SEU_SITE_NETLIFY" pela parte correta da URL fornecida pelo Netlify.
const webAppUrl = "https://SEU_SITE_NETLIFY.netlify.app/.netlify/functions/api";

// Função para buscar as receitas
function getReceitas() {
  fetch(webAppUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ action: "getReceitas" })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error("Erro na requisição: " + response.statusText);
    }
    return response.json();
  })
  .then(data => {
    // Atualiza a lista de receitas na página
    const list = document.getElementById("receitas-list");
    list.innerHTML = ""; // Limpa os itens atuais
    data.forEach(item => {
      const li = document.createElement("li");
      li.textContent = `${item.nome}: R$ ${item.valor.toFixed(2)}`;
      list.appendChild(li);
    });
  })
  .catch(error => {
    console.error("Erro ao buscar receitas:", error);
  });
}

// Função para buscar os totais
function getTotais() {
  fetch(webAppUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ action: "getTotais" })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error("Erro na requisição: " + response.statusText);
    }
    return response.json();
  })
  .then(data => {
    document.getElementById("saldo").textContent = `Saldo: R$ ${data.saldo.toFixed(2)}`;
    document.getElementById("total-receitas").textContent = `Receitas: R$ ${data.receitas.toFixed(2)}`;
    document.getElementById("total-despesas").textContent = `Despesas: R$ ${data.despesas.toFixed(2)}`;
  })
  .catch(error => {
    console.error("Erro ao buscar totais:", error);
  });
}

// Executa as funções após o carregamento completo da página
document.addEventListener("DOMContentLoaded", () => {
  getReceitas();
  getTotais();
});
