import React, { Component } from 'react';
import $ from 'jquery';
import InputCustomizado from './componentes/InputCustomizado';
import ButtonCustomizado from './componentes/ButtonCustomizado';
import Pubsub from 'pubsub-js';
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
          url:'http://localhost:8080/api/livros',
          contentType:'application/json',
          dataType:'json',
          type:'post',
          data: JSON.stringify({titulo:this.state.titulo,preco:this.state.preco,autorId:this.state.autorId}),
          success: function(novaListagem){
            //PubSub.publish('atualiza-lista-livros',novaListagem);
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
        this.setState({Titulo:evento.target.value});
    }
    
    setPreco(evento){
        this.setState({preco:evento.target.value});
    }
    
    setAutorId(evento){
        this.setState({autorId:evento.target.value});
    }

    render(){
        return(
            <div className="pure-form pure-form-aligned">
                <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm} method="post">
                    <InputCustomizado id="titulo" type="text" name="titulo" value={this.state.titulo} onChange={this.setTitulo} label="Título"/>                                              
                    <InputCustomizado id="Preco" type="text" name="preco" value={this.state.preco} onChange={this.setPreco} label="Preço"/>                                              
                    <InputCustomizado id="autorId" type="text" name="autorId" value={this.state.autorId} onChange={this.setAutorId} label="AutorId"/>         
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
                                    <td></td>
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
        this.state = {lista : []};
    }

    componentDidMount(){
        $.ajax({
            url: 'https://cdc-react.herokuapp.com/api/autores',
            dataType: 'json',
            success:function(resposta){
                this.setState({lista:resposta});
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
                    <FormularioLivro callbackAtualizaListagem={this.atualizaListagem}/>
                    <TabelaLivros lista={this.state.lista}/>
                </div>
            </div>
        );
    }
}    