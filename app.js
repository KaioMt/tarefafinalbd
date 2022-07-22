const express = require("express");
const app = express();

const Pagamento = require("./models/Pagamento")
const Usuario = require("./models/Usuario")
const path=require ('path');//enderço de cada rota
const router=express.Router();// trabalha com as rotas
const moment = require('moment');
const handlebars = require("express-handlebars");


app.engine('handlebars', handlebars({
    defaultLayout: 'main',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
    helpers: {
        formatDate: (date) => {
            return moment(date).format('DD/MM/YYYY')
        }
    }
}))
app.set('view engine', 'handlebars')

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

//Rotas
router.get('/login', function(req, res){
    res.sendFile(path.join(__dirname+'/login.html'));
});

router.get('/sobre', function(req, res){
    res.sendFile(path.join(__dirname+'/sobre.html'));
});

router.get('/', function(req, res){
    res.sendFile(path.join(__dirname+'/index.html'));
});

router.post('/pagamento', function(req, res){
    
    Pagamento.create({
        nome: req.body.nome,
        valor: req.body.valor
    }).then(function(){
        res.redirect('/pagamento')
       
    }).catch(function(erro){
        res.send("Erro: Pagamento não foi cadastrado com sucesso!" + erro)
    })
     
});
router.get('/lista', function(req, res){
    Pagamento.findAll().then(function(pagamentos){
        res.render('pagamento', {pagamentos: pagamentos});
    })
    
});
router.get('/del-pagamento/:id', function(req, res){
    Pagamento.destroy({
        where: {'id': req.params.id}
    }).then(function(){
        res.redirect('/pagamento');
        /*res.send("Pagamento apagado com sucesso!");*/
    }).catch(function(erro){
        res.send("Pagamento não apgado com sucesso!");
    })
});
router.get('/edit-pet/:id', function(req, res){
    Pagamento.findByPk (req.params.id).then(function(pagamentos){
        res.render('editar', {pagamentos: pagamentos});
    })
});	
// login usuario
router.post('/loginuser', function(req, res){
    Usuario.findOne  ( {where: {  'email': req.body.email, 'senha': req.body.senha}}).then(function(usuario){
        res.render('editar', {usuario: usuario});
    })
});	

router.post('/edit-pet/:id', function(req, res){
    Pagamento.update(   
    {nome: req.body.nome,
    valor: req.body.valor},
    {where: {'id': req.params.id}}
    ).then(function(){
        res.redirect('/lista')
       
    }).catch(function(erro){
        res.send("Erro: Pagamento não foi cadastrado com sucesso!" + erro)
    })
     
});

//Rotas

router.get('/usuario', function(req, res){
    res.sendFile(path.join(__dirname+'/Usuario.html'));
});

router.get('/Status', function(req, res){
    res.sendFile(path.join(__dirname+'/status.html'));
});


router.post('/usuario', function(req, res){
    
    Usuario.create({
        nome: req.body.nome,
        email: req.body.email,
        senha: req.body.senha,
        nome_pet: req.body.nome_pet
    }).then(function(){
        res.redirect('/')
       
    }).catch(function(erro){
        res.send("Erro: Usuario não foi cadastrado com sucesso!" + erro)
    })
     
});

app.listen(3333);

console.log('Now the server is running in url: http://127.0.0.1:3333');
	
app.use('/',router);
app.use('/loginuser',router);
app.use('/sobre',router);
app.use('/usuario',router);
app.use('/Status',router);
app.use('/login',router);
app.use('/lista',router);
app.use('/del-pagamento/:id',router);
app.use('/edit-pagamento/:id',router);
app.use(express.static(__dirname + '/public'));



app.listen(8080);