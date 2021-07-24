//Importing Modules
const express = require('express')
const mysql = require('mysql')
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser')
const upload = require('express-fileupload');
const process = require('process');

const urlencodedParser = bodyParser.urlencoded({ extended: false })

//Username and Password
const SenderEmail = process.env.useremail;
const SenderPassword = process.env.userpass;



//Seting Default PORT
const port = 3000

//Intiating Express Modules
const app = express()

app.set('view engine','ejs');
app.use(express.static(`public`));
app.use(upload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}))

//GETING Request from Server
app.get("/",function(req,res){
    res.sendFile(`${__dirname}/views/index.html`)
})

app.post('/login', urlencodedParser, function (req, res) {
    if(req.files){
        const file = req.files.attach;
        const fileName = file.name;
        // When using temporary file location, no need to copy file
        // file.mv(`${__dirname}/public/imgs/${fileName}`,(err)=>{
        //     if(err){
        //         console.log(err);
        //     }else{
        //         console.log("File has been Sent");
        //     }
        // })
        function NameOfFile(){
            return [fileName, file.tempFilePath];
        };
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: SenderEmail,
          pass: SenderPassword
        }
    });

    const mailOptions = {
        from: `${req.body.name} <luciferMorningstar@sachin.com>`,
        to: req.body.mail,
        subject: req.body.subject,
        html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
        <style>
        body{
            height: 100vh;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        img{
            height: 400px;
            width: 350px;
        }

        h1,strong{
            text-align: center;
            color: orangered;
            width: 100%;
            display: block;
            padding: 10px;
        }
        
        p{
            font-size: 15px;
            text-align: center;
            color: orangered;
            width: 100%;
        }
        </style>
        </head>
        <body>
            <div>
            <h1>Message From ${req.body.name}</h1>
            <strong>Your Message is: </strong>
            <p>${req.body.message}</p>
            </div>
            <img src="cid:unique@nodemailer.com"/>
        </body>
        </html>`,
        attachments: [{
            filename: NameOfFile()[0],
            path: `${NameOfFile()[1]}`,
            cid: 'unique@nodemailer.com' //same cid value as in the html img src
        }]
        
    };
      
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
          res.send(`<h1 style="font-size: 20px;color: red;text-align: center;width: 100%;font-family: sans-serif;padding: 30px;">Sorry, Your Message couldn't be Sent May Be the Reasons are: <br> ${error}</h1> <br> <a href='/' style='display: block;width: 100%;text-align: center;'>Go Back</a>`)
        } else {
            res.sendFile(`${__dirname}/views/index.html`)
        }
    });
})

//Listenning to PORT
app.listen(port,()=>{
    console.log(`Service has been started in http://localhost:${port}/`);
})
