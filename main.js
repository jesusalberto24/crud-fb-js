const db = firebase.firestore();
const formulario = document.querySelector('#formulario');
const listado = document.querySelector('#listado');

let editStatus = false;
let id = '';

const guardar = (titulo, descripcion) => {
    db.collection('tareas').doc().set({
        titulo,
        descripcion
    });
};

const obtenerTareas = () => db.collection('tareas').get();

const editarTarea = id => db.collection('tareas').doc(id).get();

const conseguir = callback => db.collection('tareas').onSnapshot(callback);

const eliminarTarea = id => db.collection('tareas').doc(id).delete();

const actualizar = (id, actualizarT) => db.collection('tareas').doc(id).update(actualizarT)

window.addEventListener('DOMContentLoaded', async (e) => {

    conseguir((querySnapshot) => {
        listado.innerHTML = '';
        querySnapshot.forEach(doc => {
            // console.log(doc.data());

            const tarea = doc.data();
            tarea.id = doc.id
            //console.log(tarea); Muestro en Consola el ID
            listado.innerHTML += `
            <div class="card card-body mt-4">
                <h5 class="text-center text-white bg-primary" >${tarea.titulo}</h5>
                <p>${tarea.descripcion}</p>
                   <div>
                    <button type="button" class="btn btn-secondary editar" data-id="${tarea.id}">🖉 Editar</button>
                    <button type="button" class="btn btn-danger eliminar" data-id="${tarea.id}">🗑 Eliminar</button>
                   </div>
            </div>`

            const eliminar = document.querySelectorAll('.eliminar');
            eliminar.forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    //console.log(e.target.dataset.id);
                    await eliminarTarea(e.target.dataset.id)
                });
            });

            const editar = document.querySelectorAll('.editar');
            editar.forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const doc = await editarTarea(e.target.dataset.id)
                    const t = doc.data()

                    editStatus = true;
                    id = doc.id

                    formulario['titulo'].value = t.titulo;
                    formulario['descripcion'].value = t.descripcion;
                    formulario['btn-tarea-form'].innerHTML = 'Actualizar';
                });
            });

        });
    });
});

formulario.addEventListener('submit', async (e) => {
    e.preventDefault();

    const titulo = formulario['titulo'];
    const descripcion = formulario['descripcion'];

    if (!editStatus) {
        await guardar(titulo.value, descripcion.value);
    } else {
        await actualizar(id, {
            titulo: titulo.value,
            descripcion: descripcion.value
        });
        editStatus = false;
        id = ''
        formulario['btn-tarea-form'].innerHTML = 'Guardar';
    }
    await obtenerTareas();
    formulario.reset();
    titulo.focus();
});