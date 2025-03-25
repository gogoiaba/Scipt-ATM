let agendamentos = [];
let audioPlayer = document.getElementById("audioPlayer");
let intervaloVerificacao;

let agendamentosPadrao = [
  { dias: ["1", "2", "3", "4", "5"], horaInicio: "18:00", horaFim: "22:00" }, // Segunda a Sexta
  { dias: ["6", "0"], horaInicio: "06:00", horaFim: "22:00" }, // Sábado e Domingo
];

// Inicia a verificação dos agendamentos quando a página carrega
document.addEventListener("DOMContentLoaded", function () {
  carregarAgendamentosPadrao();
  iniciarVerificacaoAgendamentos();
});

function iniciarVerificacaoAgendamentos() {
  // Verifica a cada minuto se deve tocar o áudio
  intervaloVerificacao = setInterval(verificarAgendamentos, 60000);
  // Verifica imediatamente ao carregar a página
  verificarAgendamentos();
}

function verificarAgendamentos() {
  let agora = new Date();
  let diaSemana = agora.getDay().toString(); // 0-6 (Domingo-Sábado)
  let horaAtual =
    agora.getHours().toString().padStart(2, "0") +
    ":" +
    agora.getMinutes().toString().padStart(2, "0");

  // Verifica agendamentos padrão ativos
  let agendamentosAtivos = [...agendamentos];

  // Adiciona agendamentos padrão marcados como ativos
  document
    .querySelectorAll('#agendamentosPadrao input[type="checkbox"]:checked')
    .forEach((checkbox, index) => {
      agendamentosAtivos.push({
        ...agendamentosPadrao[index],
        audioSrc: audioPlayer.src, // Usa o áudio atual
      });
    });

  // Verifica se algum agendamento está ativo no momento
  let agendamentoAtivo = agendamentosAtivos.find((ag) => {
    return (
      ag.dias.includes(diaSemana) &&
      horaAtual >= ag.horaInicio &&
      horaAtual <= ag.horaFim
    );
  });

  if (agendamentoAtivo && audioPlayer.src) {
    if (audioPlayer.paused) {
      audioPlayer.play();
    }
  } else {
    if (!audioPlayer.paused) {
      audioPlayer.pause();
    }
  }
}

function carregarAgendamentosPadrao() {
  let lista = document.getElementById("agendamentosPadrao");
  lista.innerHTML = "";
  agendamentosPadrao.forEach((item, index) => {
    let diasTexto = item.dias
      .map((d) => ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"][d])
      .join(", ");
    let div = document.createElement("div");
    div.className = "agendamento-item";
    div.innerHTML = `
      <input type="checkbox" id="padrao${index}" checked>
      <span>${diasTexto} - ${item.horaInicio} às ${item.horaFim}</span>
    `;
    lista.appendChild(div);
  });
}

function adicionarAgendamento() {
  let diasSelecionados = [
    ...document.getElementById("diasSemana").selectedOptions,
  ].map((opt) => opt.value);
  let horaInicio = document.getElementById("horaInicio").value;
  let horaFim = document.getElementById("horaFim").value;
  let arquivo = document.getElementById("audioFile").files[0];

  if (!diasSelecionados.length || !horaInicio || !horaFim || !arquivo) {
    alert("Preencha todos os campos.");
    return;
  }

  let leitor = new FileReader();
  leitor.onload = function (e) {
    let novoAgendamento = {
      dias: diasSelecionados,
      horaInicio,
      horaFim,
      audioSrc: e.target.result,
    };
    agendamentos.push(novoAgendamento);
    atualizarLista();

    // Se este for o primeiro agendamento, define o áudio
    if (!audioPlayer.src) {
      audioPlayer.src = e.target.result;
    }
  };
  leitor.readAsDataURL(arquivo);
}

function atualizarLista() {
  let lista = document.getElementById("listaAgendamentos");
  lista.innerHTML = "";
  agendamentos.forEach((item, index) => {
    let diasTexto = item.dias
      .map((d) => ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"][d])
      .join(", ");
    let div = document.createElement("div");
    div.className = "agendamento-item";
    div.innerHTML = `
      <span>${diasTexto} - ${item.horaInicio} às ${item.horaFim}</span>
      <button onclick="removerAgendamento(${index})">X</button>
    `;
    lista.appendChild(div);
  });
}

function removerAgendamento(index) {
  agendamentos.splice(index, 1);
  atualizarLista();
}

function tocarAgora() {
  let arquivo = document.getElementById("audioFile").files[0];
  if (!arquivo) {
    alert("Selecione um arquivo MP3 primeiro.");
    return;
  }

  let leitor = new FileReader();
  leitor.onload = function (e) {
    audioPlayer.src = e.target.result;
    audioPlayer.play();
  };
  leitor.readAsDataURL(arquivo);
}

function pararAudio() {
  audioPlayer.pause();
}
