import React, { useEffect, useState } from 'react';
import { database } from './firebaseConfig';
import { ref, get, set, update, remove } from 'firebase/database';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  const [dados, setDados] = useState(null);
  const [novaChave, setNovaChave] = useState('');
  const [novoValor, setNovoValor] = useState('');
  const [chaveAtualizacao, setChaveAtualizacao] = useState('');
  const [valorAtualizacao, setValorAtualizacao] = useState('');
  const [pesquisaChave, setPesquisaChave] = useState('');
  const [resultadoPesquisa, setResultadoPesquisa] = useState(null);

  useEffect(() => {
    const buscarDados = async () => {
      const dbRef = ref(database, 'chaveValor');
      const snapshot = await get(dbRef);
      if (snapshot.exists()) {
        setDados(snapshot.val());
      } else {
        console.log('Nenhum dado disponível');
      }
    };

    buscarDados();
  }, []);

  const criarChaveValor = async () => {
    if (novaChave.trim() === '' || novoValor.trim() === '') {
      console.log('Os campos de chave e valor não podem estar vazios.');
      return;
    }

    await set(ref(database, 'chaveValor/' + novaChave), novoValor);
    setNovaChave('');
    setNovoValor('');
    setDados(prevDados => ({
      ...prevDados,
      [novaChave]: novoValor
    }));
  };

  const atualizarChaveValor = async () => {
    if (chaveAtualizacao.trim() === '' || valorAtualizacao.trim() === '') {
      console.log('Os campos de chave e valor não podem estar vazios.');
      return;
    }

    const atualizacao = {
      valor: valorAtualizacao // Aqui está a estruturação correta do objeto
    };

    try {
      await update(ref(database, 'chaveValor/' + chaveAtualizacao), atualizacao);
      setDados(prevDados => ({
        ...prevDados,
        [chaveAtualizacao]: atualizacao // Aqui você está atualizando com o objeto atualizado, não apenas com o valor
      }));
      setChaveAtualizacao('');
      setValorAtualizacao('');
    } catch (error) {
      console.error('Erro ao atualizar chave-valor: ', error);
    }
  };

  const excluirChaveValor = async (chave) => {
    try {
      await remove(ref(database, 'chaveValor/' + chave));
      setDados(prevDados => {
        const novosDados = { ...prevDados };
        delete novosDados[chave];
        return novosDados;
      });
    } catch (error) {
      console.error('Erro ao remover chave-valor: ', error);
    }
  };
  
  const pesquisarChave = () => {
    if (pesquisaChave.trim() === '') {
      console.log('Por favor, insira uma chave para pesquisar.');
      return;
    }

    const resultado = dados[pesquisaChave];
    if (resultado) {
      setResultadoPesquisa(resultado);
    } else {
      console.log('Chave não encontrada.');
      setResultadoPesquisa(null);
    }
    setPesquisaChave('');
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1">Banco de Dados Chave Valor</span>
        </div>
      </nav>

      <div className="container mt-4">
        <div className="row">
          <div className="col">
            <h2>Criar Chave-Valor</h2>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Chave"
                value={novaChave}
                onChange={(e) => setNovaChave(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Valor"
                value={novoValor}
                onChange={(e) => setNovoValor(e.target.value)}
              />
            </div>
            <button className="btn btn-primary" onClick={criarChaveValor}>Criar Chave-Valor</button>
          </div>

          <div className="col">
            <h2>Atualizar Chave-Valor</h2>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Chave"
                value={chaveAtualizacao}
                onChange={(e) => setChaveAtualizacao(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Novo Valor"
                value={valorAtualizacao}
                onChange={(e) => setValorAtualizacao(e.target.value)}
              />
            </div>
            <button className="btn btn-primary" onClick={atualizarChaveValor}>Atualizar Chave-Valor</button>
          </div>
        </div>
      </div>
      <div className="container mt-4">
        <h2>Pesquisar por Chave</h2>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Chave"
            value={pesquisaChave}
            onChange={(e) => setPesquisaChave(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" onClick={pesquisarChave}>Pesquisar</button>

        {resultadoPesquisa && (
          <div className="mt-3">
            <h4>Resultado da Pesquisa</h4>
            <pre>{JSON.stringify(resultadoPesquisa, null, 2)}</pre>
          </div>
        )}
      </div>

      <div className="container mt-4">
        <h2>Chaves-Valores</h2>
        {dados ? (
          <table className="table">
            <thead>
              <tr>
                <th>Chave</th>
                <th>Valor</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(dados).map(([chave, valor]) => (
                <tr key={chave}>
                  <td>{chave}</td>
                  <td>{typeof valor === 'object' ? valor.valor : valor}</td>
                  <td>
                    <button className="btn btn-danger" onClick={() => excluirChaveValor(chave)}>Excluir</button>
                    <button className="btn btn-warning ms-1" onClick={() => { setChaveAtualizacao(chave); setValorAtualizacao(valor.valor); }}>Atualizar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Carregando dados...</p>
        )}
      </div>
    </div>
  );
}

export default App;
