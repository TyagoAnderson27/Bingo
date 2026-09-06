import { useState, useEffect, useCallback } from 'react';
import './Bingo.css';
import Globo3D from './Globo3D';
function gerarLetraColuna(min, max, quantidade) {
  const numeros = [];
  while (numeros.length < quantidade) {
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    if (!numeros.includes(num)) numeros.push(num);
  }
  return numeros.sort((a, b) => a - b);
}

function gerarCartelaNova() {
  const b = gerarLetraColuna(1, 15, 5);
  const i = gerarLetraColuna(16, 30, 5);
  const n = gerarLetraColuna(31, 45, 5);
  const g = gerarLetraColuna(46, 60, 5);
  const o = gerarLetraColuna(61, 75, 5);

  let matriz = [];
  for (let r = 0; r < 5; r++) {
    matriz.push(b[r], i[r], n[r], g[r], o[r]);
  }
  matriz[12] = "BINGO";
  return matriz;
}


function Bingo() {
  const [numerosSorteados, setNumerosSorteados] = useState([]);
  const [ultimoNumero, setUltimoNumero] = useState(null);
  const [cartela, setCartela] = useState(() => gerarCartelaNova());
  const [marcados, setMarcados] = useState(Array(25).fill(false));
  const [automatico, setAutomatico] = useState(false);
  const [ganhou, setGanhou] = useState(false);


  const tocarSomVitoria = useCallback(() => {
    const audio = new Audio('/Bingo.mp3');
    audio.play().catch(e => console.log("Erro ao tocar áudio:", e));
  }, []);


  const sortearNumero = useCallback(() => {
    if (numerosSorteados.length >= 75) {
      alert("Todos os números já foram sorteados!");
      return;
    }

    let num;
    do {
      num = Math.floor(Math.random() * 75) + 1;
    } while (numerosSorteados.includes(num));

    setUltimoNumero(num);
    setNumerosSorteados((prev) => [num, ...prev]);
  }, [numerosSorteados]);


  useEffect(() => {
    let intervalo = null;
    if (automatico && !ganhou) {
      intervalo = setInterval(() => {
        sortearNumero();
      }, 10000);
    } else {
      clearInterval(intervalo);
    }
    return () => clearInterval(intervalo);
  }, [automatico, ganhou, sortearNumero]);

  const alternarMarcacao = (index) => {
    if (index === 12) return;
    const novosMarcados = [...marcados];
    novosMarcados[index] = !novosMarcados[index];
    setMarcados(novosMarcados);
  };

  const verificarVitoria = () => {

    const linhasGanhadoras = [[4, 8, 12, 16, 20]
    ];


    const venceu = linhasGanhadoras.some(linha =>
      linha.every(index => {
        if (index === 12) return true;
        const valorCelula = cartela[index];
        return marcados[index] && numerosSorteados.includes(valorCelula);
      })
    );

    if (venceu) {
      setGanhou(true);
      setAutomatico(false);
      tocarSomVitoria();
      alert("🎉 PARABÉNS! BINGO CONFIRMADO COM SUCESSO!");
    } else {
      alert("❌ Ainda não foi dessa vez. Verifique sua cartela!");
    }
  };

  const reiniciarJogo = () => {
    setNumerosSorteados([]);
    setUltimoNumero(null);
    setCartela(gerarCartelaNova());
    setMarcados(Array(25).fill(false));
    setGanhou(false);
    setAutomatico(false);
  };

  return (
    <div className="bingo-container">
      <h1 className="bingo-titulo">Bingo UTD</h1>

      {ganhou && <div className="banner-vitoria">🏆 BINGO! VOCÊ VENCEU! 🏆</div>}

      <div className="bingo-layout">
        <div className="painel-sorteio">
          <h2>Painel do Globo</h2>
          <div className="bola-principal">
            <div className="globo-container" style={{ minHeight: '320px' }}>
              <Globo3D />
              <div className="tubo-saida">
                <div className="bola-sorteada">
                  {ultimoNumero ? ultimoNumero : "--"}
                </div>
              </div>
            </div>
          </div>

          <button className="btn-sortear" onClick={sortearNumero} disabled={ganhou}>
            Sortear Número
          </button>
          <button className="btn-reiniciar" onClick={reiniciarJogo}>
            Reiniciar Jogo
          </button>
          <button
            className={`btn-automatico ${automatico ? 'ativo' : ''}`}
            onClick={() => setAutomatico(!automatico)}
            disabled={ganhou}
          >
            {automatico ? '⏸ Parar Sorteio Auto' : '▶️ Sorteio Automático (10s)'}
          </button>

          <div className="historico">
            <h3>Histórico (Sorteados: {numerosSorteados.length})</h3>
            <div className="historico-lista">
              {numerosSorteados.map((num, i) => (
                <span key={i} className="bola-historico">{num}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Painel da Cartela */}
        <div className="painel-cartela">
          <h2>Sua Cartela</h2>
          <div className="bingo-letras" translate="no">
            <span>B</span><span>I</span><span>N</span><span>G</span><span>O</span>
          </div>
          <div className={`cartela-grid ${ganhou ? 'cartela-vencedora' : ''}`}>
            {cartela.map((num, index) => (
              <div
                key={index}
                className={`celula-cartela ${marcados[index] || index === 12 ? 'marcado' : ''}`}
                onClick={() => alternarMarcacao(index)}
              >
                {num}
              </div>
            ))}
          </div>

          <button className="btn-bingo" onClick={verificarVitoria} disabled={ganhou}>
            📣 GRITAR BINGO!
          </button>
        </div>
      </div>
    </div>
  );
}

export default Bingo;
