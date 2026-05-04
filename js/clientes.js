console.log("CLIENTES JS OK");

// =======================
// VARIABLES
// =======================
let clientesDB = [];
let clienteEditando = null;

// ELEMENTOS
const listaClientes = document.getElementById("listaClientes");
const buscador = document.getElementById("buscadorCliente");
const filtro = document.getElementById("filtroClientes");
const alertasClientes = document.getElementById("alertasClientes");

// =======================
// CREAR CLIENTE
// =======================
async function crearCliente(){

  async function checkAuth(){

    const { data } = await supabase.auth.getUser();

    if(!data.user){
        window.location.href = "login.html";
        return;
    }

    const { data: usuarioDB } = await supabase
        .from("usuarios")
        .select("*")
        .eq("auth_id", data.user.id)
        .single();

    window.usuario = usuarioDB;
}

    const cliente = {
        nombre: nombreCliente.value,
        apellido: apellidoCliente.value,
        fechadenacimiento: fechadenacimiento.value,
        dni: dni.value,
        telefonocliente: telefonocliente.value,
        agencia_id: usuario.agencia_id   // 🔥 CLAVE
    };

    const { error } = await supabase
        .from("clientes")
        .insert([cliente]);

    if(error){
        console.error("ERROR SUPABASE:", error);
        alert("Error real: " + error.message);
        return;
    }

    alert("Cliente guardado 🔥");

    renderClientes();
}

// =======================
// RENDER
// =======================
async function renderClientes(){

    const { data } = await supabase
        .from("clientes")
        .select("*");

    clientesDB = data || [];

    detectarAlertas();
    aplicarFiltros();
}

// =======================
// ALERTAS
// =======================
function detectarAlertas(){

    if(!alertasClientes) return;

    const hoy = new Date();

    const alertas = clientesDB.filter(c =>
        c.fechadevencimientodni &&
        new Date(c.fechadevencimientodni) < hoy
    );

    alertasClientes.innerHTML = alertas.map(a =>
        `<div class="alert">⚠ ${a.nombre} DNI vencido</div>`
    ).join("");
}

// =======================
// EDAD
// =======================
function calcularEdad(fecha){
    if(!fecha) return 0;

    const hoy = new Date();
    const nacimiento = new Date(fecha);

    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();

    if(m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())){
        edad--;
    }

    return edad;
}

// =======================
// FILTROS
// =======================
function aplicarFiltros(){

    let lista = [...clientesDB];

    const valor = buscador?.value?.toLowerCase() || "";

    lista = lista.filter(c =>
        `${c.nombre} ${c.apellido}`.toLowerCase().includes(valor)
    );

    if(filtro?.value === "menores"){
        lista = lista.filter(c => calcularEdad(c.fechadenacimiento) < 18);
    }

    if(filtro?.value === "dni_vencido"){
        const hoy = new Date();
        lista = lista.filter(c =>
            new Date(c.fechadevencimientodni) < hoy
        );
    }

    pintarClientes(lista);
}

// =======================
// BUSCADOR EVENTOS
// =======================
if(buscador){
    buscador.addEventListener("input", aplicarFiltros);
}

if(filtro){
    filtro.addEventListener("change", aplicarFiltros);
}

// =======================
// PINTAR
// =======================
function pintarClientes(lista){

    listaClientes.innerHTML = lista.map(c => `
        <div class="card">
            <b>${c.nombre} ${c.apellido}</b>
            <br>DNI: ${c.dni || "-"}
            <br>
            <button onclick="abrirEditar('${c.id}')">Editar</button>
            <button onclick="eliminarCliente('${c.id}')">Eliminar</button>
        </div>
    `).join("");
}

// =======================
// EDITAR
// =======================
function abrirEditar(id){
    clienteEditando = id;
    modalEditar.style.display = "flex";
}

async function guardarEdicion(){

    const { error } = await supabase
        .from("clientes")
        .update({
            nombre: editNombre.value,
            apellido: editApellido.value
        })
        .eq("id", clienteEditando);

    modalEditar.style.display = "none";

    renderClientes();
}

// =======================
// ELIMINAR
// =======================
async function eliminarCliente(id){

    if(!confirm("Eliminar?")) return;

    await supabase.from("clientes").delete().eq("id", id);

    renderClientes();
}

// INIT
renderClientes();