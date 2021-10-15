import { useState } from 'react';

import './styles.css';

import iconEditar from '../../assets/icon-editar.svg';
import iconLixo from '../../assets/icon-lixo.svg';
import iconPolygon from '../../assets/icon-polygon.svg';

function Registro({
    item,
    handleCarregarRegistros,
    setEditandoRegistros,
    setAtualizarRegistrosId,
    handleAdicionarRegistro,
    setValor,
    setCategoria,
    setData,
    setDescricao,
    setModalEntradaSaidaBtn
}) {
    const [modalDeletar, setModalDeletar] = useState(false);

    let dataFormatada = new Date(item.date);
    dataFormatada = (dataFormatada).toLocaleDateString('pt-BR');

    let diaDaSemana = '';
    switch (item.week_day) {
        case 0: diaDaSemana = 'Domingo'; break;
        case 1: diaDaSemana = 'Segunda'; break;
        case 2: diaDaSemana = 'Terça'; break;
        case 3: diaDaSemana = 'Quarta'; break;
        case 4: diaDaSemana = 'Quinta'; break;
        case 5: diaDaSemana = 'Sexta'; break;
        case 6: diaDaSemana = 'Sábado'; break;
        default: break;
    }

    function handleModalDeletar() {
        const abrirFecharModal = modalDeletar ? false : true;

        setModalDeletar(abrirFecharModal);
    }

    function handleNaoBtn() {
        setModalDeletar(false);
    }

    async function handleSimBtn() {
        handleDeletarRegistro();
    }

    async function handleDeletarRegistro() {
        try {
            await fetch(`http://localhost:3333/transactions/${item.id}`, {
                method: 'DELETE'
            });

            handleCarregarRegistros();
        } catch (error) {
            alert('Não foi possível deletar o registro.');
        }
    }

    function handleAtualizarRegistro() {
        setAtualizarRegistrosId(item.id);
        setEditandoRegistros(true);
        setValor(item.value);
        setCategoria(item.category);
        setData(dataFormatada)
        setDescricao(item.description)
        setModalEntradaSaidaBtn(item.type === 'credit' ? 0 : 1);
        handleAdicionarRegistro();
    }

    return (
        <tr className="registros__linha">
            <td className="registros__item font-weight--bold">{dataFormatada}</td>
            <td className="registros__item">{diaDaSemana}</td>
            <td className="registros__item">{item.description}</td>
            <td className="registros__item">{item.category}</td>
            <td className={`registros__item ${item.type === 'credit' ? 'valor--credit' : 'valor--debit'}`}>{item.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
            <td className="registros__editar-icon"><img src={iconEditar} alt="Editar" onClick={handleAtualizarRegistro} /></td>
            <td className="registros__lixo-icon">
                <img src={iconLixo} alt="Excluir" onClick={handleModalDeletar} />
                <div className={`modal__apagar-item ${modalDeletar ? '' : 'display--none'}`}>
                    <img className="apagar-item__icon" src={iconPolygon} alt="seta" />
                    <span className="apagar-item__title">Apagar item?</span>
                    <div className="apagar-item__sim-nao">
                        <button className="apagar-item__sim" onClick={handleSimBtn}>Sim</button>
                        <button className="apagar-item__nao" onClick={handleNaoBtn}>Não</button>
                    </div>
                </div>
            </td>
        </tr>
    );
}

export default Registro;