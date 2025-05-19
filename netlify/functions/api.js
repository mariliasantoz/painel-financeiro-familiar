// Dados simulados (para persistência temporária durante a execução do container)
let receitas = [
  { id: "1", nome: "Salário", valor: 5000 },
  { id: "2", nome: "Freelancer", valor: 1500 }
];

let compras = [
  { id: "1", nome: "Compra A", valor: 300 },
  { id: "2", nome: "Compra B", valor: 150 }
];

let contas = [
  { id: "1", nome: "Conta Fixa", valor: 1000 },
  { id: "2", nome: "Conta Variável", valor: 500 }
];

// Função para calcular os totais: saldo, total de receitas e despesas (compras)
function getTotaisFunction() {
  const totalReceitas = receitas.reduce((acc, item) => acc + item.valor, 0);
  const totalCompras = compras.reduce((acc, item) => acc + item.valor, 0);
  const saldo = totalReceitas - totalCompras;
  return { saldo, receitas: totalReceitas, despesas: totalCompras };
}

// Função auxiliar para gerar um novo id (incremental)
function generateId(dataArray) {
  let maxId = 0;
  dataArray.forEach(item => {
    const id = parseInt(item.id, 10);
    if (id > maxId) {
      maxId = id;
    }
  });
  return String(maxId + 1);
}

exports.handler = async function(event) {
  try {
    const body = JSON.parse(event.body || "{}");

    if (!body.action) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Ação não especificada!" })
      };
    }

    let responseData = {};

    // Seleciona a ação com base no valor de body.action
    switch (body.action) {
      // RECEITAS
      case "getReceitas":
        responseData = { receitas };
        break;

      case "deleteReceita":
        if (!body.recordId) {
          responseData = { error: "recordId não fornecido" };
        } else {
          receitas = receitas.filter(item => item.id !== body.recordId);
          responseData = { message: "Receita deletada com sucesso" };
        }
        break;

      case "updateReceita":
        if (!body.recordId || !body.data) {
          responseData = { error: "Dados insuficientes para atualização" };
        } else {
          let index = receitas.findIndex(item => item.id === body.recordId);
          if (index === -1) {
            responseData = { error: "Receita não encontrada" };
          } else {
            receitas[index] = { ...receitas[index], ...body.data };
            responseData = { message: "Receita atualizada com sucesso" };
          }
        }
        break;

      // TOTAlIZAR
      case "getTotais":
        responseData = getTotaisFunction();
        break;

      // COMPRAS
      case "getCompras":
        responseData = { compras };
        break;

      case "deleteCompra":
        if (!body.recordId) {
          responseData = { error: "recordId não fornecido" };
        } else {
          compras = compras.filter(item => item.id !== body.recordId);
          responseData = { message: "Compra deletada com sucesso" };
        }
        break;

      case "updateCompra":
        if (!body.recordId || !body.data) {
          responseData = { error: "Dados insuficientes para atualização" };
        } else {
          let index = compras.findIndex(item => item.id === body.recordId);
          if (index === -1) {
            responseData = { error: "Compra não encontrada" };
          } else {
            compras[index] = { ...compras[index], ...body.data };
            responseData = { message: "Compra atualizada com sucesso" };
          }
        }
        break;

      case "addCompraCartao":
        if (!body.data || !body.data.nome || !body.data.valor) {
          responseData = { error: "Dados insuficientes para adicionar compra" };
        } else {
          const newId = generateId(compras);
          const newCompra = {
            id: newId,
            nome: body.data.nome,
            valor: parseFloat(body.data.valor),
            parcelas: body.data.parcelas || "1/1",
            responsavel: body.data.responsavel || "",
            cartao: body.data.cartao || ""
          };
          compras.push(newCompra);
          responseData = { message: "Compra adicionada com sucesso", compra: newCompra };
        }
        break;

      // CONTAS
      case "getContas":
        responseData = { contas };
        break;

      case "deleteConta":
        if (!body.recordId) {
          responseData = { error: "recordId não fornecido" };
        } else {
          contas = contas.filter(item => item.id !== body.recordId);
          responseData = { message: "Conta deletada com sucesso" };
        }
        break;

      case "updateConta":
        if (!body.recordId || !body.data) {
          responseData = { error: "Dados insuficientes para atualização" };
        } else {
          let index = contas.findIndex(item => item.id === body.recordId);
          if (index === -1) {
            responseData = { error: "Conta não encontrada" };
          } else {
            contas[index] = { ...contas[index], ...body.data };
            responseData = { message: "Conta atualizada com sucesso" };
          }
        }
        break;

      case "addConta":
        if (!body.data || !body.data.nome || !body.data.valor) {
          responseData = { error: "Dados insuficientes para adicionar conta" };
        } else {
          const newId = generateId(contas);
          const newConta = {
            id: newId,
            tipo: body.data.tipo,
            nome: body.data.nome,
            parcelas: body.data.parcelas || "1/1",
            valor: parseFloat(body.data.valor)
          };
          contas.push(newConta);
          responseData = { message: "Conta adicionada com sucesso", conta: newConta };
        }
        break;

      default:
        responseData = { message: "Ação não reconhecida" };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(responseData)
    };
  } catch (error) {
    console.error("Erro interno:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Erro interno no servidor!" })
    };
  }
};
