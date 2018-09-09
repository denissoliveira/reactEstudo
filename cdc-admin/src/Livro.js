import React, { Component } from 'react';
import $ from 'jquery';
import InputCustomizado from './componentes/InputCustomizado';
import ButtonCustomizado from './componentes/ButtonCustomizado';
import Pubsub from 'pubsub-js';
import pubsub2 from 'pubsub-js';
import TratadorErros from './TratadorErros';


class FormularioLivro extends Component {

    constructor() {
        super();
        this.state = {titulo:'',preco:'',autorId:''};
        this.enviaForm = this.enviaForm.bind(this);
        this.setTitulo = this.setTitulo.bind(this);
        this.setPreco = this.setPreco.bind(this);
        this.setAutorId = this.setAutorId.bind(this);
    }

    enviaForm(evento){
        evento.preventDefault();
        $.ajax({
          url:'https://cdc-react.herokuapp.com/api/livros',
          contentType: 'application/json',
          dataType:'json',
          type:'post',
          data: JSON.stringify({titulo:this.state.titulo,preco:this.state.preco,autorId:this.state.autorId}),
          success: function(resposta){
            pubsub2.publish('atualiza-lista-livros',resposta);
            this.setState({titulo:'',preco:'',autorId:''});
          }.bind(this),
          error: function(resposta){
            if(resposta.status === 400) {
              new TratadorErros().publicaErros(resposta.responseJSON);
            }
        },
          beforeSend: function(){
            Pubsub.publish("limpa-erros",{});
          }
        });
    }

    setTitulo(evento){
        this.setState({titulo:evento.target.value});
    }
    
    setPreco(evento){
        this.setState({preco:evento.target.value});
    }
    
    setAutorId(evento){
        this.setState({autorId:evento.target.value});
    }

    render(){
        var autores = this.props.autores.map(function(autor){
            return <option key={autor.id} value={autor.id}>{autor.nome}</option>;
        });
        return(
            <div className="pure-form pure-form-aligned">
                <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm} method="post">
                    <InputCustomizado id="titulo" type="text" name="titulo" value={this.state.titulo} onChange={this.setTitulo} label="Título"/>                                              
                    <InputCustomizado id="Preco" type="text" name="preco" value={this.state.preco} onChange={this.setPreco} label="Preço"/>                                              
                    <div className="pure-control-group">
                        <label htmlFor="autorId">Autores</label>
                        <select value={this.state.autorId} id="autorId" name="autorId" onChange={this.setAutorId}>
                            <option value="">Selecione</option>
                            {autores}
                        </select>
                    </div>
                    <ButtonCustomizado label="Gravar" />
                </form>             
            </div>  
        );
    }
}

class TabelaLivros extends Component {
    render() {
        return(
            <div>            
                <table className="pure-table">
                    <thead>
                    <tr>
                        <th>Título</th>
                        <th>Preco</th>
                        <th>Autor</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.props.lista.map(livro => {
                            return (
                                <tr key={livro.id}>
                                    <td>{livro.titulo}</td>
                                    <td>{livro.preco}</td>
                                    <td>{livro.autor.nome}</td>
                                </tr>
                            );
                        })
                    }
                    </tbody>
                </table> 
            </div> 
        );
    }
}

export default class LivroBox extends Component {

    constructor() {
        super();
        this.state = {lista : [],autores:[]};
    }

    componentDidMount(){
        $.ajax({
            url: 'https://cdc-react.herokuapp.com/api/livros',
            dataType: 'json',
            success:function(resposta){
                this.setState({lista:resposta});
                }.bind(this)
        });

        $.ajax({
            url: "https://cdc-react.herokuapp.com/api/autores",
            dataType: 'json',
            success: function(data) {
                this.setState({autores: data});
                }.bind(this)
        });

        Pubsub.subscribe('atualiza-lista-livros',function(topico,novaLista){
            this.setState({lista:novaLista});
        }.bind(this));
    } 

    render(){
        return(
            <div>
                <div className="header">
                    <h1>Cadastro de Livros</h1>
                </div>
                <br/>
                <div className="content" id="content">
                    <FormularioLivro autores={this.state.autores}/>
                    <TabelaLivros lista={this.state.lista}/>
                </div>
            </div>
        );
    }
}    