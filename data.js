const jsonfile = require('jsonfile-promised');
const fs = require('fs');
  

module.exports = {

    //create data file if it does not exist
    init(){
        let dir = __dirname + '/data/'
        if(!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }else{

            let file = dir + 'data.json';
            if(fs.existsSync(file)) return;

            let dados = {'tasks':[]}
            return jsonfile.writeFile(file,dados)
            .then(() => {
                console.log('Arquivo Criado')
            }).catch((err) => {
                console.log(err);
            });
        }
        
    },

    //get the data file content
    get(){
        let file = __dirname + '/data/data.json';
        return jsonfile.readFile(file);
    },
    
    //save the data file content
    save(json){
        let file = __dirname + '/data/data.json';
        if(fs.existsSync(file)){

            jsonfile.writeFile(file,json)
            .then(() => {
                console.log('Task alterada com sucesso!');
            }).catch((err) => {
                console.log(err);
            });

        }else{
            console.log('Cant save the data!');
        }
    },

}