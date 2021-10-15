import { useState, useEffect } from 'react';

import './styles.css';

import iconMais from '../../assets/icon-mais.svg';
import iconFechar from '../../assets/icon-fechar.svg';

function FiltrarBtn(props) {
    const [ativarDesativarBtn, setAtivarDesativarBtn] = useState(false);

    function handleAtivarDesativarBtn() {
        const ativarDesativar = ativarDesativarBtn === false ? true : false;
        const adicionar = props.filtros;

        if (ativarDesativar) {
            adicionar.push({ coluna: props.coluna, categoria: props.children });
        }

        if (!ativarDesativar) {
            adicionar.splice(adicionar.findIndex(x => x.categoria === props.children), 1);
        }

        props.setFiltros(adicionar);
        setAtivarDesativarBtn(ativarDesativar);
    }

    useEffect(() => {
        setAtivarDesativarBtn(false);
    }, [props.filtros]);

    return (
        <button
            className={`filtrar__btn-item ${ativarDesativarBtn ? 'ativado' : 'desativado'}`}
            onClick={handleAtivarDesativarBtn}
        >
            {props.children}
            <img src={ativarDesativarBtn ? iconFechar : iconMais}
                alt="icon"
            />
        </button>
    );
}

export default FiltrarBtn;