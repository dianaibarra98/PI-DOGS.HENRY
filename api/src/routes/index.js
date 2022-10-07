const { Router } = require('express');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const {Sequelize, Model} = require('sequelize')
const { Dogs , Moods } = require('../db')
const Op = Sequelize.Op

const axios = require('axios');
const router = Router();
const {API_KEY} = process.env







const getAllDogs = async () => {  // Llamo a todos los perros de la ambos lados
    
    const api = await axios.get(`https://api.thedogapi.com/v1/breeds`);
    const perrosApi = api.data.map(e => {
        return {
            image : e.image.url,
            name : e.name,
            mood : e.temperament,
            weight_min : parseInt(e.weight.imperial.split("-")[0]),
            weight_max : parseInt(e.weight.imperial.split("-")[1]),
            height: e.height.imperial,
            id : e.id,
            lifeTime : e.life_span
        }
    })
    
    let perrosDb = await Dogs.findAll({
            include: {
                model: Moods,
                attributes: ["name"],
                through:{
                    attributes:[]
                }
                
            }
        })
        
        let perros = perrosApi.concat(perrosDb)
        
        
        return perros
    }

    
    const getMood = async () => { // Busco todos los humores y los guardo en mi Db
        let mood = await Moods.findAll()
        if(mood.length === 0){
    
            const api = await axios.get(`https://api.thedogapi.com/v1/breeds?api_key=${API_KEY}`);
            // console.log(api)
            let perros =  api.data.map (el => el.temperament)
            
            // console.log("[" +moods+"]")
            
            
            
        perros = perros.join()
    
    
        perros = perros.split(",")
    
        perros = perros.map(e => e.trim())
    
        
        perros.forEach( async (e) => {
            
            if(e.length > 0){
                await Moods.findOrCreate({
                 where : {name : e}
                })
                
            }
    
        })
             mood = await Moods.findAll()
    
            }
            return  mood
            
        }

        
    // const getDogsByName = async (name) => {
        //     //perros     [{},{},{}]    
        //         // name.toLowerCase()
        //         // let dogs = await axios.get(`https://api.thedogapi.com/v1/breeds/search?q=${name}?api_key=${API_KEY}`)
        
        //         // return dogs
        //         let dogs  = await getApiDogs();
        //         let dbDogs = await getDbDogs();
        
        //         // let perros = [...dogs , dbDogs]
        
//         let search = await dogs.filter(dog => dog.name.toLowerCase().includes(name.toLowerCase()))


//         return search
// }

const DbDogId = async (id) => {   //Busco perros de mi Db por ID

    let dog = await Dogs.findByPk(id, {
        include : {
            model : Moods , 
            attributes : ["name"],
            through: {
                attributes: []
            }

        }
    })


    if(dog === null){
        throw Error ("Perro no encontrato, WOOF WOOF WOOOF")
    } 

    console.log(dog)
    return dog
}


const getDog = async (id) => {  //Busco perros de la API por id 
    let dogs = await getAllDogs()
    
    let foundDog = await dogs.find(d => d.id === parseInt(id))
    console.log(foundDog)
    if(!foundDog){
        throw Error("No hay guau guau api")
    }
    
    return foundDog
    
    
}

    
    const createDog = async (name,height,weight_min,weight_max, lifeTime ,mood) => {
                  
        try {


        let [newDog,created] = await Dogs.findOrCreate({

            where : {
                name,
                height,
                weight_min,
                weight_max,
                lifeTime,
                
            }})
            console.log("WOOF WOOF WOOF WOOF WOOF",created) 
            let moods = await Moods.findAll({
                where : {name : mood}
            })
            console.log(moods, "====el mood buscado===")
            let moods2 = moods.map(e => e.id);
            console.log(moods2 , "==esto es el moods2=")
            newDog.addMoods(moods2)
            console.log('====================')
            return "Perro creado con exito"
        } catch (error) {
            console.error(error)
        }
        }


router.get('/temperament', async(req,res) => { 
    try{
        let a = await getMood()
    res.status(200).json(a)
    
}catch(err){
    res.status(404).send('Toy malito')
}
})




router.get('/dogs', async(req,res) => {
    let{name} = req.query
    try {
        
        if(name){
            
            let dogs = await getAllDogs()
            let search = await dogs.filter(dog => dog.name.toLowerCase().includes(name.toLowerCase()))
                if(!search.length){
                    return res.status(404).send("No hay woof woof sniff sniff pffft")
                }
                return res.status(200).json(search)         
                }
                
                let perros = await getAllDogs() 
                
                return res.status(200).json(perros)
                
                
            } catch (error) {
                res.status(404).send({error : error.message})
            }
        })


        router.get("/dogs/:id", async(req,res) => {
            let {id} = req.params

            try {
                   if (id.length > 5) {
                        let dbDog = await DbDogId(id)
                        return res.status(200).json(dbDog)
                    }

                    let foundDog = await getDog(id)
                    return res.status(200).json(foundDog)
                
            } catch (error) {
             return res.status(404).send({Error : error.message})   
            }
            })
        

    
    
router.post("/dogs", async(req,res) => {
    // try{
        let {
            name,
            height,
            weight_min,
            weight_max,
            lifeTime,
            mood} = req.body
    const search = await Dogs.findOne({
        where: { name: name }
    })
    if (search) {
        return res.send("ya hay guau guau").status(304)
    }
            createDog(name,height,weight_min,weight_max,lifeTime, mood)
            
            return res.status(201).send("Guau guau creado con croquetas")
            
})

module.exports = router;














































// const { Router } = require('express');
// const {Sequelize, Model} = require('sequelize')
// const { API_KEY } = process.env;
// const { Dog, Temperament } = require('../db');
// const Op = Sequelize.Op
// const axios = require('axios');
// // Importar todos los routers;
// // Ejemplo: const authRouter = require('./auth.js');


// const router = Router();

// // Configurar los routers
// // Ejemplo: router.use('/auth', authRouter);
// const getApiInfo = async ()=> {
//   const apiUrl= await axios.get(`https://api.thedogapi.com/v1/breeds?api_key=${API_KEY}`)
//   const apiInfo = await apiUrl.data.map(e => {
//     return{
//       id: e.id,
//       name: e.name,
//       height: e.height.imperial,
//       // weight: e.weight.metric,
//       weight_min : parseInt(e.weight.imperial.split("-")[0]),
//       weight_max : parseInt(e.weight.imperial.split("-")[1]),
//       life_span: e.life_span,
//       image: e.image.url, 
//       temperament: e.temperament,
//     }
//   });
//   return apiInfo;
// }

// const getDbInfo = async ()=>{
//   return await Dog.findAll({
//     include: {
//       model: Temperament,
//       attributes: ['name'],
//       through:{
//         attributes: [],
//       }
//     }
//   })
// }


// const getAllDogs = async ()=>{
//   const apiInfo = await getApiInfo();
//   const dbInfo = await getDbInfo();
//   const infoTotal = apiInfo.concat(dbInfo);
//   return infoTotal
// }

// const getTemperament = async() =>{
//   const temperament = await Temperament.findAll()
//   if(!temperament){

//     const api= await axios.get(`https://api.thedogapi.com/v1/breeds?api_key=${API_KEY}`)
//     let perros = api.data.map(el=> el.temperament)

//     perros= perros.join()

//     perros= perros.split(',')
    
//     perros= perros.map(e => e.trim())

//     perros.forEach( async(e) => {
//       if(e.length > 0){
//         await Temperament.findOrCreate({
//           where: {
//             name: e
//           }
//         })
//       }
//     })
//     temperament = await Temperament.findAll()
//   }
//   return temperament
// }

// //.........................
// const DbDogId = async (id) => {   //Busco perros de mi Db por ID

//   let dog = await Dog.findByPk(id, {
//       include : {
//           model : Temperament, 
//           attributes : ["name"],
//           through: {
//               attributes: []
//           }

//       }
//   })


//   if(dog === null){
//       throw Error ("Perro no encontrato, WOOF WOOF WOOOF")
//   } 

//   console.log(dog)
//   return dog
// }

// const getDog = async (id) => {  //Busco perros de la API por id 
//   let dogs = await getApiInfo()
  
//   let foundDog = await dogs.find(d => d.id === parseInt(id))
//   console.log(foundDog)
//   if(!foundDog){
//       throw Error("No hay guau guau api")
//   }
  
//   return foundDog
  
  
// }

// const createDog = async (name,height,weight_min,weight_max, life_span, temperament) => {
                  
//   try {


//   let [newDog,created] = await Dogs.findOrCreate({

//       where : {
//           name,
//           height,
//           weight_min,
//           weight_max,
//           life_span,
          
//       }})
//       console.log("WOOF WOOF WOOF WOOF WOOF",created) 
//       let temperament = await Temperament.findAll({
//           where : {name : temperament}
//       })
//       console.log(temperament, "====el temperamento buscado===")
//       let temperament2 = temperament.map(e => e.id);
//       console.log(temperament2 , "==esto es el temperament2=")
//       newDog.addTemperament(temperament2)
//       console.log('====================')
//       return "Perro creado con exito"
//   } catch (error) {
//       console.error(error)
//   }
//   }


// router.get('/temperament', async(req,res) => { 
// try{
//   let a = await getMood()
// res.status(200).json(a)

// }catch(err){
// res.status(404).send('Toy malito')
// }
// })



// // router.get('/dogs', async (req, res)=>{
// //   const name = req.query.name
// //   let dogsTotal = getAllDogs();
// //   if(name){
// //     let dogName = await dogsTotal.filter(el => el.name.toLoweCase().includes(name.toLowerCase()))
// //     dogName.length 
// //     ? res.status(200).send(dogName)
// //     : res.status(404).send('no está el perro, :(')
// //   }else{
// //     let perros = await getAllDogs()              
// //     return res.status(200).json(perros)
// //     // res.status(200).send(dogsTotal)
// //   }
// // })
// //........rutas.........
// router.get('/dogs', async(req,res) => {
//   let{name} = req.query
//   try {
      
//       if(name){
          
//           let dogs = await getAllDogs()
//           let search = await dogs.filter(dog => dog.name.toLowerCase().includes(name.toLowerCase()))
//               if(!search.length){
//                   return res.status(404).send("No hay perrituuu")
//               }
//               return res.status(200).json(search)         
//               }
              
//               let perros = await getAllDogs() 
              
//               return res.status(200).json(perros)
              
              
//           } catch (error) {
//               res.status(404).send({error : error.message})
//           }
//       })

//       router.get("/dogs/:id", async(req,res) => {
//         let {id} = req.params

//         try {
//                if (id.length > 5) {
//                     let dbDog = await DbDogId(id)
//                     return res.status(200).json(dbDog)
//                 }

//                 let foundDog = await getDog(id)
//                 return res.status(200).json(foundDog)
            
//         } catch (error) {
//          return res.status(404).send({Error : error.message})   
//         }
//         })

// router.post("/dogs", async(req,res) => {
//   // try{
//        let {
//            name,
//            height,
//            weight_min,
//            weight_max,
//           life_span,
//           temperament} = req.body
//   const search = await Dog.findOne({
//       where: { name: name }
//   })
//    if (search) {
//        return res.send("ya hay guau guau").status(304)
//    }
//           createDog(name,height,weight_min,weight_max,life_span, temperament)
                  
//            return res.status(201).send("Guau guau creado con croquetas")
                  
// })
      
  



// module.exports = router;
