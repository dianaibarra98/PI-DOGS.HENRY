import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { getMoods, postDog } from '../../redux/actions';
import '../createDog/createDog.css'


const validate = (input) => {
    let errors = {}
    if(!input.name){
        errors.name = 'Indica un nombre,  humano! WOOF!!!'
    }
    if(!input.height || input.height <= 0){
        errors.height = 'Indica un numero mayor , ni mis cachorros miden eso WOOF!!!'
    }
    if(input.height){
        if (!/^[0-9]*$/){
            errors.height = 'Woof... ¿Como pusiste letras? Solo numeros WOOF WOOF WOOF WOOF WOOF AARRGGHHH'
        }
    }
    if (!input.weight_min || input.weight_min <= 0){
        errors.weight_min = 'Indica un numero mayor , ni mis cachorros pesan eso WOOF!!!'
    }

    if(input.weight_min){
        if(input.weight_max){
            if (!/^[0-9]*$/) {
                errors.weight_min = 'Woof... ¿Como pusiste letras? Solo numeros WOOF WOOF WOOF WOOF WOOF AARRGGHHH'
            }
        }
    }
    
    if (!input.weight_max || input.weight_max <= 0){
        errors.weight_max = 'Indica un numero mayor , ni mis cachorros pesan eso WOOF!!!'
    }
    if(input.weight_max){
        if (!/^[0-9]*$/) {
            errors.weight_max = 'Woof... ¿Como pusiste letras? Solo numeros WOOF WOOF WOOF WOOF WOOF AARRGGHHH'
        }
    }

    if (!input.lifeTime || input.lifeTime <= 0){
        errors.lifeTime = '... De verdad espero que nadie tenga ese tiempo de vida, woof triste :c'
    }
    if(input.lifeTime){

        if (!/^[0-9]*$/) {
            errors.lifeTime = 'Woof... ¿Como pusiste letras? Solo numeros WOOF WOOF WOOF WOOF WOOF AARRGGHHH'
        }
    }
    return errors

}


const CreateDog = () => {

    const dispatch = useDispatch();

    const history = useHistory()

    const allMoods = useSelector((state) => state.allMoods)

    const [errors , setErrors] = useState({})

    const [input, setInput] = useState({
        name : "",
        height:0,
        weight_min:0,
        weight_max:0,
        lifeTime:0,
        image : "",
        mood:[]
    })

    const handleChange = (e) =>{
        setInput({
            ...input,
            [e.target.name]: e.target.value,
        })
        console.log(e.target.value)
        setErrors(validate({
            ...input,
            [e.target.name] : e.target.value
        }))
        console.log(input)
    }

    useEffect(() => {
        dispatch(getMoods()) 
    },[dispatch])

    const handleSelect = (e) => {
        setInput({
            ...input,
            mood : [...input.mood, e.target.value]
        })
    }

    const handleSubmit = (e) =>{
        e.preventDefault()
        console.log(input)
        dispatch(postDog(input))

        alert("Guau guau creado con croquetas")
        setInput({
            name: "",
            height: 0,
            weight_min: 0,
            weight_max: 0,
            lifeTime: 0,
            mood: []
        })
        history.push('/home')
    }

    const handleErase = (e) => {
        setInput({
            ...input,
            mood : input.mood.filter(d => d !== e)
        })
    }

    // hacer un handle que los borre del estado

    return(

        <div className='background'>
            
            <Link to ="/home">
                <button className='btn'>
                    Volver
                </button>
            </Link>
            <h1>
                Crear Guau Guau 
            </h1>

        <div className='contenedor'>
                    
            <form className='formStyle' onSubmit={e => handleSubmit(e)} >

        <div>
            <h3>Nombre:</h3>
            <input className='numInput' type='text' value={input.name} name="name"  onChange={e => handleChange(e)} />

        </div>

        <div>
            <h3>Altura</h3>
            <input className='numInput' type='number' value={input.height} name='height' onChange = { e => handleChange(e)}  />
        </div>

        <div>
        <h3>Peso minimo </h3>
        <input className='numInput' type='number' value={input.weight_min} name="weight_min" onChange={e => handleChange(e)} />
        </div>

        <div>
        <h3>Peso Maximo </h3>
        <input className='numInput' type='number' value={input.weight_max} name="weight_max" onChange={e => handleChange(e)} />
        </div>


        <div>
            <h3>Tiempo de vida </h3>
            <input className='numInput' type='number' value={input.lifeTime} name="lifeTime" onChange={e => handleChange(e)} />
        </div>
        <div>

            {/* <label>Imagen </label>
            <input className='numInput' type='text' value={input.image} name="image" onChange={e => handleChange(e)} /> */}
        </div>
            <h2>Temperamentos</h2>
            <select  className='moodStyle' onChange={e => handleSelect(e)} >
                <option value="all">protomood</option>
                {
                    allMoods.map(e => {
                        
                        return (
                            <option value={e.name} key={e.id}>{e.name}</option>
                            )
                        })
                    }
            </select>

                {errors && (
                errors.name ||
                errors.height ||
                errors.weight_min||
                errors.weight_max ||
                errors.lifeTime ||
                errors.mood||
                !input.name.length ||
                input.height <= 0||
                input.weight_min <= 0 ||
                input.weight_max <= 0 ||
                input.lifeTime <= 0 ||
                !input.mood.length
                ?
                <h3>Guau Guau no puede ser creado aún</h3>
                :
                <button className='btn' type='submit'>Crear guau guau</button>
                
           ) }
                </form>
         
                  <div className='moodDiv'>
                        {input.mood.map((d , i) => {
                            return (
                                <div key={i++}>
                            <h2 > {d} </h2>
                            <button className='searchBtn' onClick={() => handleErase(d)}>X</button>
                            </div>
                                )
                            })
                        }
                        </div>
                        
                <div className='errorStyle'>
                <h1>Errores :</h1>
                <div>
                <div className='errorStyle'> {/* toca corregir esto porfa*/}

            <h2>
             {errors.name && (<p> {errors.name} </p>)}
            </h2>

            <h2>
            {errors.height && (<p> {errors.height} </p>)}
            </h2>

            <h2>
            {errors.weight_min && (<p> {errors.weight_min} </p>)}
            </h2>

            <h2>
            {errors.weight_max && (<p> {errors.weight_max} </p>)}
            </h2>
            
            <h2>
            {errors.lifeTime && (<p> {errors.lifeTime} </p>)}
            </h2>
                <h1>Esto debe quedar vacío para crear tu guau guau</h1>

                </div>

                </div>
                </div>
                        
                        </div>
            </div>
                        
            //checar que diablos hacer con la image
    )


}

export default CreateDog