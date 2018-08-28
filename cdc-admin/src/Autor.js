import React, { Component } from 'react';
import $ from 'jquery';
import InputCustomizado from './componentes/InputCustomizado';
import ButtonCustomizado from './componentes/ButtonCustomizado';
import Pubsub from 'pubsub-js';


class FormularioAutor extends Component {

    constructor() {
        super();
        this.state = {nome:'',email:'',senha:''};
        this.enviaForm = this.enviaForm.bind(this);
        this.setNome =  this.setNome.bind(this);
        this.setEmail = this.setEmail.bind(this);
        this.setSenha = this.setSenha.bind(this);
    }

    enviaForm(evento) {
        evento.preventDefault();
        $.ajax({
          url: 'https://cdc-react.herokuapp.com/api/autores',
          contentType: 'application/json',
          dataType:'json',
          type:'post',
          data: JSON.stringify({nome:this.state.nome,email:this.state.email,senha:this.state.senha}),
          success: function(resposta){
            //this.props.callbackAtualizaListagem(resposta);
            Pubsub.publish('atualiza-lista-autores',resposta);
          },
          error: function(resposta){
            console.log("erro");
          }
        });
    }

    setNome(evento){
        this.setState({nome:evento.target.value});
    }

    setEmail(evento){
        this.setState({email:evento.target.value});
    }

    setSenha(evento){
        this.setState({senha:evento.target.value});
    }

    render(){
        return(
            <div className="pure-form pure-form-aligned">
                <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm} method="post">
                    <InputCustomizado id="nome" type="text" name="nome" value={this.state.nome} onChange={this.setNome} label="Nome" />
                    <InputCustomizado id="email" type="email" name="email" value={this.state.email} onChange={this.setEmail} label="E-mail"/>
                    <InputCustomizado id="senha" type="password" name="senha" value={this.state.senha} onChange={this.setSenha} label="Senha"/>
                    <ButtonCustomizado label="Gravar" />
                </form>             
            </div>  
        );
    }
}

class TabelaAutores extends Component {
    render() {
        return(
            <div>            
                <table className="pure-table">
                    <thead>
                    <tr>
                        <th>Nome</th>
                        <th>email</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.props.lista.map(autor => {
                            return (
                                <tr key={autor.id}>
                                <td>{autor.nome}</td>
                                <td>{autor.email}</td>
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

export default class AutorBox extends Component {

    constructor() {
        super();
        this.state = {lista : []};
    }

    //componentWillMount(){ /*chamada antes da invocação do render()*/
    //console.log("willMount");
    componentDidMount(){ /*chamada componentDidMount() é usado depois*/
        $.ajax({
            url: 'https://cdc-react.herokuapp.com/api/autores',
            dataType: 'json',
            success:function(resposta){
                this.setState({lista:resposta});
                }.bind(this) /*chama o this do react*/
        });
        Pubsub.subscribe('atualiza-lista-autores',function(topico,novaLista){
            this.setState({lista:novaLista});
        }.bind(this));
    } 

    render(){
        return(
            <div>
                <FormularioAutor callbackAtualizaListagem={this.atualizaListagem}/>
                <TabelaAutores lista={this.state.lista}/>
            </div>
        );
    }
}    