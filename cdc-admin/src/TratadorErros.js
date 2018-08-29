import Pubsub from 'pubsub-js';

export default class TratadorErros {
    publicaErros(errors) {
        for (let i=0; i<errors.errors.length ;i++){
            let erro = errors.errors[i];
            Pubsub.publish("erro-validacao",erro);
        }    
    }
}