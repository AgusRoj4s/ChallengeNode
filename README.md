# ChallengeNode

comandos utilizados para librerias:
-npm install -d nodemon
-npm install mongoose
-npm install uuid
-npm install bcryptjs
-npm install jsonwebtoken
-npm install express apollo-server-express cors dotenv
-npm install graphql-iso-date
-npm install -g -npm
-npm install dataloaders
-npm install graphql-resolvers

Herramientas utilizadas:
node/graphql/mongoose/robo3t/JTW/typeScript/apollo

Para ejecutar la Api primero desde la consola abierta dentro de la carpeta del proyecto ejecutar el comando "tsc -w"
como en la siguiente imagen:
https://raw.githubusercontent.com/Agusrojas12/ChallengeNode/master/screen/Captura.JPG

Una vez que compile sin errores y se hayan generado los archivos .js:
https://raw.githubusercontent.com/Agusrojas12/ChallengeNode/master/screen/Captura1.JPG

Desde la consola, ejecutar el proyecto con el comando "node server.js", o en su defecto teniendo instalado "-d nodemon" ejecutar el comando "npm run dev", como en la siguiente imagen:
https://raw.githubusercontent.com/Agusrojas12/ChallengeNode/master/screen/Captura2.JPG

Y se puede observar que esta corriendo en el localhost: 3005

Abrimos la URL : http://localhost:3005/graphql

y se abriria la siguiente interfaz: 
https://raw.githubusercontent.com/Agusrojas12/ChallengeNode/master/screen/Captura3.JPG

Se divide la api en UserAPI y RecipeAPI. En los archivos GRAPHQLRECIPES Y GRAPHQLUSER se encuentran las diferentes query y mutations para ejecutar dentro de Graphql (copiar y pegar)

Para logearse, hay que crear un usuario y luego ingresar con las mutation sign up/login.
Despues del login como se ve en la imagen, retorna un token. Ese token hay que copiarlo dentro del HTTP HEADERS de la siguiente forma:
{
  "Authorization" : "tokenRecibido"
}

Ahora ya estas logeado, se puede corroborar con query "getUser"
https://raw.githubusercontent.com/Agusrojas12/ChallengeNode/master/screen/Captura4.JPG


Copiar y pegar el HTTP Header en la pestaña de RecipeAPI (para estar logueado) y utilizar las distintas Mutation/Query:
https://raw.githubusercontent.com/Agusrojas12/ChallengeNode/master/screen/Captura5.JPG





