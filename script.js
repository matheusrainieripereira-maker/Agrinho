// ============================
//  AgroCalc — Script Principal
// ============================

const culturas = {
  milho:  "🌽 Milho",
  soja:   "🫘 Soja",
  trigo:  "🌾 Trigo",
  arroz:  "🍚 Arroz",
  feijao: "🫘 Feijão",
  outro:  "🌱 Cultura",
};

function getVal(id) {
  return parseFloat(document.getElementById(id).value) || 0;
}

function moeda(val) {
  return val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function numero(val, casas = 0) {
  return val.toLocaleString("pt-BR", { minimumFractionDigits: casas, maximumFractionDigits: casas });
}

function mostrarErro(msg) {
  const el = document.getElementById("erro");
  document.getElementById("erro-msg").textContent = msg;
  el.style.display = "block";
  document.getElementById("resultados").style.display = "none";
  // Remove e re-adiciona para reativar animação
  el.classList.remove("animar");
  void el.offsetWidth;
  el.classList.add("animar");
}

function ocultarErro() {
  document.getElementById("erro").style.display = "none";
}

function calcular() {
  ocultarErro();

  const area           = getVal("area");
  const sementesPorM2  = getVal("sementesPorM2");
  const preco          = getVal("preco");
  const perda          = getVal("perda");
  const espacamento    = getVal("espacamento");
  const custoExtra     = getVal("custoExtra");
  const cultura        = document.getElementById("cultura").value;

  // Validações
  if (area <= 0)          return mostrarErro("Informe uma área válida (maior que zero).");
  if (sementesPorM2 <= 0) return mostrarErro("Informe a quantidade de sementes por m².");
  if (preco <= 0)          return mostrarErro("Informe o preço por semente.");
  if (perda < 0 || perda >= 100) return mostrarErro("A perda estimada deve estar entre 0% e 99%.");

  // Cálculos principais
  const sementesBase    = area * sementesPorM2;
  const fatorPerda      = perda > 0 ? 1 / (1 - perda / 100) : 1;
  const sementesTotal   = Math.ceil(sementesBase * fatorPerda);
  const sementesExtras  = sementesTotal - Math.ceil(sementesBase);
  const custoSementes   = sementesTotal * preco;
  const custoTotal      = custoSementes + custoExtra;
  const custoPorM2      = custoTotal / area;
  const custoPorSemente = custoTotal / sementesTotal;

  // Linhas de plantio
  let linhas = "—";
  if (espacamento > 0) {
    const comprimento = Math.sqrt(area);
    linhas = numero(Math.ceil(comprimento / espacamento)) + " linhas";
  }

  // Exibe resultados
  document.getElementById("r-sementes").textContent       = numero(sementesTotal) + " un";
  document.getElementById("r-sementes-extra").textContent = perda > 0 ? (+${numero(sementesExtras)} por perda de ${perda}%) : "";
  document.getElementById("r-custo-sementes").textContent  = moeda(custoSementes);
  document.getElementById("r-custo-total").textContent     = moeda(custoTotal);
  document.getElementById("r-linhas").textContent          = linhas;
  document.getElementById("r-por-m2").textContent          = moeda(custoPorM2);
  document.getElementById("r-por-semente").textContent     = moeda(custoPorSemente);

  // Badge de cultura
  const badge = document.getElementById("cultura-badge");
  badge.textContent = cultura ? culturas[cultura] : "";
  badge.style.display = cultura ? "inline-block" : "none";

  // Alerta de perda
  const alertaPerda = document.getElementById("alerta-perda");
  if (perda > 0) {
    document.getElementById("perda-txt").textContent         = perda;
    document.getElementById("sementes-extras-txt").textContent = numero(sementesExtras);
    alertaPerda.style.display = "block";
  } else {
    alertaPerda.style.display = "none";
  }

  document.getElementById("resultados").style.display = "block";

  // Scroll suave até os resultados
  document.getElementById("resultados").scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function limpar() {
  ["area", "sementesPorM2", "preco", "perda", "espacamento", "custoExtra"].forEach(id => {
    document.getElementById(id).value = "";
  });
  document.getElementById("cultura").value = "";
  document.getElementById("resultados").style.display = "none";
  ocultarErro();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Enter para calcular
document.addEventListener("keydown", e => {
  if (e.key === "Enter") calcular();
});
