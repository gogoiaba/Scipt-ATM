let agendamentos = [];

let agendamentosPadrao = [
  { dias: ["1", "2", "3", "4", "5"], horaInicio: "18:00", horaFim: "22:00" }, // Segunda a Sexta
  { dias: ["6", "0"], horaInicio: "06:00", horaFim: "22:00" }, // Sábado e Domingo
];

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
    let audio = document.getElementById("audioPlayer");
    audio.src = e.target.result;
    audio.play();
  };
  leitor.readAsDataURL(arquivo);
}

function pararAudio() {
  document.getElementById("audioPlayer").pause();
}

carregarAgendamentosPadrao();
