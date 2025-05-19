// netlify/functions/api.js
exports.handler = async (event, context) => {
  // Restringe a apenas requisições POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Apenas requisições POST são permitidas." };
  }
  
  let payload;
  try {
    payload = JSON.parse(event.body);
  } catch (error) {
    return { statusCode: 400, body: "JSON inválido." };
  }
  
  const action = payload.action;
  
  if (action === "getReceitas") {
    return {
      statusCode: 200,
      body: JSON.stringify([
        { id: "1", nome: "Receita 1", valor: 1500.00 },
        { id: "2", nome: "Receita 2", valor: 2000.00 }
      ])
    };
  }
  
  if (action === "getTotais") {
    return {
      statusCode: 200,
      body: JSON.stringify({
        saldo: 2000.00,
        receitas: 5000.00,
        despesas: 3000.00
      })
    };
  }
  
  // Implementar outras ações se necessário
  return { statusCode: 400, body: "Ação não reconhecida" };
};
