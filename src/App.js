import { useState, useEffect } from 'react';
import InputMask from 'react-input-mask';

import './App.css';

import Registro from './components/Registro';
import FiltrarBtn from './components/FiltrarBtn';

import logo from './assets/logo.svg';
import iconFiltro from './assets/icon-filtro.svg';
import iconFecharModal from './assets/icon-fechar-modal.svg';
import iconSetaCima from './assets/icon-seta-cima.svg';
import iconSetaBaixo from './assets/icon-seta-baixo.svg';

function App() {
  //dados
  const diasDaSemama = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
  const [registros, setRegistros] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [filtros, setFiltros] = useState([]);
  //--.--

  //abrir e fechar modal e botoes
  const [filtro, setFiltro] = useState(false);
  const [adicionarRegistro, setAdicionarRegistro] = useState(false);
  const [editandoRegistro, setEditandoRegistro] = useState(false);
  const [limparFiltro, setLimparFiltro] = useState(false);
  //--.--

  //controle de informacoes
  const [resumoEntrada, setResumoEntrada] = useState(0);
  const [resumoSaida, setResumoSaida] = useState(0);
  const [resumoSaldo, setResumoSaldo] = useState(0);
  const [modalEntradaSaidaBtn, setModalEntradaSaidaBtn] = useState(1);
  const [atualizarRegistrosId, setAtualizarRegistrosId] = useState(0);
  //--.--

  //inputs
  const [valor, setValor] = useState('');
  const [categoria, setCategoria] = useState('');
  const [data, setData] = useState('');
  const [descricao, setDescricao] = useState('');
  const [filtroValorMin, setFiltroValorMin] = useState('');
  const [filtroValorMax, setFiltroValorMax] = useState('');
  //--.--

  //ordenar por colunas
  const [ordData, setOrdData] = useState(false);
  const [ordDia, setOrdDia] = useState(false);
  const [ordValor, setOrdValor] = useState(false);
  //--.--

  function handleFiltro() {
    const ativarDesativarFiltro = filtro === false ? true : false;

    setFiltro(ativarDesativarFiltro);
  }

  function handleAdicionarRegistro() {
    const ativarDesativarAdicionarRegistro = adicionarRegistro === false ? true : false;

    if (!ativarDesativarAdicionarRegistro) {
      setEditandoRegistro(false);
    }

    if (!ativarDesativarAdicionarRegistro) {
      setValor('');
      setCategoria('');
      setData('');
      setDescricao('');
      setModalEntradaSaidaBtn(1);
    }

    setAdicionarRegistro(ativarDesativarAdicionarRegistro);
  }

  function handleModalEntradaBtn() {
    setModalEntradaSaidaBtn(0);
  }

  function handleModalSaidaBtn() {
    setModalEntradaSaidaBtn(1);
  }

  function handleOrdData() {
    let ord = 0;

    if (ordData === false) {
      setOrdValor(false);
      setOrdDia(false);
      setOrdData(0);
    } else {
      ord = ordData === 0 ? 1 : 0;

      setOrdData(ord);
    }

    if (ord === 0 && registros.length > 0) {

      const reg = registros.sort((a, b) => new Date(a.date) - new Date(b.date));

      setRegistros(reg);
      return;
    }

    if (ord === 1 && registros.length > 0) {
      const reg = registros.sort((a, b) => new Date(b.date) - new Date(a.date));

      setRegistros(reg);
      return;
    }
  }

  function handleOrdDia() {
    let ord = 0;

    if (ordDia === false) {
      setOrdData(false);
      setOrdValor(false);
      setOrdDia(0);
    } else {
      ord = ordDia === 0 ? 1 : 0;

      setOrdDia(ord);
    }

    if (ord === 0 && registros.length > 0) {
      const reg = registros.sort((a, b) => a.week_day - b.week_day);

      setRegistros(reg);
      return;
    }

    if (ord === 1 && registros.length > 0) {
      const reg = registros.sort((a, b) => b.week_day - a.week_day);

      setRegistros(reg);
      return;
    }
  }

  function handleOrdValor() {
    let ord = 0;

    if (ordValor === false) {
      setOrdData(false);
      setOrdDia(false);
      setOrdValor(0);
    } else {
      ord = ordValor === 0 ? 1 : 0;

      setOrdValor(ord);
    }

    if (ord === 0 && registros.length > 0) {
      const reg = registros.sort((a, b) => a.value - b.value);

      setRegistros(reg);
      return;
    }

    if (ord === 1 && registros.length > 0) {
      const reg = registros.sort((a, b) => b.value - a.value);

      setRegistros(reg);
      return;
    }
  }

  function handleLimparFiltro() {
    setFiltroValorMin('');
    setFiltroValorMax('');
    setLimparFiltro(true);
    setFiltros([]);
    handleCarregarRegistros();
  }

  function handleFiltrar() {
    const filtrosArr = filtros;
    let filtrarPorDia = [];
    let filtrarPorCategoria = [];
    let registrosFiltrado = [];
    let valorMax = parseFloat(filtroValorMax);
    let valorMin = parseFloat(filtroValorMin);

    for (let i = 0; i < filtrosArr.length; i++) {
      if (filtrosArr[i].coluna === 0) {
        switch (filtrosArr[i].categoria) {
          case 'Domingo': filtrarPorDia.push(0); break;
          case 'Segunda': filtrarPorDia.push(1); break;
          case 'Terça': filtrarPorDia.push(2); break;
          case 'Quarta': filtrarPorDia.push(3); break;
          case 'Quinta': filtrarPorDia.push(4); break;
          case 'Sexta': filtrarPorDia.push(5); break;
          case 'Sábado': filtrarPorDia.push(6); break;
          default: break;
        }
      } else {
        filtrarPorCategoria.push(filtrosArr[i].categoria);
      }
    }

    if (filtrarPorDia.length > 0) {
      for (let filtro of filtrarPorDia) {
        for (let item of registros) {
          if (filtro === item.week_day) {
            if (registrosFiltrado.findIndex(i => i === item) === -1) {
              registrosFiltrado.push(item);
            }
          }
        }
      }

      if (valorMin) {
        registrosFiltrado = registrosFiltrado.filter(item => item.value >= valorMin);
      }

      if (valorMax) {
        registrosFiltrado = registrosFiltrado.filter(item => item.value <= valorMax);
      }
    }

    if (filtrarPorCategoria.length > 0) {
      for (let filtro of filtrarPorCategoria) {
        for (let item of registros) {
          if (filtro === item.category) {
            if (registrosFiltrado.findIndex(i => i === item) === -1) {
              registrosFiltrado.push(item);
            }
          }
        }
      }

      if (valorMin) {
        registrosFiltrado = registrosFiltrado.filter(item => item.value >= valorMin);
      }

      if (valorMax) {
        registrosFiltrado = registrosFiltrado.filter(item => item.value <= valorMax);
      }
    }

    if (filtrarPorDia.length !== 0 && filtrarPorCategoria.length !== 0) {
      let registrosFiltradoPorDiaECategoria = [];

      for (let filtroDia of filtrarPorDia) {
        for (let filtroCategoria of filtrarPorCategoria) {
          for (let item of registrosFiltrado) {
            if (filtroDia === item.week_day && filtroCategoria === item.category) {
              if (registrosFiltradoPorDiaECategoria.findIndex(i => i === item) === -1) {
                registrosFiltradoPorDiaECategoria.push(item);
              }
            }
          }
        }
      }

      setRegistros(registrosFiltradoPorDiaECategoria);
      return;
    }

    if (filtrarPorDia.length === 0 && filtrarPorCategoria.length === 0) {
      registrosFiltrado = registros;

      if (valorMin) {
        registrosFiltrado = registrosFiltrado.filter(item => item.value >= valorMin);
      }

      if (valorMax) {
        registrosFiltrado = registrosFiltrado.filter(item => item.value <= valorMax);
      }
    }

    setRegistros(registrosFiltrado)
  }

  //crud
  async function handleCarregarRegistros() {
    try {
      const response = await fetch('http://localhost:3333/transactions', {
        method: 'GET'
      });

      const data = await response.json();

      let categoria = [];

      for (let item of data) {
        let categoriaFormatado = item.category[0].toUpperCase() + item.category.substr(1).toLowerCase();

        if (item.category && categoria.indexOf(categoriaFormatado) === -1) {
          categoria.push(categoriaFormatado);
        }
      }

      setOrdData(false);
      setOrdDia(false);
      setOrdValor(false);
      setCategorias(categoria);
      setRegistros(data);
    } catch (error) {
      alert('Não foi possível carregar os Registros.');
    }
  }

  async function handleRegistrar() {
    try {
      if (!valor || !categoria || !data || !descricao) {
        return alert('Todos os campos devem ser preenchidos.');
      }

      let valorNumber = parseFloat(valor);

      if (isNaN(valorNumber)) {
        return alert('O valor deve ser válido.');
      }

      if (valorNumber < 0) {
        valorNumber = (valorNumber) - (valorNumber) - (valorNumber);
      }

      const dataArr = data.split('/');
      let dataStr = dataArr[1] + '/'.concat(dataArr[0] + '/', dataArr[2]);
      const dataFormatada = new Date(dataStr);

      if ((dataFormatada).toLocaleDateString('pt-BR') === 'Invalid Date') {
        return alert('Data inválida.');
      }

      let diaDaSemana = dataFormatada.getDay();

      const categoriaFormatado = categoria[0].toUpperCase() + categoria.substr(1).toLowerCase();

      const body = {
        date: dataFormatada,
        week_day: diaDaSemana,
        description: descricao,
        value: valorNumber,
        category: categoriaFormatado,
        type: modalEntradaSaidaBtn === 0 ? 'credit' : 'debit'
      };

      await fetch('http://localhost:3333/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      handleCarregarRegistros();
      setValor('');
      setCategoria('');
      setData('');
      setDescricao('');
      setModalEntradaSaidaBtn(1);
      setAdicionarRegistro(false);
    } catch (error) {
      alert('Não foi possível adicionar o Registro.');
    }
  }

  async function handleAtualizarRegistro() {
    try {
      if (!valor || !categoria || !data || !descricao) {
        return alert('Todos os campos devem ser preenchidos.');
      }

      let valorNumber = parseFloat(valor);

      if (isNaN(valorNumber)) {
        return alert('O valor deve ser válido.');
      }

      if (valorNumber < 0) {
        valorNumber = (valorNumber) - (valorNumber) - (valorNumber);
      }

      const dataArr = data.split('/');
      let dataStr = dataArr[1] + '/'.concat(dataArr[0] + '/', dataArr[2]);
      const dataFormatada = new Date(dataStr);

      if ((dataFormatada).toLocaleDateString('pt-BR') === 'Invalid Date') {
        return alert('Data inválida.');
      }

      let diaDaSemana = dataFormatada.getDay();

      const categoriaFormatado = categoria[0].toUpperCase() + categoria.substr(1).toLowerCase();

      const body = {
        date: dataFormatada,
        week_day: diaDaSemana,
        description: descricao,
        value: valorNumber,
        category: categoriaFormatado,
        type: modalEntradaSaidaBtn === 0 ? 'credit' : 'debit'
      };

      await fetch(`http://localhost:3333/transactions/${atualizarRegistrosId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      handleCarregarRegistros();
      setValor('');
      setCategoria('');
      setData('');
      setDescricao('');
      setModalEntradaSaidaBtn(1);
      setAdicionarRegistro(false);
      setEditandoRegistro(false);
    } catch (error) {
      alert('Não foi possível atualizar o registro.');
    }
  }

  //effects
  useEffect(() => {
    handleCarregarRegistros();
  }, []);

  useEffect(() => {
    function atualizarResumo() {
      let entrada = 0, saida = 0, saldo = 0;

      for (let item of registros) {
        if (item.type === 'credit') {
          entrada += item.value;
        }

        if (item.type === 'debit') {
          saida += item.value;
        }
      }

      saldo = entrada - saida;

      setResumoEntrada(entrada);
      setResumoSaida(saida);
      setResumoSaldo(saldo);
    }

    atualizarResumo();
  }, [registros]);

  return (
    <div className="App">
      <header className="header">
        <div className="header__logo">
          <img src={logo} alt="Logo" />
          <h1 className="logo__title">Dindin</h1>
        </div>
      </header>
      <main className="card">
        <button className="btn--filtrar" onClick={handleFiltro}><img src={iconFiltro} alt="Filtrar" /> Filtrar</button>
        <div className="card__resumo">
          <div className='resumo__itens'>
            <h2 className="resumo__title">Resumo</h2>
            <div className="resumo__item">
              <span className="resumo__entrada-saida-texto">Entradas</span>
              <span className="resumo__valor-entrada">{resumoEntrada.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            </div>
            <div className="resumo__item">
              <span className="resumo__entrada-saida-texto">Saídas</span>
              <span className="resumo__valor-saida">{resumoSaida.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            </div>
            <div className="resumo__item-saldo">
              <span className="resumo__saldo-texto">Saldo</span>
              <span className="resumo__valor-saldo">{resumoSaldo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            </div>
          </div>
          <button className="resumo__btn" onClick={handleAdicionarRegistro}>Adicionar Registro</button>
        </div>
        <div className={`card__filtrar ${filtro ? '' : 'display--none'}`}>
          <div className="filtrar__dia-semana">
            <h3 className="filtrar__title">Dia da semana</h3>
            <div className="filtrar__itens">
              {diasDaSemama.map((item, key) =>
                <FiltrarBtn
                  key={key}
                  filtros={filtros}
                  setFiltros={setFiltros}
                  limparFiltro={limparFiltro}
                  setLimparFiltro={setLimparFiltro}
                  coluna={0}>
                  {item}
                </FiltrarBtn>)}
            </div>
          </div>
          <div className="filtrar__categoria">
            <h3 className="filtrar__title">Categoria</h3>
            <div className="filtrar__itens">
              {categorias.map((item, key) =>
                <FiltrarBtn
                  key={key}
                  filtros={filtros}
                  setFiltros={setFiltros}
                  limparFiltro={limparFiltro}
                  setLimparFiltro={setLimparFiltro}
                  coluna={1}>
                  {item}
                </FiltrarBtn>)}
            </div>
          </div>
          <div className="filtrar__valor">
            <h3 className="filtrar__title">Valor</h3>
            <label className="filtrar__label" htmlFor="valor-min">Min</label>
            <input className="filtrar__input" type="number" id="valor-min" value={filtroValorMin} onChange={(e) => setFiltroValorMin(e.target.value)} />
            <label className="filtrar__label" htmlFor="valor-max">Max</label>
            <input className="filtrar__input" type="number" id="valor-max" value={filtroValorMax} onChange={(e) => setFiltroValorMax(e.target.value)} />
          </div>
          <div className="filtrar__limpar-aplicar">
            <div className="filtrar__limpar-aplicar-btn">
              <button className="filtrar__limpar-filtros-btn" onClick={handleLimparFiltro}>Limpar Filtros</button>
              <button className="filtrar__aplicar-filtros-btn" onClick={handleFiltrar}>Aplicar Filtros</button>
            </div>
          </div>
        </div>
        <div className="card__registros">
          <table className="registros__tabela">
            <thead>
              <tr className="registros__linha-titulo">
                <td className="registros__item-titulo cursor--pointer" onClick={handleOrdData}>Data <img className={ordData === false ? 'display--none' : ''} src={ordData === 0 ? iconSetaCima : iconSetaBaixo} alt="icon" /></td>
                <td className="registros__item-titulo cursor--pointer" onClick={handleOrdDia}>Dia da semana  <img className={ordDia === false ? 'display--none' : ''} src={ordDia === 0 ? iconSetaCima : iconSetaBaixo} alt="icon" /></td>
                <td className="registros__item-titulo">Descrição</td>
                <td className="registros__item-titulo">Categoria</td>
                <td className="registros__item-titulo cursor--pointer" onClick={handleOrdValor}>Valor  <img className={ordValor === false ? 'display--none' : ''} src={ordValor === 0 ? iconSetaCima : iconSetaBaixo} alt="icon" /></td>
                <td></td>
                <td></td>
              </tr>
            </thead>
            <tbody>
              {registros.map(item =>
                <Registro
                  key={item.id}
                  item={item}
                  handleCarregarRegistros={handleCarregarRegistros}
                  setEditandoRegistros={setEditandoRegistro}
                  setAtualizarRegistrosId={setAtualizarRegistrosId}
                  handleAdicionarRegistro={handleAdicionarRegistro}
                  setValor={setValor}
                  setCategoria={setCategoria}
                  setData={setData}
                  setDescricao={setDescricao}
                  setModalEntradaSaidaBtn={setModalEntradaSaidaBtn}
                />)}
            </tbody>
          </table>
        </div>
      </main>
      <div className={`modal ${!adicionarRegistro ? 'display--none' : ''}`}>
        <div className="modal__adicionar-registro">
          <div className="adicionar-registro__title-fechar-btn">
            <h3 className="adicionar-registro__title">{editandoRegistro ? 'Editar Registro' : 'Adicionar Registro'}</h3>
            <img className="adicionar-registro__fechar-btn" src={iconFecharModal} onClick={handleAdicionarRegistro} alt="Fechar" />
          </div>
          <div className="adicionar-registro__entrada-saida">
            <button
              className={`adicionar-registro__entrada-btn ${modalEntradaSaidaBtn === 0 ? 'entrada-btn--ativo' : ''}`}
              onClick={handleModalEntradaBtn}
            >
              Entrada
            </button>
            <button
              className={`adicionar-registro__saida-btn ${modalEntradaSaidaBtn === 1 ? 'saida-btn--ativo' : ''}`}
              onClick={handleModalSaidaBtn}
            >
              Saída
            </button>
          </div>
          <label className="adicionar-registro__label" htmlFor="valor">Valor</label>
          <input className="adicionar-registro__input" type="number" id="valor" value={valor} onChange={(e) => setValor(e.target.value)} />
          <label className="adicionar-registro__label" htmlFor="categoria">Categoria</label>
          <input className="adicionar-registro__input" type="text" id="categoria" value={categoria} onChange={(e) => setCategoria(e.target.value)} />
          <label className="adicionar-registro__label" htmlFor="data">Data</label>
          <InputMask className="adicionar-registro__input" mask="99/99/9999" id="data" value={data} onChange={(e) => setData(e.target.value)} />
          <label className="adicionar-registro__label" htmlFor="descricao">Descrição</label>
          <input className="adicionar-registro__input" type="text" id="descricao" value={descricao} onChange={(e) => setDescricao(e.target.value)} />
          <button className="adicionar-registro__submit-btn" onClick={editandoRegistro ? handleAtualizarRegistro : handleRegistrar}>Confirmar</button>
        </div>
      </div>
    </div >
  );
}

export default App;