import React, { Component } from 'react';
import $ from 'jquery';
import InputCustomizado from './componentes/InputCustomizado';
import ButtonCustomizado from './componentes/ButtonCustomizado';
import Pubsub from 'pubsub-js';
import TratadorErros from './TratadorErros';


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
          url:'https://cdc-react.herokuapp.com/api/autores',
          contentType: 'application/json',
          dataType:'json',
          type:'post',
          data: JSON.stringify({nome:this.state.nome,email:this.state.email,senha:this.state.senha}),
          success: function(resposta){
            Pubsub.publish('atualiza-lista-autores',resposta);
            this.setState({nome:'',email:'',senha:''});
          }.bind(this),
          error: function(resposta){
            if (resposta.status === 400) {
                new TratadorErros().publicaErros(resposta.responseJSON);
            }
          },
          beforeSend: function(){
              Pubsub.publish("limpa-erros",{});
          }
        });
    }

    salvaAlteracao(nomeInput,evento){
        var campo = {}; //vria um json
        campo[nomeInput] = evento.target.value; //atributo recebe valor
        this.setState(campo);
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
                    <InputCustomizado id="nome" type="text" name="nome" value={this.state.nome} onChange={this.salvaAlteracao.bind(this,'nome')} label="Nome" />
                    <InputCustomizado id="email" type="email" name="email" value={this.state.email} onChange={this.salvaAlteracao.bind(this,'email')} label="E-mail"/>
                    <InputCustomizado id="senha" type="password" name="senha" value={this.state.senha} onChange={this.salvaAlteracao.bind(this,'senha')} label="Senha"/>
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
                <div className="header">
                    <h1>Cadastro de Autores</h1>
                </div>
                <br/>
                <div className="content" id="content">
                    <FormularioAutor/>
                    <TabelaAutores lista={this.state.lista}/>
                </div>
            </div>
        );
    }
}    