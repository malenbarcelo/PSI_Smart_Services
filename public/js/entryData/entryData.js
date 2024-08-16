
import { dominio } from "../dominio.js"

window.addEventListener('load',async()=>{

    dni.addEventListener("change",async(e)=>{
        if (dni.value != '') {

            const findImage = await (await fetch(dominio + 'apis/find-image/' + dni.value)).json()

            if (findImage == null) {
                uploadImage.style.display = 'block'                
            }else{
                uploadImage.style.display = 'none'
            }
        }
        
    })

    //acceptBtn
    acceptBtn.addEventListener("click",async(e)=>{
        e.preventDefault()
        if (condition) {
            
        }
        console.log('hola')

    })


})