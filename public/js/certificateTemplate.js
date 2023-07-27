import { dominio } from "./dominio.js"

window.addEventListener('load',async()=>{

    const selectTypeOfCourse = document.getElementById('selectTypeOfCourse')
    const text1 = document.getElementById('text1')
    
    selectTypeOfCourse.addEventListener("change",async(e)=>{
        if (selectTypeOfCourse.value == 'default' || selectTypeOfCourse.value == 'theoretical-practical') {
            text1.innerHTML = 'Aprobó el curso teórico ( <input type="number" class="hours" placeholder="horas"> hs) / práctico ( <input type="number" class="hours" placeholder="horas"> hs) <b><input type="text" placeholder="Nombre del curso" class="courseName"></b>'
        }
        if (selectTypeOfCourse.value == 'theoretical') {
            text1.innerHTML = 'Aprobó el curso teórico ( <input type="number" class="hours" placeholder="horas"> hs) <b><input type="text" placeholder="Nombre del curso" class="courseName"></b>'
        }
        if (selectTypeOfCourse.value == 'practical') {
            text1.innerHTML = 'Aprobó el curso práctico ( <input type="number" class="hours" placeholder="horas"> hs) <b><input type="text" placeholder="Nombre del curso" class="courseName"></b>'
        }
    
    })
    
})